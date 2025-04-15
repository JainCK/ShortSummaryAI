# Text Processing API

A secure backend API system built with FastAPI that processes text using Hugging Face's Inference API. The system includes JWT authentication and uses Neon PostgreSQL for data storage.

## Features

- Secure API with JWT token-based authentication
- Text processing endpoints:
  - `/generate_summary`: Generate a summary of the input text
  - `/generate_bullet_points`: Convert input text into bullet points
- User authentication with register and login endpoints
- History tracking for text processing requests
- Integration with Hugging Face Inference API
- Neon PostgreSQL database integration
- Comprehensive test suite
- Auto-generated API documentation

## Setup and Installation

### Prerequisites

- Python 3.9+
- PostgreSQL (or Neon PostgreSQL account)
- A Hugging Face account with an API token

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/text-processing-api.git
   cd text-processing-api
   ```

2. Create a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file:

   ```bash
   cp .env.example .env
   ```

5. Edit the `.env` file and add your configuration:
   - Generate a secure `JWT_SECRET_KEY`
   - Set your database URL for `DATABASE_URL`
   - Add your Hugging Face API token for `HF_TOKEN`

### Database Setup

If you're using Neon PostgreSQL:

1. Create a new Neon PostgreSQL project
2. Get the connection string and add it to your `.env` file as `DATABASE_URL`

For local PostgreSQL:

1. Create a database:

   ```bash
   createdb textapi
   ```

2. Set the local connection string in your `.env` file:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/textapi
   ```

### Running the API

Start the API with Uvicorn:

```bash
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000

API documentation is available at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Usage

### Authentication

1. Register a new user:

   ```bash
   curl -X POST http://localhost:8000/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","username":"user1","password":"StrongPassword123"}'
   ```

2. Login and get a JWT token:
   ```bash
   curl -X POST http://localhost:8000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","password":"StrongPassword123"}'
   ```

### Text Processing

1. Generate a summary (authenticated):

   ```bash
   curl -X POST http://localhost:8000/api/v1/text/generate_summary \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{"text":"Your long text to be summarized goes here..."}'
   ```

2. Generate bullet points (authenticated):

   ```bash
   curl -X POST http://localhost:8000/api/v1/text/generate_bullet_points \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{"text":"Your text to be converted to bullet points goes here..."}'
   ```

3. Get processing history (authenticated):
   ```bash
   curl -X GET http://localhost:8000/api/v1/text/history \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

## Testing

Run the test suite with pytest:

```bash
pytest
```

## Development Notes

### Common Issues and Troubleshooting

1. **Database Connection Issues**: Ensure your PostgreSQL server is running and the connection string in `.env` is correct.
2. **JWT Authentication Errors**: Check that your `JWT_SECRET_KEY` is set correctly and that the token hasn't expired.

3. **Hugging Face API Errors**: Verify your `HF_TOKEN` is valid and has the necessary permissions to access the models.

### Security Considerations

- The default JWT token expiration is set to 30 minutes. For production use, you might want to adjust this.
- Store sensitive information like tokens and keys in environment variables, never in the codebase.
- For production deployment, use HTTPS to encrypt data in transit.

### Performance Optimization

- The Hugging Face API calls have a timeout of 30 seconds. Adjust this based on your needs.
- For high-traffic applications, consider implementing rate limiting.
- The database connection pool can be optimized for production usage.

## Postman Collection

A Postman collection for testing the API is available at `docs/Text_Processing_API.postman_collection.json`.
