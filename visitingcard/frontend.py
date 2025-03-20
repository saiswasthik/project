import streamlit as st
import requests
import pandas as pd
import json
from datetime import datetime
import io
import os

st.set_page_config(page_title="Business Card Data Extractor", layout="wide")

st.title("Business Card Data Extractor")

# Initialize session state for storing extracted data
if 'extracted_data_list' not in st.session_state:
    st.session_state.extracted_data_list = []

def load_data_from_server():
    try:
        response = requests.get("http://localhost:8000/get-all-data")
        if response.status_code == 200:
            data = response.json()
            if "data" in data:
                return data["data"]
        return []
    except Exception as e:
        st.error(f"Error loading data from server: {str(e)}")
        return []

def save_data_to_server(data_list):
    try:
        # Convert data to DataFrame
        df = pd.DataFrame(data_list)
        
        # Create an in-memory Excel file
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df.to_excel(writer, index=False, sheet_name='Business Cards')
            
            # Auto-adjust columns' width
            worksheet = writer.sheets['Business Cards']
            for idx, col in enumerate(df.columns):
                series = df[col]
                max_len = max(
                    series.astype(str).map(len).max(),
                    len(str(series.name))
                ) + 1
                worksheet.set_column(idx, idx, max_len)
        
        # Send the Excel file to the server
        files = {"file": ("business_cards_data.xlsx", output.getvalue(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
        response = requests.post("http://localhost:8000/save-data", files=files)
        return response.status_code == 200
    except Exception as e:
        st.error(f"Error saving data to server: {str(e)}")
        return False

def delete_by_mobile(mobile_number):
    try:
        response = requests.post(f"http://localhost:8000/delete-by-mobile/{mobile_number}")
        if response.status_code == 200:
            st.session_state.extracted_data_list = load_data_from_server()
            st.success("Entry deleted successfully!")
            st.experimental_rerun()
        else:
            st.error("Failed to delete entry")
    except Exception as e:
        st.error(f"Error deleting entry: {str(e)}")

def clear_all_data():
    try:
        # Clear data on server
        response = requests.post("http://localhost:8000/clear-all-data")
        if response.status_code == 200:
            # Clear session state
            st.session_state.extracted_data_list = []
            st.success("All data has been cleared successfully!")
            st.experimental_rerun()
        else:
            st.error("Failed to clear data on server")
    except Exception as e:
        st.error(f"Error clearing data: {str(e)}")

def generate_excel(data_list):
    try:
        # Create a DataFrame from all extracted data
        df = pd.DataFrame(data_list)
        
        # Create an in-memory Excel file
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df.to_excel(writer, index=False, sheet_name='Business Cards')
            
            # Auto-adjust columns' width
            worksheet = writer.sheets['Business Cards']
            for idx, col in enumerate(df.columns):
                series = df[col]
                max_len = max(
                    series.astype(str).map(len).max(),
                    len(str(series.name))
                ) + 1
                worksheet.set_column(idx, idx, max_len)
        
        return output.getvalue()
    except Exception as e:
        st.error(f"Error generating Excel file: {str(e)}")
        return None

def process_image(image_file):
    try:
        # Send the image to the FastAPI backend
        files = {"file": image_file.getvalue()}
        response = requests.post("http://localhost:8000/extract", files=files)
        
        if response.status_code == 200:
            response_data = response.json()
            if "data" in response_data:
                return response_data["data"], None
        return None, "Failed to extract data"
    except Exception as e:
        return None, str(e)

# Load existing data from server
st.session_state.extracted_data_list = load_data_from_server()

# Show total entries count at the top
if len(st.session_state.extracted_data_list) > 0:
    st.info(f"Total entries in database: {len(st.session_state.extracted_data_list)}")

# File uploader for multiple files
uploaded_files = st.file_uploader("Upload Business Card Images", type=["jpg", "jpeg", "png"], accept_multiple_files=True)

if uploaded_files:
    # Process button
    if st.button("Extract Information"):
        progress_text = "Processing images..."
        progress_bar = st.progress(0)
        
        # Display processing status
        status_container = st.empty()
        
        try:
            total_files = len(uploaded_files)
            successful = 0
            failed = 0
            
            for idx, uploaded_file in enumerate(uploaded_files):
                status_container.write(f"Processing image {idx + 1} of {total_files}: {uploaded_file.name}")
                
                # Process the image
                extracted_data, error = process_image(uploaded_file)
                
                if extracted_data:
                    # Check if all values are N/A
                    all_na = all(value == "N/A" for value in extracted_data.values())
                    
                    if not all_na:
                        # Add new data to the list
                        st.session_state.extracted_data_list.append(extracted_data)
                        
                        # Save updated data to server
                        if save_data_to_server(st.session_state.extracted_data_list):
                            successful += 1
                            st.success(f"Successfully extracted and added to Excel sheet: {extracted_data.get('First Name', '')} {extracted_data.get('Last Name', '')}")
                            st.info(f"Total entries in database: {len(st.session_state.extracted_data_list)}")
                        else:
                            failed += 1
                            st.error("Failed to save data to server")
                    else:
                        failed += 1
                        st.warning(f"Could not extract information from {uploaded_file.name}")
                else:
                    failed += 1
                    st.warning(f"Failed to process {uploaded_file.name}: {error}")
                
                # Update progress bar
                progress_bar.progress((idx + 1) / total_files)
            
            # Clear the status container
            status_container.empty()
            
            # Show summary
            st.write(f"Processing complete! Successfully processed {successful} images, failed to process {failed} images.")
            
            # Display the extracted information if any
            if len(st.session_state.extracted_data_list) > 0:
                st.subheader("Extracted Information")
                
                # Create two columns
                col1, col2 = st.columns(2)
                
                with col1:
                    st.write("Latest Entry:")
                    latest_data = st.session_state.extracted_data_list[-1]
                    for key, value in latest_data.items():
                        st.write(f"**{key}:** {value}")
                
                with col2:
                    st.write("All Extracted Entries (Total: {})".format(len(st.session_state.extracted_data_list)))
                    df_all = pd.DataFrame(st.session_state.extracted_data_list)
                    st.dataframe(df_all, use_container_width=True)
                    
                    # Add note about data persistence
                    st.info("All entries are automatically saved and will remain in the database even after page refresh.")
                
                # Download Excel button
                if len(st.session_state.extracted_data_list) > 0:
                    excel_data = generate_excel(st.session_state.extracted_data_list)
                    if excel_data:
                        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                        filename = f"business_cards_{timestamp}.xlsx"
                        st.download_button(
                            label="Download Excel",
                            data=excel_data,
                            file_name=filename,
                            mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                
        except Exception as e:
            st.error("Error processing the request. Please try again.")

# Display all entries with delete buttons
if len(st.session_state.extracted_data_list) > 0:
    st.subheader("Manage Entries")
    
    # Create two columns for delete and download options
    col1, col2 = st.columns(2)
    
    with col1:
        # Add delete by mobile number section
        st.write("Delete Entry by Mobile Number")
        mobile_to_delete = st.text_input("Enter mobile number to delete:")
        if st.button("Delete by Mobile Number"):
            if mobile_to_delete:
                delete_by_mobile(mobile_to_delete)
            else:
                st.warning("Please enter a mobile number")
    
    with col2:
        # Add download Excel button
        st.write("Download Data")
        excel_data = generate_excel(st.session_state.extracted_data_list)
        if excel_data:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"business_cards_{timestamp}.xlsx"
            st.download_button(
                label="Download Excel Sheet",
                data=excel_data,
                file_name=filename,
                mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )
    
    # Display all entries
    for idx, entry in enumerate(st.session_state.extracted_data_list):
        with st.expander(f"Entry {idx + 1}: {entry.get('First Name', 'Unnamed')} {entry.get('Last Name', '')}"):
            col1, col2 = st.columns([3, 1])
            with col1:
                for key, value in entry.items():
                    st.write(f"**{key}:** {value}")
            with col2:
                if st.button("Delete Entry", key=f"delete_{idx}"):
                    delete_by_mobile(entry.get("Mobile Number", ""))

# Add a sidebar for data management
with st.sidebar:
    st.subheader("Data Management")
    if st.button("Clear All Data", type="primary"):
        if st.warning("Are you sure you want to clear all data? This action cannot be undone."):
            clear_all_data()
    
    # Add refresh button to sync with server
    if st.button("Refresh Data"):
        st.session_state.extracted_data_list = load_data_from_server()
        st.success("Data refreshed from server!")
        st.experimental_rerun()
