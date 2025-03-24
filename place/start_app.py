import subprocess
import sys
import time
import webbrowser
from pathlib import Path

def start_backend():
    """Start the FastAPI backend server"""
    backend_path = Path("backend")
    return subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "main:app", "--reload"],
        cwd=backend_path,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

def start_frontend():
    """Start the Streamlit frontend server"""
    frontend_path = Path("frontend")
    return subprocess.Popen(
        [sys.executable, "-m", "streamlit", "run", "app.py"],
        cwd=frontend_path,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

def main():
    print("Starting City Places Explorer...")
    
    # Start backend
    print("Starting backend server...")
    backend_process = start_backend()
    time.sleep(2)  # Wait for backend to start
    
    # Start frontend
    print("Starting frontend server...")
    frontend_process = start_frontend()
    
    # Wait a moment for servers to start
    time.sleep(3)
    
    # Open the browser
    print("Opening browser...")
    webbrowser.open("http://localhost:8501")
    
    try:
        # Keep the script running and monitor the processes
        while True:
            backend_returncode = backend_process.poll()
            frontend_returncode = frontend_process.poll()
            
            if backend_returncode is not None:
                print("Backend server stopped unexpectedly!")
                break
            if frontend_returncode is not None:
                print("Frontend server stopped unexpectedly!")
                break
                
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\nShutting down servers...")
        backend_process.terminate()
        frontend_process.terminate()
        print("Servers stopped.")

if __name__ == "__main__":
    main() 