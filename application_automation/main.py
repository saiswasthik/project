import os
import json
import asyncio
from typing import Dict, List, Any, Optional
from dotenv import load_dotenv
from playwright.async_api import async_playwright
import google.generativeai as genai
from groq import Groq

# Load environment variables
load_dotenv()

class LLMProvider:
    """Unified interface for multiple LLM providers."""
    def __init__(self, provider: str = "gemini"):
        self.provider = os.getenv("LLM_PROVIDER", provider).lower()
        self.gemini_model = None
        self.groq_client = None
        self._configure()

    def _configure(self):
        if self.provider == "gemini":
            api_key = os.getenv("GOOGLE_API_KEY")
            if api_key:
                genai.configure(api_key=api_key)
                # List of models to try in order
                self.models_to_try = [
                    "gemini-2.0-flash-lite", 
                    "gemini-2.0-flash", 
                    "gemini-1.5-flash",
                    "gemini-flash-latest"
                ]
                self.current_model_idx = 0
                self._update_gemini_model()
            else:
                print("Warning: GOOGLE_API_KEY not found in .env.")
        elif self.provider == "groq":
            api_key = os.getenv("GROQ_API_KEY")
            if api_key:
                self.groq_client = Groq(api_key=api_key)
            else:
                print("Warning: GROQ_API_KEY not found in .env.")

    def _update_gemini_model(self):
        if self.current_model_idx < len(self.models_to_try):
            model_name = self.models_to_try[self.current_model_idx]
            self.gemini_model = genai.GenerativeModel(model_name)
            return True
        return False

    async def generate_mapping(self, prompt: str, retries: int = 3) -> Dict[str, str]:
        """Generate field mapping with exponential backoff and model rotation."""
        for attempt in range(retries):
            try:
                if self.provider == "gemini" and self.gemini_model:
                    response = self.gemini_model.generate_content(prompt)
                    text = response.text.strip()
                elif self.provider == "groq" and self.groq_client:
                    completion = self.groq_client.chat.completions.create(
                        model="llama-3.3-70b-versatile",
                        messages=[{"role": "user", "content": prompt}],
                        response_format={"type": "json_object"}
                    )
                    text = completion.choices[0].message.content.strip()
                else:
                    return {}

                # Parse JSON
                if "```json" in text:
                    text = text.split("```json")[1].split("```")[0].strip()
                elif "```" in text:
                    text = text.split("```")[1].strip()
                return json.loads(text)

            except Exception as e:
                error_msg = str(e)
                if "429" in error_msg:
                    print(f"⚠️ Quota hit (429) on {self.models_to_try[self.current_model_idx] if self.provider == 'gemini' else 'Groq'}.")
                    
                    # Try rotating Gemini model if applicable
                    if self.provider == "gemini":
                        self.current_model_idx += 1
                        if self._update_gemini_model():
                            print(f"🔄 Rotating to model: {self.models_to_try[self.current_model_idx]}")
                            continue # Try immediately with new model
                    
                    wait_time = (attempt + 1) * 15
                    print(f"⏳ Waiting {wait_time}s before retry {attempt + 1}/{retries}...")
                    await asyncio.sleep(wait_time)
                    continue
                
                if "403" in error_msg or "Access denied" in error_msg:
                    print(f"\n❌ {self.provider.upper()} ACCESS DENIED (403). Groq/Gemini is blocking your VPN IP.")
                    break
                
                print(f"Error with {self.provider}: {e}")
                break
        return {}

class LocalMapper:
    """Heuristic-based mapper for common fields when LLM fails."""
    def __init__(self, details: Dict[str, Any]):
        self.details = details

    def get_mapping(self, fields: List[Dict[str, Any]]) -> Dict[str, str]:
        mapping = {}
        personal = self.details.get('personal', {})
        profiles = self.details.get('profiles', {})
        app = self.details.get('application', {})

        for field in fields:
            # Identifier to use as key
            fid = field.get('id') or field.get('name')
            if not fid: continue

            label = field.get('label', '').lower()
            name = field.get('name', '').lower()
            search_text = f"{label} {name} {fid.lower()}".strip()

            # Personal Info
            if any(k in search_text for k in ['first name', 'given name']):
                mapping[fid] = personal.get('first_name')
            elif any(k in search_text for k in ['last name', 'family name', 'surname']):
                mapping[fid] = personal.get('last_name')
            elif 'email' in search_text:
                mapping[fid] = personal.get('email')
            elif any(k in search_text for k in ['phone', 'mobile', 'contact', 'telephone']):
                mapping[fid] = personal.get('phone')
            elif any(k in search_text for k in ['city', 'location']):
                mapping[fid] = personal.get('city')
            
            # Profiles
            elif 'linkedin' in search_text:
                mapping[fid] = profiles.get('linkedin')
            elif 'github' in search_text:
                mapping[fid] = profiles.get('github')
            elif any(k in search_text for k in ['portfolio', 'website']):
                mapping[fid] = profiles.get('portfolio')
            
            # Common Application Questions
            elif 'salary' in search_text:
                mapping[fid] = app.get('salary_expectation')
            elif 'authorized' in search_text:
                mapping[fid] = "Yes" # Default to yes if matching authorized
            elif 'sponsorship' in search_text:
                mapping[fid] = app.get('visa_sponsorship')
            
        return mapping

