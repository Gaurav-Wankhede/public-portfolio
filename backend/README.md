# Portfolio Backend

Rust API server for portfolio data.

## Stack

- Rust + Axum + Shuttle.rs
- MongoDB
- Google Gemini AI

## Endpoints

**Projects**
- `GET /api/projects`
- `GET /api/projects/{id}`
- `POST /api/projects` (admin)
- `PUT /api/projects/{id}` (admin)
- `DELETE /api/projects/{id}` (admin)

**Certificates**
- `GET /api/certificates`
- `GET /api/certificates/{id}`
- `POST /api/certificates` (admin)
- `PUT /api/certificates/{id}` (admin)
- `DELETE /api/certificates/{id}` (admin)

**Testimonials**
- `GET /api/testimonials`
- `GET /api/testimonials/{id}`
- `POST /api/testimonials` (admin)
- `PUT /api/testimonials/{id}` (admin)
- `DELETE /api/testimonials/{id}` (admin)

**Chat**
- `POST /api/chat`

**Ingest**
- `POST /api/ingest`
- `POST /api/ingest/{collection}`

## Development

```bash
cargo shuttle run --port 8000
```

## Deployment

Shuttle.rs with GitHub integration.

## Environment

- `MONGODB_URI`
- `MONGODB_DB`
- `GOOGLE_API_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `ADMIN_EMAIL`
- `CLOUDINARY_*`

## License

MIT
