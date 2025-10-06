# Sommaire

A full-stack SaaS that converts long PDFs into beautiful, concise summary reels using Gemini AI.

## ✨ Features

- PDF Upload with AWS s3
- Text Extraction using LangChain
- AI Summarization via Gemini
- Authentication and user management (Clerk)
- Subscription billing with Stripe (Basic & Pro Plans)
- Reels-style interactive summary viewer
- Admin dashboard and deletion logic
- Responsive UI with Tailwind CSS v4 + Framer Motion
- Deployed on Vercel using Next.js 15 server actions

## 🧱 Tech Stack

| Area         | Tech |
|--------------|------|
| Frontend     | Next.js 15, React 19, Tailwind, ShadCN UI |
| Backend      | Server Actions, Neon DB (PostgreSQL) |
| Auth         | Clerk |
| File Uploads | s3 |
| AI Services  | Gemini AI |
| Payments     | Stripe |
| Deployment   | Vercel |

## 🧠 Architecture Overview

```mermaid
graph TD
    %% === FRONTEND SECTION ===
    subgraph FRONTEND[🌐 Frontend]
        A[📄 Upload PDF]
        H[📊 Interactive Reel]
    end

    %% === BACKEND SECTION ===
    subgraph BACKEND[⚙️ Backend]
        B[☁️ S3 Storage]
        C[🧠 LangChain]
        D[🤖 Gemini API]
        G[🗄️ Neon DB]
    end

    %% === DATA FLOW ===
    A -- "PDF Upload" --> B
    B -- "File URL" --> C
    C -- "Extracted Text" --> D
    D -- "Summary" --> G
    G -- "Summary Data" --> H

    %% === STYLING (GitHub-friendly) ===
    style FRONTEND fill:#d1fae5,stroke:#10b981,stroke-width:2px,stroke-dasharray:5 5
    style BACKEND fill:#f3f4f6,stroke:#6b7280,stroke-width:2px,stroke-dasharray:5 5

    style A fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style B fill:#dbeafe,stroke:#2563eb,stroke-width:2px
    style C fill:#d1fae5,stroke:#10b981,stroke-width:2px
    style D fill:#dcfce7,stroke:#22c55e,stroke-width:2px
    style G fill:#fef9c3,stroke:#fbbf24,stroke-width:2px
    style H fill:#ecfccb,stroke:#84cc16,stroke-width:2px
```


