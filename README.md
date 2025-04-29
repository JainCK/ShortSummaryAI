# ShortSummaryAI

ShortSummaryAI is a full-stack application that leverages AI to transform lengthy text into concise summaries and bullet points. It consists of a FastAPI backend, Next.js frontend, and a browser extension for seamless text processing across the web.

https://github.com/user-attachments/assets/829e8945-0fd6-40a4-9f3b-cb7867d6985e



## Features

- **Text Summarization**: Generate concise summaries from long texts
- **Bullet Point Generation**: Convert paragraphs into easy-to-read bullet points
- **History Tracking**: Save and access past summaries and bullet points
- **User Authentication**: Secure registration and login system
- **Browser Extension**: Process text directly from any webpage

## Tech Stack

### Backend

- **FastAPI**: High-performance Python web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **PostgreSQL**: Relational database
- **JWT**: Authentication with JSON Web Tokens
- **Hugging Face API**: Integration with AI models for text processing

### Frontend

- **Next.js**: React framework for server-side rendering and static generation
- **TypeScript**: Typed JavaScript for better code quality
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: Accessible and customizable component library
- **Axios**: HTTP client for API requests

### Browser Extension

- **JavaScript**: Core extension functionality
- **HTML/CSS**: Extension popup interface
- **Chrome/Firefox APIs**: Browser extension integration

## Project Structure

```
├── backend/         # FastAPI application
├── frontend/        # Next.js application
├── extension/       # Browser extension
├── docker/          # Docker configuration files
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (v16+)
- Python (v3.9+)
- PostgreSQL

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/short-summary-ai.git
   cd short-summary-ai
   ```

2. Set up environment variables:

   ```bash
   # Backend environment variables
   cp backend/.env.example backend/.env
   # Frontend environment variables
   cp frontend/.env.example frontend/.env
   ```

3. Run with Docker Compose:

   ```bash
   docker-compose up -d
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Manual Setup

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Documentation

The API documentation is available at `/docs` when the backend server is running. It provides detailed information about all available endpoints and their usage.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
