import { createRoot } from 'react-dom/client';
import { App } from './renderer/App';
import logger from './lib/logger'
import './index.css';

logger.info('🚀 Kadianti - Gerador de Códigos Adianti iniciado!');

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(<App />);