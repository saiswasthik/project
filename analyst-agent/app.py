import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import re
from parser import parse_file
from agent import analyze_data_stream
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

st.set_page_config(page_title="Data Analyst AI Agent", page_icon="📊", layout="wide")

st.title("📊 Data Analyst AI Agent")
st.markdown("""
Upload your data files (PDF, Excel, Word, CSV, TXT) and ask questions about them!
""")

# Setup sidebar for API Key
with st.sidebar:
    st.header("Configuration")
    api_key = st.text_input("Google Gemini API Key", type="password")
    if api_key:
        os.environ["GEMINI_API_KEY"] = api_key
        st.success("Gemini API Key saved!")
        
    groq_api_key = st.text_input("Groq API Key (Fallback)", type="password")
    if groq_api_key:
        os.environ["GROQ_API_KEY"] = groq_api_key
        st.success("Groq API Key saved!")
        
    if not api_key and not groq_api_key:
        st.warning("Please enter at least one API key to use the app.")
        
    st.markdown("---")
    st.markdown("### Supported formats:")
    st.markdown("- **Spreadsheets**: .csv, .xlsx, .xls")
    st.markdown("- **Documents**: .pdf, .docx, .txt")

# Main interface
uploaded_files = st.file_uploader("Upload files", accept_multiple_files=True, type=['csv', 'xlsx', 'xls', 'pdf', 'docx', 'txt'])

if "chat_history" not in st.session_state:
    st.session_state.chat_history = []
    
if "data_context" not in st.session_state:
    st.session_state.data_context = ""

# Process files
if uploaded_files:
    if st.button("Process Files"):
        with st.spinner("Analyzing files..."):
            combined_text = ""
            for file in uploaded_files:
                parsed_text = parse_file(file)
                combined_text += f"\n\n--- File: {file.name} ---\n{parsed_text}"
            
            st.session_state.data_context = combined_text
            st.success(f"Successfully processed {len(uploaded_files)} file(s)!")
            with st.expander("View extracted data"):
                st.text(st.session_state.data_context[:2000] + "\n\n... (truncated for display)")

# Chat Interface
st.header("Chat with your Data")

for message in st.session_state.chat_history:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])
        if message["role"] == "assistant":
            code_blocks = re.findall(r'```python\n(.*?)\n```', message["content"], re.DOTALL)
            for code in code_blocks:
                if "st." in code or "plt." in code:
                    try:
                        exec_globals = {'st': st, 'pd': pd, 'plt': plt}
                        exec(code, exec_globals)
                    except Exception as e:
                        st.error(f"Error rendering historical graph: {e}")

user_query = st.chat_input("Ask something about the uploaded data...")

if user_query:
    # Add user message to chat history
    st.session_state.chat_history.append({"role": "user", "content": user_query})
    with st.chat_message("user"):
        st.markdown(user_query)

    # Generate response
    with st.chat_message("assistant"):
        if not st.session_state.data_context:
            st.warning("Please upload and process some files first!")
            st.session_state.chat_history.append({"role": "assistant", "content": "Please upload and process some files first!"})
        elif not os.environ.get("GEMINI_API_KEY") and not os.environ.get("GROQ_API_KEY"):
            st.error("Please enter an API Key in the sidebar.")
            st.session_state.chat_history.append({"role": "assistant", "content": "API Key missing."})
        else:
            final_response = ""
            with st.status("🤖 Multi-Agent Workflow Initiated...", expanded=True) as status:
                for update in analyze_data_stream(st.session_state.data_context, user_query):
                    if update["step"] == "root":
                        st.write(f"🧭 **Root Agent:** {update['status']}")
                        if update["content"]:
                            st.info(update["content"])
                            final_response += f"### 🧭 Root Agent Orchestration\n*{update['content']}*\n\n---\n"
                    elif update["step"] == "root_direct":
                        st.write(f"🧭 **Root Agent:** {update['status']}")
                        final_response = update["content"]
                    elif update["step"] == "processing":
                        st.write(f"📊 **Data Processing Agent:** {update['status']}")
                    elif update["step"] == "processing_done":
                        st.success(f"**Data Processing Agent:** {update['content']}")
                        final_response += f"**📊 Data Processing Agent:**\n*{update['content']}*\n\n---\n"
                    elif update["step"] == "analysis":
                        st.write(f"📈 **Analysis Agent:** {update['status']}")
                    elif update["step"] == "analysis_done":
                        st.write(f"**Insights:**\n{update['content']}")
                        final_response += f"**📈 Analysis Agent Insights:**\n{update['content']}\n"
                    elif update["step"] == "error":
                        st.error(update["status"])
                        final_response += f"**Error:** {update['status']}\n"
                    elif update["step"] == "graph_code":
                        final_response += f"\n{update['content']}\n"
                
                status.update(label="Workflow Complete!", state="complete", expanded=False)

            st.markdown(final_response)
            st.session_state.chat_history.append({"role": "assistant", "content": final_response})
            
            code_blocks = re.findall(r'```python\n(.*?)\n```', final_response, re.DOTALL)
            for code in code_blocks:
                if "st." in code or "plt." in code:
                    try:
                        exec_globals = {'st': st, 'pd': pd, 'plt': plt}
                        exec(code, exec_globals)
                    except Exception as e:
                        st.error(f"Error rendering graph: {e}")
