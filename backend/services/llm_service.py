"""
Service for communicating with a local Ollama instance.

Sends prompts to the Ollama REST API and returns generated text.
All network errors are caught so a failed Ollama connection never
crashes the FastAPI server.
"""

import requests


OLLAMA_BASE_URL = "http://localhost:11434"
OLLAMA_GENERATE_ENDPOINT = f"{OLLAMA_BASE_URL}/api/generate"
DEFAULT_MODEL = "llama3.2:3b"
REQUEST_TIMEOUT_SECONDS = 30


def call_ollama(prompt: str, model: str = DEFAULT_MODEL) -> str:
    """Send a prompt to Ollama and return the generated text.

    Args:
        prompt: The text prompt to send to the model.
        model:  The Ollama model tag to use (default: llama3.2:3b).

    Returns:
        The model's response text, or an error message string if
        something went wrong (Ollama not running, timeout, etc.).
    """
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
    }

    try:
        response = requests.post(
            OLLAMA_GENERATE_ENDPOINT,
            json=payload,
            timeout=REQUEST_TIMEOUT_SECONDS,
        )
        response.raise_for_status()

        data = response.json()
        return data.get("response", "[ERROR] No 'response' field in Ollama reply.")

    except requests.exceptions.ConnectionError:
        return "[ERROR: Ollama service unavailable]"
    except requests.exceptions.Timeout:
        return "[ERROR: LLM response timed out]"
    except requests.exceptions.HTTPError as exc:
        return f"[ERROR] Ollama returned HTTP {exc.response.status_code}: {exc.response.text}"
    except requests.exceptions.RequestException as exc:
        return f"[ERROR] Unexpected request error: {exc}"
    except (ValueError, KeyError) as exc:
        return f"[ERROR] Failed to parse Ollama response: {exc}"


if __name__ == "__main__":
    print("=" * 60)
    print("  Ollama Connectivity Test")
    print(f"  Endpoint : {OLLAMA_GENERATE_ENDPOINT}")
    print(f"  Model    : {DEFAULT_MODEL}")
    print(f"  Timeout  : {REQUEST_TIMEOUT_SECONDS}s")
    print("=" * 60)

    test_prompt = "Say hello in one sentence."
    print(f"\nPrompt: {test_prompt!r}\n")

    result = call_ollama(test_prompt)
    print(f"Response:\n{result}")
