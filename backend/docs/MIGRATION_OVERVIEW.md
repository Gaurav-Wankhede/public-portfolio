# Portfolio Backend Python to Rust Migration Overview

## Executive Summary
Migration plan for porting FastAPI portfolio backend to Rust using Axum and Shuttle.rs. Covers 5 APIs, MongoDB, Google Gemini AI, and Cloudinary integrations.

## Current Python Stack
- **Framework**: FastAPI with async/await
- **Database**: MongoDB via Motor + Beanie ODM
- **Validation**: Pydantic v2
- **Embeddings**: Google Generative AI + SentenceTransformer
- **Images**: Cloudinary SDK
- **Chat**: LangChain + Gemini 2.5 Flash

## Target Rust Stack
- **Framework**: Axum 0.8 + Shuttle.rs 0.57
- **Database**: MongoDB 3.2 async driver
- **Validation**: serde + validator
- **HTTP**: reqwest 0.12
- **Runtime**: Tokio
- **Errors**: thiserror + anyhow
- **Logging**: tracing

## APIs to Migrate
1. **Projects** - GET/POST/PUT/DELETE with multipart uploads
2. **Certificates** - CRUD with slug generation
3. **Testimonials** - GET/POST with images
4. **Chat** - POST with Gemini AI integration
5. **Ingest** - POST with embeddings generation

## Performance Targets
- Throughput: >5000 req/sec
- Latency: <20ms p50
- Memory: <50MB idle, <200MB load
- Cold Start: <100ms
