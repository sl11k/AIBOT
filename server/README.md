# NutriCare Perplexity Bot

A specialized Nutrition & Diet Research Chatbot powered by Perplexity AI (`pplx-70b-online`).

## Features

- **Live Research**: Queries the web via Perplexity API for up-to-date scientific information.
- **Domain Restricted**: Strictly answers ONLY nutrition and diet-related questions.
- **Citation Support**: Every answer includes source URLs.
- **Rate Limiting**: Protected against abuse (30 requests/minute).
- **Secure**: Basic input sanitization and error handling.

## Prerequisites

- Node.js >= 18
- Perplexity API Key

## Setup

1. **Clone the repository** (if not already done).
2. **Install dependencies**:
   ```bash
   cd server
   npm install
   ```
3. **Configure Environment**:
   - Copy `.env.example` to `.env`
   - Add your Perplexity API Key:
     ```env
     PERPLEXITY_API_KEY=pplx-xxxxxxxxxxxxxxxx
     ```

## Running the Server

- **Development Mode**:
  ```bash
  npm run dev
  ```
- **Production Build**:
  ```bash
  npm run build
  npm start
  ```

## API Endpoint

**POST** `/api/chat`

**Body**:
```json
{
  "message": "What are the benefits of Vitamin D?"
}
```

**Response**:
```json
{
  "answer": "Vitamin D is crucial for bone health...",
  "sources": [
    "https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/",
    "https://www.mayoclinic.org/drugs-supplements-vitamin-d/art-20363792"
  ]
}
```

## Project Structure

```
server/
  src/
    config/         # Env variables and constants
    middleware/     # Error handling, rate limiting
    modules/        # Feature modules (Chat)
    services/       # Business logic (Perplexity, Research, Validation)
    utils/          # Logger, Sanitization
    app.ts          # Express App setup
    server.ts       # Entry point
```
