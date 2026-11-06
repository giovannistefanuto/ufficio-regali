import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import { App } from './app/App';
import './styles/tokens.css';
import './styles/global.css';
import './styles/archive.css';
import './styles/book3d.css';
import './styles/panel.css';
import './styles/motion.css';
import './styles/pages.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
