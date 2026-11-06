import {chromium} from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const destination = path.resolve(process.argv[2] || 'portfolio/assets/screenshots');
fs.mkdirSync(destination,{recursive:true});
const browser = await chromium.launch({headless:true});
const errors=[];
const save=async(page,name,fullPage=false)=>{
  await page.screenshot({path:path.join(destination,name),animations:'disabled',fullPage});
  console.log('Captured',name,'at',await page.title());
};
try{
  const everyday=await browser.newPage({viewport:{width:430,height:932},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  everyday.on('pageerror',e=>errors.push('Everyday: '+e.message));
  await everyday.goto('http://127.0.0.1:4191/',{waitUntil:'domcontentloaded'});
  // Import the application's existing demo-data generator; do not create or read user accounts.
  await everyday.evaluate(async()=>{
    const [{createDemoData},{encodeData}] = await Promise.all([
      import('/demo-mode.js?v=112'),import('/data.js?v=112')
    ]);
    const fictional = createDemoData();
    localStorage.setItem('everyday-demo-workspace-v1',JSON.stringify({active:true,data:encodeData(fictional)}));
  });
  await everyday.reload({waitUntil:'domcontentloaded'});
  await everyday.locator('main[data-page="home"][aria-busy="false"]').waitFor({timeout:30000});
  await everyday.locator('.home-metric').first().waitFor({timeout:15000});
  await everyday.waitForTimeout(500);
  await save(everyday,'everyday-home.png');
  await everyday.locator('nav.nav [data-action="gym"]').click();
  await everyday.locator('main[data-page="gym"]').waitFor({timeout:15000});
  await everyday.waitForTimeout(300);
  await save(everyday,'everyday-lifting.png');
  await everyday.close();

  const botanica=await browser.newPage({viewport:{width:430,height:932},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  botanica.on('pageerror',e=>errors.push('Botanica: '+e.message));
  await botanica.goto('http://127.0.0.1:4192/botanica/',{waitUntil:'domcontentloaded'});
  await botanica.getByText('Pick up where you left off.').waitFor({timeout:30000});
  await botanica.waitForTimeout(400);
  await save(botanica,'botanica-today.png');
  await botanica.locator('.bottom-nav button').filter({hasText:'Inventory'}).click();
  await botanica.getByText('Physical checks',{exact:false}).first().waitFor({timeout:15000}).catch(()=>{});
  await botanica.waitForTimeout(400);
  await save(botanica,'botanica-inventory.png');
  await botanica.close();

  for (const file of fs.readdirSync(destination)) {
    const size=fs.statSync(path.join(destination,file)).size;
    if(size<15000)throw Error(file+' is unexpectedly small: '+size);
    console.log(file,size,'bytes');
  }
  if(errors.length)console.log('Nonfatal browser errors:',errors.slice(0,8));
} finally {
  await browser.close();
}
