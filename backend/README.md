# Security Sandbox — Backend

FastAPI backend for the AI Security Sandbox application.

## Prerequisites

- **Python 3.10+** (verify with `python --version`)

## Getting Started

### 1. Create a virtual environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the development server

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at **http://localhost:8000**.

### 4. Verify it works

Open your browser or use `curl`:

```bash
curl http://localhost:8000/api/health
# → {"status":"ok"}
```

Interactive API docs are auto-generated at **http://localhost:8000/docs**.

## Project Structure

```
backend/
├── main.py              # App entrypoint & CORS config
├── database.py          # SQLite / SQLAlchemy setup
├── requirements.txt
├── .gitignore
├── routers/
│   ├── attack.py        # Attack simulation endpoints
│   └── auth.py          # Authentication endpoints
├── services/
│   ├── llm_service.py       # LLM API integration
│   ├── defense_service.py   # Defense mechanisms
│   └── detection_service.py # Attack detection
└── models/
    └── (SQLAlchemy models)
```
