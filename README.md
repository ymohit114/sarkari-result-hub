# 🚀 Sarkari Result Hub - Automated Portal & Telegram Bot

A high-performance government recruitment portal inspired by **sarkariresult.com**, built with **Next.js (App Router)**, **Tailwind CSS**, **Prisma ORM**, and direct **Telegram Bot Automation**.

---

## 🌟 Key Features

### 1. Public Portal (Sarkari Result Replica)
- **Classic 3-Column Grid**: Result | Admit Card | Latest Jobs.
- **Secondary Grid**: Answer Key | Syllabus | Admission.
- **Breaking News Marquee**: Real-time scrolling alerts for trending exams and vacancies.
- **Post Detail Pages**:
  - Important Dates table (Application Begin, Last Date, Exam Date, Admit Card).
  - Application Fee breakdown (General/OBC, SC/ST, Female, Payment Modes).
  - Age limits & category-wise relaxation details.
  - Vacancy breakdown & qualification requirements.
  - Direct Action links (Apply Online, Download Notification PDF, Official Portal, Join Telegram).
  - Instant Social Share buttons (WhatsApp, Telegram).

### 2. 100% Search Engine Optimization (SEO)
- **Google `JobPosting` Structured Data (JSON-LD)** embedded on all recruitment posts.
- **Dynamic XML Sitemap (`/sitemap.xml`)** that automatically includes every newly published post and category.
- **`robots.txt`** configuration allowing crawlers and pointing to the sitemap.
- **Incremental Static Regeneration (ISR)** for sub-second page loads.
- Clean SEO slugs (e.g. `/post/ssc-cgl-2026-online-form`).

### 3. Automated Scraper & Sync Engine
- Periodically crawls source portals (e.g. `sarkariresult.com`).
- Extracts job titles, eligibility criteria, important dates, fees, and apply URLs.
- **Smart Deduplication**: Prevents duplicate entries using source URL tracking.
- **Configurable Modes**:
  - *Auto-Publish Mode*: Scraped jobs instantly go live and trigger a Telegram broadcast.
  - *Draft Mode*: Scraped jobs enter as drafts for manual admin approval.

### 4. Direct Telegram Bot Integration
- Instant push notifications to your Telegram Channel whenever a new post goes live.
- High-converting message layout with inline buttons:
  - `[👉 View Full Details & Apply]`
  - `[⚡ Direct Apply Link]`
  - `[📄 Download Notification PDF]`
- Built-in bot credential validator & sample alert tester in the Admin Console.

### 5. Full Admin CMS & Control Console
- Protected Admin Portal (`/admin`) with secure session authentication.
- Real-time stats (Total Posts, Published, Drafts, Telegram Broadcasts).
- Full CRUD: Create, Edit, Delete posts.
- Scraper Console with live execution output logs.
- Telegram Bot connection and test broadcast tool.

---

## 🛠️ Quick Start

### 1. Install & Run
```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Synchronize database
npx prisma db push

# 3. Start local development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔐 Admin Console & Credentials

- **Admin Login URL:** `http://localhost:3000/admin/login`
- **Default Master Password:** `admin` (changeable in `.env` or from Admin Settings)

---

## 🤖 3-Step Telegram Bot Setup

1. Open Telegram and message **[@BotFather](https://t.me/BotFather)**.
2. Send `/newbot`, name your bot, and copy the **API Token**.
3. Create your Telegram Channel (e.g. `@MySarkariAlertsChannel`) and add your bot as an **Administrator** with permission to *Post Messages*.
4. Go to **Admin Panel &rarr; Telegram Bot** (`http://localhost:3000/admin/telegram`), paste your Token and Channel Username, then click **Test Connection**!

---

## ⏰ Automated Cron Scraping

You can configure any external cron service (such as [cron-job.org](https://cron-job.org), GitHub Actions, or Vercel Cron) to hit:

```http
GET http://localhost:3000/api/cron/scrape?key=sarkari_secret_cron_key
```
This triggers the background scraper every 15 to 30 minutes to check for new jobs automatically.
