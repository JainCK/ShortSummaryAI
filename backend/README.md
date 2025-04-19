# ShortSummaryAI Backend

The backend for ShortSummaryAI is built with FastAPI, providing a robust API for text processing, user authentication, and data storage.

## Features

- User authentication with JWT
- Text summarization using Hugging Face models
- Bullet point generation
- History tracking for processed texts
- PostgreSQL database integration

## Tech Stack

- **FastAPI**: Python web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **Pydantic**: Data validation
- **PostgreSQL**: Relational database
- **JWT**: Token-based authentication
- **Hugging Face API**: AI models for text processing
- **Bcrypt**: Password hashing

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── endpoints/
│   │   │   ├── auth.py        # Authentication routes
│   │   │   └── text.py        # Text processing routes
│   ├── auth/
│   │   ├── auth_bearer.py     # JWT bearer token validation
│   │   ├── auth_handler.py    # Authentication handlers
│   │   └── jwt_handler.py     # JWT token creation and validation
│   ├── models/
│   │   ├── text.py            # Text processing models
│   │   └── user.py            # User models
│   ├── services/
│   │   └── hf_service.py      # Hugging Face API service
│   ├── utils/
│   │   └── security.py        # Security utilities
│   ├── config.py              # Application configuration
│   ├── database.py            # Database models and connection
│   └── main.py                # Application entry point
└── requirements.txt           # Python dependencies
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register`: Register a new user
- `POST /api/v1/auth/login`: Authenticate a user and return a JWT token

### Text Processing

- `POST /api/v1/text/generate_summary`: Generate a summary from text
- `POST /api/v1/text/generate_bullet_points`: Generate bullet points from text
- `GET /api/v1/text/history`: Get user's text processing history

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# JWT Settings
JWT_SECRET_KEY=your_jwt_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database Settings
DATABASE_URL=postgresql://username:password@localhost:5432/textapi

# Hugging Face Settings
HF_TOKEN=your_huggingface_token
HF_SUMMARY_MODEL=ByteDance-Seed/UI-TARS-1.5-7B
HF_BULLET_MODEL=cognitivetech/Hermes-2-Pro-7b-Mistral-Bulleted-Notes
```

## Development Setup

### Prerequisites

- Python 3.9+
- PostgreSQL

### Installation

1. Create a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Run the application:

   ```bash
   uvicorn app.main:app --reload
   ```

4. Access the API documentation:
   ```
   http://localhost:8000/docs
   ```

## Testing

Run tests using pytest:

```bash
pytest
```

## Docker

Build and run the backend with Docker:

```bash
docker build -t shortsummaryai-backend .
docker run -p 8000:8000 shortsummaryai-backend
```
