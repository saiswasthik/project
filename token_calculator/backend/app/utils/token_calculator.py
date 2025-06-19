import tiktoken
import re

def normalize_text(text: str) -> str:
    """
    Normalize text for token counting.
    
    Args:
        text (str): Input text
        
    Returns:
        str: Normalized text
    """
    # Convert to lowercase
    text = text.lower()
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    
    # Remove special characters but keep basic punctuation
    text = re.sub(r'[^\w\s.,!?-]', '', text)
    
    return text.strip()

def calculate_tokens(text: str, model: str = "gpt-3.5-turbo") -> int:
    """
    Calculate the number of tokens in a text using tiktoken.
    
    Args:
        text (str): The text to calculate tokens for
        model (str): The model to use for tokenization (default: gpt-3.5-turbo)
        
    Returns:
        int: Number of tokens in the text
    """
    try:
        # Get the appropriate encoding for the model
        encoding = tiktoken.encoding_for_model(model)
        
        # Normalize the text
        normalized_text = normalize_text(text)
        
        # Split into words
        words = normalized_text.split()
        
        # Calculate tokens for each word
        total_tokens = 0
        for word in words:
            # Encode each word separately
            word_tokens = encoding.encode(word)
            total_tokens += len(word_tokens)
        
        # Add tokens for spaces between words
        space_tokens = len(words) - 1 if len(words) > 1 else 0
        
        # Add tokens for basic formatting
        formatting_tokens = 2  # For basic message formatting
        
        return total_tokens + space_tokens + formatting_tokens
    except Exception as e:
        raise Exception(f"Error calculating tokens: {str(e)}") 