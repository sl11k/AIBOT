# AI RAG Chatbot

Production-ready, fully closed-knowledge RAG chatbot. Answers **only** from pre-ingested PDFs and whitelisted website snapshots. Not a general chatbot, web search, or knowledge model.

## Architecture

- **Frontend**: Next.js 14 (App Router), TypeScript
- **Backend**: Node.js + Express, TypeScript
- **Database**: PostgreSQL with pgvector
- **AI**: Google Gemini (gemini-embedding-001, gemini-2.5-flash)
- **RAG**: Embed query → similarity search → top 5 chunks → strict prompt → Gemini → response validation (lexical overlap)

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` / `production` |
| `PORT` | Backend port | `4000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `GEMINI_API_KEY` | Google AI API key | (required) |
| `EMBEDDING_MODEL` | Embedding model | `gemini-embedding-001` |
| `GEMINI_MODEL` | Generation model | `gemini-2.5-flash` |
| `MAX_QUERY_LENGTH` | Max user message length | `1000` |
| `SIMILARITY_THRESHOLD` | Min similarity (0–1) for retrieval | `0.7` |
| `LEXICAL_OVERLAP_THRESHOLD` | Min overlap for response validation | `0.1` |
| `INGEST_PATH` | Folder for PDF/txt/md files | `./data` |
| `APPROVED_URLS` | JSON array of whitelist URLs | `["https://example.com"]` |

## Database Setup

1. Install PostgreSQL with pgvector (or use Docker).

2. Create database and extension:

```sql
CREATE DATABASE rag_chatbot;
\c rag_chatbot
CREATE EXTENSION vector;
```

3. Create schema (`server/src/config/schema.sql` or run below):

```sql
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  embedding VECTOR(768) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX documents_embedding_idx
ON documents
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL with pgvector
- Gemini API key

### Backend

```bash
cd server
cp ../.env.example .env
# Edit .env with DATABASE_URL and GEMINI_API_KEY
npm install
npm run build
# Ensure DB is running and schema is applied
npm start
```

### Frontend

```bash
cd client
cp ../.env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:4000 for local dev
npm install
npm run dev
```

Open http://localhost:3000.

### Ingestion

**PDF / TXT / MD files:**

```bash
cd server
mkdir -p data
# Put .pdf, .txt, .md files in data/
npm run ingest
```

**Websites (whitelist only):**

1. Edit `server/config/approved-urls.json` (or set `APPROVED_URLS` in env).
2. Run:

```bash
cd server
npm run ingest:websites
```

No user-provided URLs are ever fetched; only the whitelist is crawled once and stored.

## Docker

```bash
cp .env.example .env
# Set GEMINI_API_KEY in .env
docker-compose up -d
```

- Postgres: 5432  
- Backend: 4000  
- Frontend: 3000  

Run ingestion after first start (e.g. exec into backend or run locally with `DATABASE_URL` pointing at container).

## Production Deployment

1. **Environment**: Set all required env vars; no defaults for `GEMINI_API_KEY` or `DATABASE_URL`.
2. **Database**: Use managed PostgreSQL with pgvector; run schema and migrations once.
3. **Backend**: Build with `npm run build`, run with `node dist/server.js`; use process manager (e.g. PM2).
4. **Frontend**: Build with `next build`, run with `next start` or serve via reverse proxy.
5. **Security**: Helmet and CORS configured; rate limit 30 req/min per IP; validate env at startup.
6. **Ingestion**: Run ingest scripts in a controlled way (cron or manual); never expose URL ingestion to user input.

## Behavior

- If the answer is not in the retrieved context, the system responds exactly: **"I don't have information about that."**
- Prompt injection attempts (e.g. "ignore previous instructions") receive: **"Invalid query."**
- Max input length: 1000 characters. Response is validated for lexical overlap with context; below threshold returns the safe phrase above.
