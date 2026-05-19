import pdfplumber
import easyocr
import os

class TEXTEXTRACTOR:
    def __init__(self):
        self.reader = easyocr.Reader(['en'], gpu=False)

    def extract_text_from_pdf(self, file_path: str) -> str:
        text = ""
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            print(f"Error reading PDF {file_path}: {e}")
        return text

    def extract_text_from_image(self, file_path: str) -> str:
        try:
            result = self.reader.readtext(file_path, detail=0)
            return "\n".join(result)
        except Exception as e:
            print(f"Error reading image {file_path}: {e}")
            return ""

    def extract_all_text(self, file_paths: list[str]) -> dict[str, str]:
        all_text_data = {}

        for file_path in file_paths:
            print(f"Processing file: {file_path}")
            ext = os.path.splitext(file_path)[1].lower()
            file_name = os.path.basename(file_path)

            text = ""
            if ext in [".pdf", ".txt"]:
                text = self.extract_text_from_pdf(file_path)
            elif ext in [".png", ".jpg", ".jpeg", ".bmp", ".tiff"]:
                text = self.extract_text_from_image(file_path)
            else:
                print(f"Unsupported file type: {file_path}")
                continue

            if text:
                all_text_data[file_name] = text
        
        return all_text_data
