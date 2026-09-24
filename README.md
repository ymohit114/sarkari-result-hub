# 🚀 Sarkari Result Hub - Automated Portal, Scraper & Telegram Bot

A high-performance government recruitment portal inspired by **sarkariresult.com**, built with **Next.js 16 (App Router)**, **Tailwind CSS v4**, **Prisma ORM (SQLite / MongoDB)**, and direct **Telegram Bot Automation**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fymohit114%2Fsarkari-result-hub)

- **GitHub Repository**: [https://github.com/ymohit114/sarkari-result-hub](https://github.com/ymohit114/sarkari-result-hub)
- **Live Scraper**: 10 recruitment sources crawled every 4 hours (`0 */4 * * *`)
- **Direct Official Registration Links**: Direct `.gov.in` / `.nic.in` / recruitment portal URLs (no middleman redirects)

---

## 🌟 Key Features

### 1. Public Portal (Sarkari Result Replica)
- **Classic 3-Column Grid**: Result | Admit Card | Latest Jobs.
- **Secondary Grid**: Answer Key | Syllabus | Admission.
- **Breaking News Marquee**: Real-time scrolling alerts for trending exams and vacancies with touch-pause support.
- **Post Detail Pages**:
  - Important Dates table (Application Begin, Last Date, Exam Date, Admit Card).
  - Application Fee breakdown (General/OBC, SC/ST, Female, Payment Modes).
  - Age limits & category-wise relaxation details.
  - Vacancy breakdown & qualification requirements.
  - Direct Action links (Apply Online, Download Notification PDF, Official Portal, Join Telegram).
  - Mobile bottom action bar for instant 1-tap applications.

### 2. 100% Search Engine Optimization (SEO)
- **Google `JobPosting` Structured Data (JSON-LD)** embedded on all recruitment posts.
- **Dynamic XML Sitemap (`/sitemap.xml`)** dynamically indexing all routes and active posts.
- **`robots.txt`** configuration allowing crawlers and pointing to the sitemap.
- Clean SEO slugs (e.g. `/post/ssc-cgl-2026-online-form`).

### 3. Multi-Source Automated Scraper (Every 4 Hours)
Monitors 10 major portals without post limits:
1. `https://www.sarkariresult.com/latestjob/`
2. `https://www.sarkariresult.com/admitcard/`
3. `https://www.sarkariresult.com/result/`
4. `https://www.sarkariresult.com/answerkey/`
5. `https://www.sarkariresult.com/syllabus/`
6. `https://www.sarkariresult.com/admission/`
7. `https://sarkariresult.com.cm/`
8. `https://www.sarkariresults.org.in/`
9. `https://sarkariresult.freejobalert.com/`
10. `https://affairscloud.com/jobs/sarkari-results/`

### 4. Direct Telegram Bot Integration
- Instant push notifications to your Telegram Channel whenever a new post goes live.
- High-converting message layout with inline buttons:
  - `[👉 View Full Details & Apply]`
  - `[⚡ Direct Apply Link]`
  - `[📄 Download Notification PDF]`

### 5. Full Admin CMS & Control Console
- Protected Admin Portal (`/admin`) with secure session authentication.
- Real-time stats (Total Posts, Published, Drafts, Telegram Broadcasts).
- Full CRUD: Create, Edit, Delete posts.
- Scraper Console with live execution output logs.
- Telegram Bot connection and test broadcast tool.

---

## 🍃 MongoDB Setup & Connection

The project supports both **SQLite** (local default) and **MongoDB** (Atlas / Production).

### Connecting to MongoDB:

1. In `.env`, set your MongoDB connection string:
```env
DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/sarkari?retryWrites=true&w=majority"
```

2. Run the automated database switch script:
```bash
npm run db:mongo
```
This automatically:
- Switches Prisma schema to MongoDB provider with native ObjectIds.
- Pushes models to MongoDB (`npx prisma db push`).
- Seeds all existing scraped job posts and settings from `prisma/seed-data.json`.

To switch back to SQLite at any time:
```bash
npm run db:sqlite
```

---

## 🚀 Deployment (Vercel & Git)

### Option 1: One-Click Deploy on Vercel (Recommended)
1. Go to **[vercel.com/new](https://vercel.com/new)**.
2. Select your GitHub repository: `ymohit114/sarkari-result-hub`.
3. In Environment Variables, add:
   - `DATABASE_URL`: Your MongoDB connection string (`mongodb+srv://...`)
   - `ADMIN_PASSWORD`: Your secret admin password
   - `NEXT_PUBLIC_SITE_URL`: Your production Vercel URL
4. Click **Deploy**. Vercel will build and deploy the full-stack App Router app with serverless API routes!

### Option 2: Deploy via Vercel CLI
```bash
npx vercel
```
Follow the login prompts to link and deploy your project.

---

## 🛠️ Local Development

```bash
# 1. Install dependencies
npm install

# 2. Push database schema
npx prisma db push

# 3. Start local development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

- **Admin Login:** `http://localhost:3000/admin/login` (Default password: `admin`)
