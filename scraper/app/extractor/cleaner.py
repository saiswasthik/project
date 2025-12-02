


def split_text_smartly(text, limit):
    """
    Splits long text into a list of smaller chunks that fit on a slide.
    It tries to break at the end of a sentence (.), not in the middle of a word.
    """
    chunks = []
    while len(text) > limit:
        # Find the last period (.) within the limit to break cleanly
        split_index = text.rfind('.', 0, limit)
        
        if split_index == -1: 
            # If no period found, just hard break at space
            split_index = text.rfind(' ', 0, limit)
        
        if split_index == -1:
            # If no space found (huge word), just hard break
            split_index = limit

        # Cut the chunk including the period
        chunk = text[:split_index + 1].strip()
        chunks.append(chunk)
        
        # Remaining text
        text = text[split_index + 1:].strip()
    
    # Add the last remaining piece
    if text:
        chunks.append(text)
        
    return chunks


import re

def sanitize_filename(name):
    # Remove newlines and trim
    name = name.replace("\n", " ").replace("\r", " ").strip()

    # Replace slashes in dates (e.g. 07/23/2024 -> 07-23-2024)
    name = name.replace("/", "-")

    # Remove other illegal Windows characters
    name = re.sub(r'[<>:"\\|?*]', '', name)

    # Collapse extra spaces
    name = re.sub(r'\s+', ' ', name)

    return name
