import os
import json
import requests
from llm import get_llm_response
from dotenv import load_dotenv

load_dotenv()

def analyze_data_stream(data_context: str, user_query: str):
    """
    🧭 Root Agent (Orchestrator)
    - Understands: dataset, goal
    - Decides which agent to call
    - Sequences tasks
    - Merges outputs
    Yields dynamic status updates.
    """
    yield {"step": "root", "status": "Analyzing request and dataset snippet...", "content": ""}
    
    file_headers = [line for line in data_context.split('\n') if line.startswith('--- File:')]
    file_info = "\n".join(file_headers) if file_headers else "Unknown files"

    plan_prompt = f"""
You are the 🧭 Root Agent. The user wants insights from the data.
User Query: "{user_query}"

The provided dataset contains the following files:
{file_info}

Here is a snippet of the dataset:
{data_context[:2500]}

Analyze the user query and the data snippet. 
CRITICAL RULES:
1. ALWAYS assign a "processing_task" to the Data Processing Agent to clean the data (handle missing values, duplicates, or formatting issues) before analysis, unless the data is explicitly just simple text.
2. ALWAYS assign an "analysis_task" that DIRECTLY aligns with the User Query. 
   - If the user asks a specific question (e.g. "what is the average age?"), the task must be to answer that exact question. 
   - If the user asks for general insights, the task should demand deep, multi-dimensional analysis. 

Respond in pure JSON format exactly like this:
{{
    "processing_task": "instructions (e.g. clean data, drop nulls, fix duplicates) or null",
    "analysis_task": "instructions (e.g. perform deep multi-dimensional analysis) or null",
    "direct_response": "If no analysis needed, just talk to user directly"
}}
"""
    try:
        plan_str = get_llm_response(plan_prompt, is_json=True)
        plan = json.loads(plan_str)
    except Exception as e:
        yield {"step": "error", "status": f"Root Agent failed to plan. {e}", "content": ""}
        return

    if plan.get("direct_response"):
        yield {"step": "root_direct", "status": "Answering directly.", "content": plan["direct_response"]}
        return

    yield {"step": "root", "status": "Task delegation planned.", "content": f"Understood Goal: {user_query}"}
    
    current_data = data_context

    # 2. Calls Data Processing Agent API
    if plan.get("processing_task"):
        yield {"step": "processing", "status": f"Assigned Task: {plan['processing_task']}", "content": ""}
        try:
            res = requests.post("http://127.0.0.1:8000/process", json={
                "task": plan["processing_task"],
                "data": current_data
            })
            if res.status_code == 200:
                dp_result = res.json()
                summary = dp_result.get('summary', 'Data processed.')
                yield {"step": "processing_done", "status": "Data cleaned successfully.", "content": summary}
                
                cleaned_data = dp_result.get("cleaned_data_markdown", "")
                current_data = cleaned_data if cleaned_data else current_data
            else:
                yield {"step": "error", "status": f"Data Processing API Error: {res.text}", "content": ""}
        except requests.exceptions.ConnectionError:
            yield {"step": "error", "status": "Data Processing Connection Error: API server not running on port 8000.", "content": ""}
        except Exception as e:
            yield {"step": "error", "status": f"Data Processing Agent Error: {str(e)}", "content": ""}

    # 4. Calls Analysis Agent API
    if plan.get("analysis_task"):
        yield {"step": "analysis", "status": f"Assigned Task: {plan['analysis_task']}", "content": ""}
        try:
            res = requests.post("http://127.0.0.1:8000/analyze", json={
                "task": plan["analysis_task"],
                "data": current_data
            })
            if res.status_code == 200:
                an_result = res.json()
                insights = "\n".join([f"- {i}" for i in an_result.get("insights", [])])
                yield {"step": "analysis_done", "status": "Insights generated.", "content": insights}
                
                if an_result.get("graph_code"):
                    yield {"step": "graph_code", "status": "Graph code provided.", "content": an_result['graph_code']}
            else:
                yield {"step": "error", "status": f"Analysis API Error: {res.text}", "content": ""}
        except requests.exceptions.ConnectionError:
            yield {"step": "error", "status": "Analysis Agent Connection Error: API server not running on port 8000.", "content": ""}
        except Exception as e:
            yield {"step": "error", "status": f"Analysis Agent Error: {str(e)}", "content": ""}
