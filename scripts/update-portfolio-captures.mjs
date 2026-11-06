import fs from 'node:fs';
import path from 'node:path';
const base=path.resolve(process.argv[2]||'portfolio');
const read=p=>fs.readFileSync(path.join(base,p),'utf8');
const write=(p,txt)=>fs.writeFileSync(path.join(base,p),txt);
const updateExpected=(src,oldText,newText)=>{
  if(src.includes(newText))return src;
  if(!src.includes(oldText))throw Error('Could not locate expected text: '+oldText.slice(0,80));
  return src.replace(oldText,newText);
};
let html=read('index.html');
const prefix='https://image.thum.io/get/width/1000/crop/900/maxAge/24/';
for(const [slug,filename] of [['fitness-tracker','everyday-home.png'],['botanica','botanica-today.png']]) {
 html=updateExpected(html,prefix+'https://downaironly.github.io/'+slug+'/','./assets/screenshots/'+filename);
}
html=updateExpected(html,
 'Screenshots are generated from each public website. Apps with private accounts may show a sign-in screen. No personal data is included.',
 'Real browser captures of the apps running with fictional sample data. No personal accounts or private records were used.');
write('index.html',html);
let js=read('script.js');
for(const [name,filename] of [['Everyday','everyday-home.png'],['Botanica','botanica-today.png']]) {
  const url='https://downaironly.github.io/'+(name==='Everyday'?'fitness-tracker':'botanica')+'/';
  const oldText="name: '"+name+"', url: '"+url+"'";
  js=updateExpected(js,oldText,oldText+", image: './assets/screenshots/"+filename+"'");
}
js=updateExpected(js,
 "img.src = 'https://image.thum.io/get/width/1000/crop/900/maxAge/24/' + info.url;",
 "img.src = info.image || 'https://image.thum.io/get/width/1000/crop/900/maxAge/24/' + info.url;");
write('script.js',js);
let readme=read('README.md');
const prev='Thumbnails come from a public website screenshot service (Thum.io). They are captures of public pages, **not invented app UI**. Logged-out/private apps can show sign-in rather than a logged-in dashboard. The service can cache captures and display loading images on first request. The website also provides direct links that do not rely on this service.';
const next='Everyday and Botanica screenshots are rendered from the **actual public application source** in GitHub Actions, using their own fictional sample-data fixtures. No user accounts, cloud sign-in, or private data are used. A temporary build-time account harness is applied to Botanica without modifying its real repository. The USF Playlist Catalog thumbnail still uses a public website capture service.';
readme=updateExpected(readme,prev,next);
write('README.md',readme);
console.log('Updated the portfolio to load local real screenshots.');
