import re
from typing import Optional

try:
    import tiktoken
    TIKTOKEN_AVAILABLE = True
except ImportError:
    TIKTOKEN_AVAILABLE = False

try:
    from transformers import AutoTokenizer
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False

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

def calculate_tokens_tiktoken(text: str, model: str = "gpt-3.5-turbo") -> int:
    """
    Calculate tokens using tiktoken (preferred method).
    """
    if not TIKTOKEN_AVAILABLE:
        raise ImportError("tiktoken is not available")
    
    try:
        encoding = tiktoken.encoding_for_model(model)
        normalized_text = normalize_text(text)
        words = normalized_text.split()
        
        total_tokens = 0
        for word in words:
            word_tokens = encoding.encode(word)
            total_tokens += len(word_tokens)
        
        space_tokens = len(words) - 1 if len(words) > 1 else 0
        formatting_tokens = 2
        
        return total_tokens + space_tokens + formatting_tokens
    except Exception as e:
        raise Exception(f"Error calculating tokens with tiktoken: {str(e)}")

def calculate_tokens_transformers(text: str, model: str = "gpt2") -> int:
    """
    Calculate tokens using transformers (fallback method).
    """
    if not TRANSFORMERS_AVAILABLE:
        raise ImportError("transformers is not available")
    
    try:
        tokenizer = AutoTokenizer.from_pretrained(model)
        normalized_text = normalize_text(text)
        tokens = tokenizer.encode(normalized_text)
        return len(tokens)
    except Exception as e:
        raise Exception(f"Error calculating tokens with transformers: {str(e)}")

def calculate_tokens_simple(text: str) -> int:
    """
    Simple token estimation based on word count (fallback method).
    """
    normalized_text = normalize_text(text)
    words = normalized_text.split()
    # Rough estimation: 1.3 tokens per word on average
    return int(len(words) * 1.3)

def calculate_tokens(text: str, model: str = "gpt-3.5-turbo") -> int:
    """
    Calculate the number of tokens in a text using the best available method.
    
    Args:
        text (str): The text to calculate tokens for
        model (str): The model to use for tokenization
        
    Returns:
        int: Number of tokens in the text
    """
    # Try tiktoken first (most accurate)
    if TIKTOKEN_AVAILABLE:
        try:
            return calculate_tokens_tiktoken(text, model)
        except Exception:
            pass
    
    # Try transformers as fallback
    if TRANSFORMERS_AVAILABLE:
        try:
            return calculate_tokens_transformers(text, "gpt2")
        except Exception:
            pass
    
    # Use simple estimation as last resort
    return calculate_tokens_simple(text) 