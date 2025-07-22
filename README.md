# DataWhiz

**DataWhiz** is an AI-powered document analysis and business reporting tool. Upload your files, chat with your data, and receive intelligent, formatted responses, summaries, insights, and downloadable reports—all in a beautiful, modern interface.

---

## Features

- **Modern Glassmorphic UI**: Sleek, responsive design with a sidebar chat widget, dashboard, and profile management.
- **User Authentication**: Secure registration, login, JWT-based sessions, password reset, and account deletion.
- **Chat with Your Data**: Upload multiple files (CSV, Excel, JSON, images, PDFs) and ask questions in natural language.
- **AI-Powered Insights**: Summaries, trends, key metrics, and Q&A powered by OpenAI and LangChain.
- **OCR Support**: Extract text and tables from images (JPG, PNG, HEIC) and PDFs using Tesseract.
- **Auto Report Generation**: Instantly generate and download PDF/Excel reports with charts and summaries.
- **File Management**: All files are linked to chat messages and can be tagged and managed.
- **Export Data**: Download extracted or analyzed data as CSV, Excel, or JSON.
- **Profile & Avatar**: Manage your profile, see all user info, and use a custom avatar.

---

## Tech Stack

### Frontend
- **Next.js (App Router)**
- **React** (Hooks, Framer Motion)
- **Tailwind CSS** (custom glassmorphic styles)
- **Headless UI** (modals, transitions)
- **react-markdown**, **rehype-raw**, **rehype-highlight** (for rich AI responses)
- **LocalStorage** (for auth tokens, user info)

### Backend
- **Django** & **Django REST Framework**
- **PostgreSQL** (AWS-ready)
- **djangorestframework-simplejwt** (JWT auth)
- **Pillow**, **pytesseract**, **pillow-heif** (OCR)
- **pdf2image**, **pdfplumber** (PDF extraction)
- **pandas**, **reportlab**, **openpyxl** (data processing & report generation)
- **LangChain**, **OpenAI** (AI/NLP integration)

---

## Project Structure

```
datawhiz-chatbot/
  backend/           # Django backend (API, OCR, AI, file & user management)
  datawhiz-frontend/ # Next.js frontend (UI, chat, auth, file upload)
```

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python 3.10+
- PostgreSQL
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract) (for OCR features)
- [Vercel CLI](https://vercel.com/docs/cli) (for deployment, optional)

### 1. Clone the Repository

```bash
git clone https://github.com/zubairkhawar/DataWhiz-Chatbot.git
cd DataWhiz-Chatbot
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Add your DB and OpenAI keys
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup

```bash
cd ../datawhiz-frontend
npm install
npm run dev
```

- Visit [http://localhost:3000](http://localhost:3000) to use the app.

---

## Deployment

- **Frontend:** Deploy `datawhiz-frontend` to Vercel. Set the root directory to `datawhiz-frontend` in Vercel settings.
- **Backend:** Deploy Django backend to your preferred cloud (e.g., AWS, Heroku, Railway). Set environment variables for DB and OpenAI keys.

---

## Environment Variables

**Backend (.env):**
```
DB_NAME=your_db
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
OPENAI_API_KEY=your_openai_key
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/auth
```

---

## Screenshots

> _Add screenshots of your UI here for extra polish!_

---

## License

MIT License

---

## Acknowledgements

- [OpenAI](https://openai.com/)
- [LangChain](https://langchain.com/)
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract)
- [Next.js](https://nextjs.org/)
- [Django](https://www.djangoproject.com/)

---

**DataWhiz** — _Chat with your data. Get instant insights. Make smarter decisions._ 