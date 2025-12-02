import time
import os
import re
import textwrap
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from scrapper.pdf_downloader import download_pdf
from ppt.ppt_generator import create_individual_ppt
from ai.llm_client import get_gemini_summary
from extractor.cleaner import sanitize_filename
from datetime import datetime, timedelta
from selenium.common.exceptions import NoSuchElementException, ElementClickInterceptedException


Download_dir="output/downloaded_pdfs"
os.makedirs(Download_dir, exist_ok=True)


def go_to_next_page(driver):
    try:
        next_button = driver.find_element(By.CSS_SELECTOR, "li.pager__item--next a")
        driver.execute_script("arguments[0].scrollIntoView(true);", next_button)
        next_button.click()
        time.sleep(2)
        return True
    except NoSuchElementException:
        return False
    except ElementClickInterceptedException:
        driver.execute_script("arguments[0].click();", next_button)
        time.sleep(2)
        return True


def filter_by_date(date_text, start_date=None, end_date=None):
    """
    date_text: '01/22/2025'
    start_date, end_date: datetime objects
    """
    try:
        row_date = datetime.strptime(date_text, "%m/%d/%Y")
    except:
        return False

    if start_date and row_date < start_date:
        return False
    if end_date and row_date > end_date:
        return False

    return True


def main_workflow():
    options = Options()
    options.add_argument("--disable-blink-features=AutomationControlled") 
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    try:
        print("Getting links...")
        driver.get("https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/compliance-actions-and-activities/warning-letters")
        # driver.get("https://www.fda.gov/medical-devices/covid-19-emergency-use-authorizations-medical-devices/in-vitro-diagnostics-euas-antigen-diagnostic-tests-sars-cov-2")
        time.sleep(3)

        items = []
        page_number = 1

        start_date = datetime.now() - timedelta(days=30)
        end_date = datetime.now()

        while True:
            print(f"Scraping page {page_number}...")

            rows = driver.find_elements(By.CSS_SELECTOR, "table tbody tr")

            for row in rows:
                cols = row.find_elements(By.TAG_NAME, "td")
                if len(cols) < 3:
                    continue

                date_posted = cols[0].text.strip()

                if not filter_by_date(date_posted, start_date, end_date):
                    continue

                try:
                    link = row.find_element(By.TAG_NAME, "a").get_attribute("href")
                    items.append({
                        "Date Posted": date_posted,
                        "Company": cols[2].text,
                        "URL": link
                    })
                except:
                    continue

            if not go_to_next_page(driver):
                break

            page_number += 1
            time.sleep(2)
        
        print(f"Processing {len(items)} letters...")

        for item in items:
            print(f"  > Reading: {item['Company']}")
            driver.get(item['URL'])
            time.sleep(2)
            print(item['URL'])

            if item['URL'].endswith(".pdf") or "download" in item['URL']:
                pdf_filename = f"{sanitize_filename(item['Company'])}.pdf"
                pdf_filepath = os.path.join(Download_dir, pdf_filename)
                download_pdf(item['URL'])
                continue
            try:
                content = driver.find_element(By.CSS_SELECTOR, "div[role='main']").text
                # print(content)
            except:
                content = driver.find_element(By.TAG_NAME, "body").text
                print(content)
            
            # Generate Summary
            item['Summary'] = get_gemini_summary(content)
            
            # Create the PPT with auto-splitting
            create_individual_ppt(item)

    except Exception as e:
        print(f"Error: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    main_workflow()