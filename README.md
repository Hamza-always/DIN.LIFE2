# DİN — Do It Now
### Deploy to Vercel + MongoDB Atlas in 10 minutes

---

## STEP 1 — Create MongoDB Atlas Database (FREE)

1. Go to **https://cloud.mongodb.com** → Sign up free
2. Click **"Build a Database"** → Choose **"FREE"** (M0 tier)
3. Select any cloud region → Click **"Create"**
4. Under **"Security"** → **"Database Access"** → **"Add New Database User"**
   - Username: `din_user`
   - Password: choose a strong password (save it!)
   - Role: **"Read and write to any database"** → Save
5. Under **"Network Access"** → **"Add IP Address"** → Click **"Allow Access From Anywhere"** → Confirm
6. Go to **"Databases"** → Click **"Connect"** → **"Drivers"**
7. Copy the connection string — it looks like:
   ```
   mongodb+srv://din_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   Replace `<password>` with your actual password. **Save this string.**

---

## STEP 2 — Deploy to Vercel (FREE)

1. Go to **https://github.com** → Create a free account if you don't have one
2. Click **"New repository"** → Name it `din-app` → **Public** → Create
3. Upload all these files keeping the same folder structure:
   ```
   din-app/
   ├── api/
   │   ├── _db.js
   │   ├── auth.js
   │   └── data.js
   ├── public/
   │   └── index.html
   ├── package.json
   └── vercel.json
   ```
4. Go to **https://vercel.com** → Sign up with your GitHub account
5. Click **"Add New Project"** → Import your `din-app` repository
6. Click **"Environment Variables"** and add:

   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | your MongoDB connection string from Step 1 |
   | `JWT_SECRET` | any random string like `din_super_secret_2025_xyz` |

7. Click **"Deploy"** → Wait 1-2 minutes
8. Vercel gives you a URL like: `https://din-app-yourname.vercel.app`
9. **Open that URL on your phone — done!** ✅

---

## How it works

- **Your data** is saved in MongoDB Atlas cloud database
- **Login works** from any device, any browser, anywhere in the world
- **No more localStorage issues** — data never disappears
- **Auto-saves** as you use the app (debounced, 1.2s after each action)
- **JWT tokens** kept in localStorage only for session persistence (safe)

---

## Features

| Section | What you get |
|---------|-------------|
| 🔥 Habits | 7-day tracker, streaks, emoji picker |
| ⚔️ Challenges | Progress tracking, fail/reset, day counter |
| 🇬🇧 English | 180+ words A1–C2, Flashcards, Quiz, 200+ Phrases, Writing, Vocab tracker |
| 🧠 Learning | Subject log, color-coded, unlimited entries |
| 📓 Journal | Mood picker, past entries, timestamps |
| ⚡ Overview | Stats, 31-day calendar, streak counter |

---

## Troubleshooting

**"Cannot connect to database"** → Check your `MONGODB_URI` in Vercel environment variables. Make sure you replaced `<password>` with your actual password.

**"Login not working"** → Make sure `JWT_SECRET` is set in Vercel environment variables.

**App not loading** → Check Vercel deployment logs under "Functions" tab.
