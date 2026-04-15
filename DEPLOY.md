# FairPrint — Setup & Deployment Guide

## Local Development

### 1. Install Node.js
Download and install Node.js (v18+) from https://nodejs.org

### 2. Install dependencies
```bash
cd fairprintAI
npm install
```

### 3. Add your OpenAI API key
```bash
cp .env.local.example .env.local
# Then edit .env.local and add your key:
# OPENAI_API_KEY=sk-...
```
Get an API key at https://platform.openai.com/api-keys

### 4. Run the development server
```bash
npm run dev
```
Open http://localhost:3000 in your browser.

---

## Deploying to Vercel (Free)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial FairPrint commit"
# Create a repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/fairprint.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `fairprint` repository
4. In **Environment Variables**, add:
   - Key: `OPENAI_API_KEY`
   - Value: your OpenAI API key
5. Click **Deploy**

Vercel will give you a free `yourproject.vercel.app` URL instantly.

### 3. Connect your custom domain
1. Buy a domain (e.g., `fairprint.app` or `getfairprint.com`) from Namecheap or GoDaddy (~$12/year)
2. In your Vercel project, go to **Settings → Domains**
3. Add your custom domain
4. Follow Vercel's DNS instructions (add a CNAME or A record at your registrar)
5. Your site will be live at your custom URL within minutes

---

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **AI**: OpenAI GPT-4o with Vision (reads document images)
- **PDF Generation**: jsPDF (client-side, no server needed)
- **Hosting**: Vercel (free tier)

## Pages
| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/upload` | Document upload + analysis |
| `/results` | Battle Plan + dispute letter |
| `/how-it-works` | Technology explanation |
| `/about` | Mission and values |
| `/api/analyze` | POST endpoint (OpenAI integration) |
