# InstantSite

AI-powered website generation. Describe your business, upload a few images, and get a live website in minutes.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff69b4)

## Quick Start

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy to Vercel (Recommended)

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/instantsite)

### Option 2: CLI

```bash
npm i -g vercel
vercel
```

### Option 3: GitHub Integration

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repo
4. Deploy — Vercel auto-detects Next.js

## Deploy to GitHub Pages

```bash
# Add to next.config.js:
# output: 'export'

npm run build
# Push the /out folder to gh-pages branch
```

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Tailwind + global styles
│   ├── layout.js            # Root layout with metadata
│   └── page.js              # Main page orchestrator
├── components/
│   ├── ui/
│   │   ├── icons.js         # SVG icon components
│   │   ├── index.js         # Button, Input, Card, etc.
│   │   └── decorative.js    # GridBG, FlowIllustration
│   ├── layout/
│   │   ├── nav.js           # Sticky navbar
│   │   └── footer.js        # Footer
│   ├── sections/
│   │   ├── hero.js          # Hero with CTA
│   │   ├── how-it-works.js  # 3-step process
│   │   ├── examples.js      # Example site cards
│   │   ├── pricing.js       # Pricing card
│   │   └── faq.js           # Accordion FAQ
│   └── wizard/
│       ├── form-wizard.js   # Multi-step form (Write/Upload/Import)
│       ├── generating-screen.js  # Loading animation
│       └── preview-page.js  # Site preview + DNS config
└── lib/
    └── constants.js         # Colors, config, data
```

## Adding Backend Integration

The form wizard is designed for easy backend integration:

```js
// In form-wizard.js, replace the onGenerate handler:
const handleGenerate = async (formData) => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
  const { siteUrl } = await response.json();
  // Redirect to preview
};
```

Key integration points:
- **`FormWizard.onGenerate(formData)`** — receives all form data as an object
- **`ContentArea` import mode** — replace `setTimeout` with actual scraping API call
- **`GeneratingScreen`** — connect to WebSocket/SSE for real progress updates
- **`PreviewPage`** — swap mock preview with actual iframe to generated site

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS 3.4**
- **Framer Motion 11** (animations)
- Zero external UI libraries

## License

MIT
