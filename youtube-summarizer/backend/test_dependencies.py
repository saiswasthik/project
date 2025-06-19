#!/usr/bin/env python3
"""
Test script to check package dependencies and identify potential issues
"""

import pkg_resources
import sys

def check_packages():
    """Check installed packages and their versions"""
    print("Python version:", sys.version)
    print("\nInstalled packages:")
    
    for package in pkg_resources.working_set:
        print(f"  {package.key}=={package.version}")
    
    # Check for potentially problematic packages
    problematic_packages = [
        'pydantic',
        'fastapi',
        'uvicorn',
        'google-generativeai',
        'youtube-transcript-api'
    ]
    
    print("\nChecking key packages:")
    for package_name in problematic_packages:
        try:
            version = pkg_resources.get_distribution(package_name).version
            print(f"  ✅ {package_name}=={version}")
        except pkg_resources.DistributionNotFound:
            print(f"  ❌ {package_name} not found")

if __name__ == "__main__":
    check_packages() 