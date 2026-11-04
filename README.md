# EverydayTools
Static site, no build step. Home page `index.html`, one SEO page per tool in `tools/`, shared `style.css` and `js/tools.js`.

## Deploy to Cloudflare Pages
1. Push this folder to a GitHub repo.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick the repo.
3. Framework preset: None. Build command: empty. Output directory: `/`. Save and deploy.
4. Custom domain later: project → Custom domains → Set up a domain.
5. The current production URL is `https://everydaytools-c4f.pages.dev/`. If you later attach a custom domain, update canonical, Open Graph, JSON-LD, `robots.txt` and `sitemap.xml` URLs together.
6. Submit `/sitemap.xml` in Google Search Console.

## Notes
- QR (qrcode-generator 1.4.4) and PDF-Lib 1.17.1 load from jsDelivr on first use. To self-host, download them into `/js` and change `QR_SRC` / `PDF_SRC`.
- Fonts fall back to system fonts; add a self-hosted Inter/Vazirmatn file if wanted.

## Test checklist
Percentage (zero, negative, Y=0) · Age (leap day, today, future date blocked) · BMI (metric/imperial, bad ranges) · Currency (edit, save, swap, reload) · Units (all categories, temperature) · QR (all 5 types, PNG+SVG scan) · Image (drag-drop, formats, quality, 30 MB rejected) · PDF (3 files, reorder, remove, corrupt file) · dark mode · mobile width 375px.

## Future ideas
Separate indexable page per tool, Persian localization, more currencies, PWA/offline, PDF split.
