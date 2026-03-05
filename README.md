# 🏆 Tier List Maker

A fully-featured, dark-mode Tier List Maker built with **React + Vite + Tailwind CSS** and **@dnd-kit** for silky-smooth drag & drop (including mobile touch support).

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss) ![dnd-kit](https://img.shields.io/badge/@dnd--kit-6-orange)

---

## ✨ Features

| Feature | Details |
|---|---|
| **Tier rows** | Add, rename, recolor, and delete tiers |
| **Text items** | Create labeled text cards |
| **Image items** | Upload local images (stored as Base64 in the JSON) |
| **Drag & Drop** | Fluid movement between tiers and the bank — desktop & mobile |
| **Item Bank** | Storage zone for unranked items |
| **Export / Import** | Full state saved to / restored from `.json` |
| **Dark Mode** | Polished dark UI with subtle gradients |
| **Responsive** | Works on phones, tablets, and desktops |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Local development

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Deploy to GitHub Pages

### Step 1 — Create a GitHub repository

Create a new public repo, e.g. `tier-list-maker`.

### Step 2 — Update the `base` path in Vite config

Open `vite.config.js` and change the `base` value to match **your repo name**:

```js
// vite.config.js
export default defineConfig({
  plugins: [react()],
  base: '/YOUR-REPO-NAME/',   // ← change this
})
```

> If you're deploying to a **user/organisation site** (`username.github.io` with no sub-path), use `base: '/'` instead.

### Step 3 — Push your code

```bash
git init
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

### Step 4 — Deploy

```bash
npm run deploy
```

This runs `vite build` then uses **gh-pages** to push the `dist/` folder to the `gh-pages` branch automatically.

### Step 5 — Enable GitHub Pages

1. Go to your repository on GitHub.
2. **Settings → Pages**.
3. Under *Branch*, select `gh-pages` / `/ (root)`.
4. Click **Save**.

Your app will be live at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

> **Note:** It may take 1-2 minutes for the first deployment to become accessible.

---

## 📁 Project Structure

```
tier-list-maker/
├── index.html                  # Entry HTML (imports Google Fonts)
├── vite.config.js              # Vite + base path config
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── README.md
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # State management + DnD context
    ├── index.css               # Global styles + Tailwind directives
    └── components/
        ├── TierRow.jsx         # One tier row (label + droppable area)
        ├── TierItem.jsx        # Draggable item card (text or image)
        ├── ItemBank.jsx        # Unranked items zone
        ├── Toolbar.jsx         # Top action bar
        ├── AddItemModal.jsx    # Create text / image items
        └── EditTierModal.jsx   # Rename / recolor / delete a tier
```

---

## 🗂️ Export Format

The exported JSON has the following shape:

```json
{
  "tiers": [
    {
      "id": "tier-s",
      "label": "S",
      "color": "#ef4444",
      "items": [
        { "id": "abc123", "type": "text",  "content": "Dark Souls" },
        { "id": "def456", "type": "image", "content": "data:image/png;base64,…", "label": "My Image" }
      ]
    }
  ],
  "bank": []
}
```

Images are stored as **Base64 data URLs** so the file is fully self-contained.

---

## 🛠️ Scripts

| Command | Action |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Build for production → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run deploy` | Build + push to `gh-pages` branch |

---

## 📄 License

MIT — free to use, modify, and share.