class JobAutomator:
    def __init__(self, details_path: str):
        with open(details_path, 'r') as f:
            self.user_details = json.load(f)
        self.llm = LLMProvider()
        self.local_mapper = LocalMapper(self.user_details)

    async def extract_form_fields(self, page) -> List[Dict[str, Any]]:
        """Extract relevant form fields from the current page."""
        fields = await page.evaluate('''() => {
            const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
            return inputs.map(input => {
                let labelText = '';
                const id = input.id;
                
                const label = document.querySelector(`label[for="${id}"]`);
                if (label) {
                    labelText = label.innerText.trim();
                } else {
                    const parentLabel = input.closest('label');
                    if (parentLabel) {
                        labelText = parentLabel.innerText.trim();
                    } else {
                        labelText = input.getAttribute('placeholder') || input.getAttribute('aria-label') || input.name || "";
                    }
                }
                
                let options = [];
                if (input.tagName.toLowerCase() === 'select') {
                    options = Array.from(input.options).map(opt => ({
                        text: opt.text.trim(),
                        value: opt.value
                    }));
                }

                return {
                    id: id,
                    name: input.name,
                    type: input.type,
                    tagName: input.tagName.toLowerCase(),
                    label: labelText,
                    placeholder: input.getAttribute('placeholder'),
                    options: options,
                    value: input.value
                };
            }).filter(f => f.type !== 'hidden' && f.type !== 'submit' && f.type !== 'button');
        }''')
        return fields

    async def get_field_mapping(self, fields: List[Dict[str, Any]]) -> Dict[str, str]:
        """Use LLM to map extracted fields, fallback to LocalMapper if failed."""
        prompt = f"""
        Map these job form fields to the user details provided.
        Respond with ONLY a JSON object: {{"field_id_or_name": "value"}}.
        
        Fields: {json.dumps([{ 'id': f['id'], 'name': f['name'], 'label': f['label'], 'options': f.get('options')} for f in fields], indent=1)}
        User: {json.dumps(self.user_details, indent=1)}
        """
        
        mapping = await self.llm.generate_mapping(prompt)
        
        if not mapping:
            print("⚠️ LLM failed or quota exceeded. Using local heuristic fallback...")
            mapping = self.local_mapper.get_mapping(fields)
        
        return mapping

    async def fill_application(self, browser_context, url: str):
        """Navigate to a URL and fill the application."""
        page = await browser_context.new_page()
        print(f"Processing: {url}")
        
        try:
            await page.goto(url, wait_until="networkidle")
            
            # 1. Extract fields
            fields = await self.extract_form_fields(page)
            print(f"Found {len(fields)} fields.")
            
            # 2. Map fields via LLM
            mapping = await self.get_field_mapping(fields)
            
            # 3. Fill the fields
            for name_or_id, value in mapping.items():
                if not value: continue
                try:
                    selector = f'[name="{name_or_id}"], #{name_or_id}, [id="{name_or_id}"]'
                    element = await page.query_selector(selector)
                    if element:
                        tag_name = await element.evaluate('el => el.tagName.toLowerCase()')
                        type_attr = await element.evaluate('el => el.getAttribute("type")')
                        
                        if tag_name == 'select':
                            await page.select_option(selector, value)
                        elif type_attr == 'checkbox':
                            if str(value).lower() in ['yes', 'true', '1']:
                                await page.check(selector)
                        elif type_attr == 'radio':
                            await page.click(f'{selector}[value="{value}"]')
                        else:
                            await page.fill(selector, str(value))
                except Exception as e:
                    print(f"Skipping field {name_or_id}: {e}")

            # 4. Handle file uploads (e.g., resume)
            resume_selectors = ['input[type="file"][name*="resume"]', 'input[type="file"][id*="resume"]', '.resume-upload input']
            for selector in resume_selectors:
                try:
                    resume_input = await page.query_selector(selector)
                    if resume_input:
                        resume_path = os.path.abspath(self.user_details['files']['resume_path'])
                        if os.path.exists(resume_path):
                            await resume_input.set_input_files(resume_path)
                            print(f"Uploaded resume: {resume_path}")
                        break
                except Exception:
                    continue

            print(f"Finished filling application for {url}")
            print("Please review the application and submit manually.")
            input("Press Enter to continue to the next application...")
            
        except Exception as e:
            print(f"Error processing {url}: {e}")
        finally:
            await page.close()

async def main():
    automator = JobAutomator('details.json')
    
    urls = []
    # Load from urls.txt first
    if os.path.exists('urls.txt'):
        with open('urls.txt', 'r') as f:
            # Clean up: strip whitespace, remove trailing commas
            urls.extend([line.strip().rstrip(',') for line in f if line.strip()])
    
    # Also load from demo.txt if requested/exists
    if os.path.exists('demo.txt'):
         with open('demo.txt', 'r') as f:
             urls.extend([line.strip().rstrip(',') for line in f if line.strip()])

    # De-duplicate while preserving order
    urls = list(dict.fromkeys(urls))
    
    if not urls:
        url = input("Enter a job application URL: ").strip().rstrip(',')
        urls.append(url)
    
    async with async_playwright() as p:
        # Launch browser (headless=False so user can review)
        browser = await p.chromium.launch(headless=False)
        
        # Check for proxy configuration in environment
        proxy_server = os.getenv("PROXY_SERVER")
        if proxy_server:
            context = await browser.new_context(proxy={"server": proxy_server})
        else:
            context = await browser.new_context()
        
        for url in urls:
            if not url.startswith('http'):
                print(f"Skipping invalid URL: {url}")
                continue
            await automator.fill_application(context, url)
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
