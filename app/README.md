# Counterpart — Setup & Launch Guide

This is a real, working web app: real accounts, real password login, a real
database, and real matching between businesses and social media managers.
Follow these steps in order and you'll have it live at a public URL. No
coding experience needed — just careful copy-pasting. Budget about 45–60
minutes the first time.

---

## Part 1 — Create your database (Supabase)

1. Go to **supabase.com** and click **Start your project**. Sign up (free).
2. Click **New project**. Give it any name (e.g. "counterpart"), set a
   database password (save it somewhere), pick the region closest to you,
   and click **Create new project**. Wait ~2 minutes while it sets up.
3. In the left sidebar, click the **SQL Editor** icon.
4. Open the file `supabase-schema.sql` from this project (in a text editor,
   or on GitHub once you upload it — see Part 2). Copy its entire contents.
5. Paste it into the Supabase SQL Editor and click **Run**. You should see
   "Success. No rows returned." This created your two database tables.
6. In the left sidebar, go to **Authentication → Providers → Email**, and
   turn **OFF** "Confirm email" (toggle it off). This lets people sign up
   and use the app immediately, without clicking an email link first. You
   can turn this back on later once you've set up a custom email sender.
7. In the left sidebar, go to **Project Settings → API**. You'll see:
   - **Project URL**
   - **anon public** key
   Keep this tab open — you'll need both in Part 3.

---

## Part 2 — Put the code on GitHub

GitHub is just a place to store your code so Vercel (Part 3) can find it.
You won't need to type any git commands.

1. Go to **github.com** and click **Sign up** (free).
2. Once logged in, click the **+** icon top-right → **New repository**.
3. Name it `counterpart-app`, keep it **Public** or **Private** (either
   works), and click **Create repository**.
4. On the new repository's page, click **uploading an existing file**
   (a link in the quick-setup instructions).
5. Drag the **entire contents** of this project folder into the upload box
   — all the files and folders (`app`, `lib`, `package.json`,
   `middleware.js`, `supabase-schema.sql`, everything except `node_modules`
   if present, which you won't have yet).
6. Scroll down and click **Commit changes**.

Your code is now on GitHub.

---

## Part 3 — Make it live (Vercel)

1. Go to **vercel.com** and click **Sign up**. Choose **Continue with
   GitHub** so the two are connected automatically.
2. Click **Add New… → Project**.
3. Find `counterpart-app` in the list and click **Import**.
4. Before deploying, open **Environment Variables** and add two:
   - Name: `NEXT_PUBLIC_SUPABASE_URL` → Value: the Project URL from Part 1
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Value: the anon public key
     from Part 1
5. Click **Deploy**. Wait 1–2 minutes.
6. Once it says "Ready", click the preview thumbnail or the domain shown
   (something like `counterpart-app.vercel.app`). That's your live site.

---

## Part 4 — Test it

1. Visit your live URL, click **Get started**, and sign up with a real
   email and a password.
2. You should land on the profile setup page — fill it in as a business
   or a manager and save.
3. You'll see your dashboard. To see a real match, open the site again in
   a different browser (or an incognito window), sign up as the *other*
   role with a similar niche/industry, and go back to the first account's
   dashboard — you should see a match appear.

---

## Making changes later

Whenever you want to change text, colors, or add features: edit the files
on GitHub directly (click the pencil icon on any file), commit the change,
and Vercel will automatically redeploy the live site within a minute or
two. No separate "publish" step needed.

## What this does NOT include yet

- **Custom domain** — Vercel gives you a `.vercel.app` address for free;
  connecting a domain you own (e.g. `counterpart.com`) is a couple of
  clicks in Vercel's Domains settings once you buy one.
- **Email confirmation on signup** — currently off for simplicity. Turning
  it on later requires setting up an email sender (Supabase has a guide
  for this under Authentication → Email Templates).
- **Payments** — if you want to charge businesses for plans, that's a
  separate integration (commonly Stripe) — happy to help with that next.
