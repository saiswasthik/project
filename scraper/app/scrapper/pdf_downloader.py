import requests
from PyPDF2 import PdfReader





def download_pdf(url):
    # print(f"  > Downloading PDF: {filename}")
    response = requests.get(url, stream=True)

    with open(url, "wb") as f:
        for chunk in response.iter_content(chunk_size=4096):
            if chunk:
                f.write(chunk)

    print("  > Download complete.")


# def download_pdf(url):

#     reader = PdfReader(url)
#     text = ""
#     for page in reader.pages:
#         text += page.extract_text() + "\n"
#     return text