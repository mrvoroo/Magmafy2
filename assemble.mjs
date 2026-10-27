import fs from 'fs';
const css = fs.readFileSync('build/app.css', 'utf8');
const js = fs.readFileSync('build/app.js', 'utf8').replace(/<\/script/gi, '<\\/script');
const head = `<title>Magmafy</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="وكالة نمو عبر السوشيال ميديا متخصصة في معارض الأثاث ومتاجر الديكور وشركات التصميم الداخلي.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alexandria:wght@500;600;700;800;900&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap">
<style>${css}</style>`;
const cdn = `<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>`;
const local = ['node_modules/react/umd/react.production.min.js','node_modules/react-dom/umd/react-dom.production.min.js','node_modules/gsap/dist/gsap.min.js']
  .map(f => `<script>${fs.readFileSync(f,'utf8').replace(/<\/script/gi,'<\\/script')}</script>`).join('\n');
const body = libs => `<div id="root" dir="rtl" lang="ar"></div>\n${libs}\n<script>document.documentElement.lang='ar';document.documentElement.dir='rtl';\n${js}</script>`;
fs.mkdirSync('out', { recursive: true });
fs.writeFileSync('out/index.html', head + '\n' + body(cdn));
fs.writeFileSync('out/local.html', `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">${head}</head><body>${body(local)}</body></html>`);
console.log('ok', fs.statSync('out/index.html').size);
