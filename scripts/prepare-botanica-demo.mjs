import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || 'botanica');
const put = (relative, contents) => fs.writeFileSync(path.join(root,relative),contents);
const main = String.raw\`import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

// Screenshot runner only: original UI, public demo fixture, no Firebase account.
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
\`;
const account=String.raw\`// Screenshot runner only. The production account implementation is left unchanged.
const active = {id:'public-sample', name:'Example Herb Shop',kind:'herbal',ownerUid:'fictional-user', createdAt:'2026-11-06T00:00:00Z'};
export function useAccount() {
  return {user:{uid:'fictional-user',email:'sample@example.invalid'},ready:true,error:'',
    workspaces:[active],active,login:async()=>{},logout:async()=>{},
    create:async()=>{},choose:()=>{},refresh:async()=>{},clearError:()=>{}};
}
export function AccountProvider({children}) {return children;}
\`;
const app = String.raw\`// Screenshot runner only. Uses Botanica's own fictional demoDB fixture.
import {demoDB} from '../data/demo';
const db = demoDB();
export function useApp() {return {db,setDB:()=>{},notice:'',notify:()=>{},
  error:'',reportError:()=>{},persisted:true,syncStatus:'saved'};}
export function AppProvider({children}) {return children;}
\`;
put('src/main.tsx',main);
put('src/state/AccountContext.tsx',account);
put('src/state/AppContext.tsx',app);
console.log('Prepared Botanica using only the repository fixture and original React UI.');
