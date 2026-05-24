# 🎬 ReelVault

> Browse and organize your saved Instagram reels & posts — privately, locally, beautifully.

**Live Demo → [reel-vault-rho.vercel.app](https://reel-vault-rho.vercel.app/)**

---

## What is this?

Instagram lets you save posts and organize them into collections — but their app makes it painful to browse them. No grid view, no search, no way to see everything at once.

ReelVault fixes that. Drop in your Instagram data export ZIP and instantly get a clean, fast grid of all your saved reels and posts, organized by collection.

**Everything runs in your browser. No data is uploaded anywhere.**

---

## Features

- 📦 Drop your Instagram export ZIP — no account login needed
- 🗂️ Browse by collection (Travel, Motivation, Shopping, etc.)
- 🖼️ Real thumbnails fetched automatically
- ⚡ Instant filtering between collections
- 🔒 100% local — your data never leaves your device
- 🌙 Dark mode UI

---

## How to use

### Step 1 — Export your Instagram data

1. Open Instagram → tap **☰ Menu** → **Settings**
2. Go to **Accounts Center** → **Your information and permissions**
3. Select **Download your information** → **Download or transfer information**
4. Choose your account → **Some of your information**
5. Select **Saved posts and collections**
6. Choose **Download to device**, format **JSON**
7. You'll get an email with a ZIP file — download it

### Step 2 — Use ReelVault

1. Go to **[reel-vault-rho.vercel.app](https://reel-vault-rho.vercel.app/)**
2. Drop your ZIP file onto the page (or click to browse)
3. Your saved posts and collections load instantly

---

## Tech stack

| Tool | Purpose |
|------|---------|
| React + Vite | Frontend framework |
| Tailwind CSS | Styling |
| JSZip | Parsing the Instagram ZIP in the browser |
| Microlink API | Fetching reel thumbnails |
| Vercel | Deployment |

---

## Run locally

```bash
git clone https://github.com/your-username/reel-vault.git
cd reel-vault
npm install
npm run dev
```

Open [localhost:5173](http://localhost:5173)

---

## Privacy

ReelVault processes your ZIP file entirely in your browser using the [File API](https://developer.mozilla.org/en-US/docs/Web/API/File) and [JSZip](https://stuk.github.io/jszip/). No file contents are sent to any server. Thumbnail images are fetched via [Microlink](https://microlink.io) using only the public Instagram post URLs.

---

## Contributing

PRs welcome! Some ideas for what could be added:

- Search across captions
- Sort by date saved
- Export a collection as a list of links
- Tag posts manually
- Persistent storage so you don't re-upload every time

---

## License

MIT
