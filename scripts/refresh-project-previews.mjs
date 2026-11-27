import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const output = path.resolve(process.argv[2] || 'portfolio/assets/screenshots');
const htmlPath = path.resolve(process.argv[3] || 'portfolio/index.html');
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const fixture = [
  { id: 'demo-01', key: 'demo-notebook', title: 'Notebook set', date: '2026-11-23', orderId: 'SAMPLE-01', status: 'completed', kind: 'retail', qty: 1, total: 12.49, asin: '' },
  { id: 'demo-02', key: 'demo-bottle', title: 'Insulated water bottle', date: '2026-11-21', orderId: 'SAMPLE-02', status: 'completed', kind: 'retail', qty: 1, total: 23.95, asin: '' },
  { id: 'demo-03', key: 'demo-cable', title: 'USB-C charging cable set', date: '2026-11-19', orderId: 'SAMPLE-03', status: 'completed', kind: 'retail', qty: 1, total: 9.99, asin: '' },
  { id: 'demo-04', key: 'demo-lamp', title: 'Desk lamp', date: '2026-11-17', orderId: 'SAMPLE-04', status: 'completed', kind: 'retail', qty: 1, total: 29.95, asin: '' },
  { id: 'demo-05', key: 'demo-mug', title: 'Ceramic coffee mug', date: '2026-11-15', orderId: 'SAMPLE-05', status: 'completed', kind: 'retail', qty: 1, total: 14.99, asin: '' },
  { id: 'demo-06', key: 'demo-bag', title: 'Reusable shopping bags', date: '2026-11-12', orderId: 'SAMPLE-06', status: 'completed', kind: 'retail', qty: 1, total: 16.50, asin: '' }
];
const createPage = () => browser.newPage({
  viewport: { width: 430, height: 932 },
  deviceScaleFactor: 2, isMobile: true, hasTouch: true,
  reducedMotion: 'reduce'
});
const save = async (page, file) => {
  const target = path.join(output, file);
  await page.screenshot({ path: target, animations: 'disabled' });
  const bytes = fs.statSync(target).size;
  if (bytes < 15000) throw Error('Capture looks empty: ' + file + ' (' + bytes + ' bytes)');
  console.log('Captured', file, bytes, 'bytes');
};

try {
  // Local-only demo account. This interception never touches production auth or any real account.
  const machete = await createPage();
  await machete.addInitScript((orders) => {
    localStorage.setItem('machete.v3.portfolio-demo', JSON.stringify({
      orders, watchlist: [], meta: {}, photoCatalog: {}, theme: 'dark',
      importedAt: '2026-11-23T12:00:00Z', returnOrderIds: [], restoredIds: []
    }));
  }, fixture);
  await machete.route('**/auth.js*', route => route.fulfill({
    status: 200, contentType: 'application/javascript',
    body: [
      'window.MacheteAuth={ready:true,user:{uid:"portfolio-demo",email:"demo@example.test",displayName:"Demo"},status:"ready",signIn:async()=>{},signOut:async()=>{}};',
      'window.dispatchEvent(new Event("machete-auth-changed"));'
    ].join('\n')
  }));
  await machete.goto('http://127.0.0.1:4195/', { waitUntil: 'domcontentloaded' });
  await machete.locator('.tab[data-view="products"]').click();
  await machete.locator('.product-card').first().waitFor({ timeout: 25000 });
  if (await machete.locator('.product-card').count() < 4) throw Error('Machete demo products did not load');
  await machete.waitForTimeout(400);
  await save(machete, 'machete-demo-20261126.png');
  await machete.close();

  // The BOGO catalog is public ad data; do not inject a personal list or account data.
  const bogo = await createPage();
  await bogo.goto('http://127.0.0.1:4196/', { waitUntil: 'domcontentloaded' });
  await bogo.locator('article.deal').first().waitFor({ timeout: 30000 });
  if (await bogo.locator('article.deal').count() < 2) throw Error('BOGO public product cards did not load');
  await bogo.waitForTimeout(1400);
  await save(bogo, 'bogo-demo-20261126.png');
  await bogo.close();

  // Switch the portfolio from temporary public-page thumbnails to newly captured real UI.
  let html = fs.readFileSync(htmlPath, 'utf8');
  for (const [id, name] of [['machete', 'machete-demo-20261126.png'], ['bogo', 'bogo-demo-20261126.png']]) {
    const re = new RegExp('(<article class="project" id="' + id + '"[\\s\\S]*?<img class="screenshot-main" src=")[^"]+');
    if (!re.test(html)) throw Error('Could not find screenshot for ' + id);
    html = html.replace(re, '$1./assets/screenshots/' + name);
  }
  html = html.replace('studio-20261126-1', 'studio-20261126-2');
  fs.writeFileSync(htmlPath, html);
  console.log('Updated portfolio to use local real captures with sample data.');
} finally {
  await browser.close();
}
