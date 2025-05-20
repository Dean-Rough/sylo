# AI Chat Core Service

This service provides the AI-powered chat functionality for the Design Studio Productivity App. It's built with FastAPI and integrates with OpenAI's models for generating responses, with persistent memory stored in Supabase.

## Features

- OpenAI model integration (GPT-4o by default)
- Database-backed chat memory via Supabase
- User-specific AI settings management
- Prompt improvement and categorization
- RESTful API with Swagger documentation

## Setup

### Prerequisites

- Python 3.10+
- pip (Python package manager)
- Access to Supabase project credentials
- OpenAI API key

### Environment Variables

Copy the `.env.example` file to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Required environment variables:

- `OPENAI_API_KEY`: Your OpenAI API key
- `SUPABASE_URL`: URL of your Supabase project
- `SUPABASE_ANON_KEY`: Anon/public key for your Supabase project
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for your Supabase project (for admin operations)
- `API_HOST`: Host to bind the API server (default: 0.0.0.0)
- `API_PORT`: Port to run the API server (default: 4000)

### Installing Dependencies

Run the install script:

```bash
./scripts/install-deps.sh
```

Or manually install dependencies:

```bash
pip install -r requirements.txt
```

### Running the Service

Use the provided script:

```bash
./scripts/go.sh
```

This will:
1. Kill any process running on port 4000
2. Start the FastAPI development server

Alternatively, you can run:

```bash
./scripts/start-dev.sh
```

The service will be available at `http://0.0.0.0:4000`.

## API Documentation

Once the service is running, you can access the Swagger documentation at:

- Swagger UI: `http://0.0.0.0:4000/docs`
- ReDoc: `http://0.0.0.0:4000/redoc`

## API Endpoints

### Chat

- `POST /v1/chat/completion`: Generate a chat completion
- `POST /v1/chat/sessions`: Create a new chat session
- `DELETE /v1/chat/sessions/{session_id}`: Delete a chat session

### User Settings

- `GET /v1/user-settings`: Get user settings
- `PUT /v1/user-settings`: Update user settings

### Prompts

- `POST /v1/prompts/improve`: Improve a prompt
- `POST /v1/prompts/categorize`: Suggest categories for a prompt

## Authentication

All endpoints require a user ID to be provided in the `X-User-ID` header. This ID should be a valid UUID that corresponds to a user in the Supabase database.

## Database Schema

The service expects the following tables to exist in Supabase:

- `chat_history`: Stores chat messages
- `user_settings`: Stores user-specific AI settings

## Development

### Project Structure

- `app/`: Main application package
  - `api/`: API endpoints
    - `v1/`: Version 1 API endpoints
  - `core/`: Core configuration
  - `crud/`: Database operations
  - `db/`: Database connection
  - `models/`: Pydantic models
  - `services/`: Business logic
- `scripts/`: Utility scripts

### Adding New Features

1. Define models in `app/models/`
2. Implement database operations in `app/crud/`
3. Add business logic in `app/services/`
4. Create API endpoints in `app/api/v1/`
5. Register new routers in `app/api/v1/__init__.py`