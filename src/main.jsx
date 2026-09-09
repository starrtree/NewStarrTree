import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const isLab = /(?:^|\/)assets-lab(?:\/|$)/.test(window.location.pathname) || window.location.hash.startsWith('#/assets-lab');
const Page = isLab ? lazy(() => import('./assets-lab/AssetsLab.jsx')) : lazy(() => import('./App.jsx'));

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<div role="status" style={{padding:32,color:'#d8b97e',background:'#080f0d',minHeight:'100vh'}}>Loading StarrTree…</div>}>
      <Page />
    </Suspense>
  </React.StrictMode>
);
