import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';

console.log('🚀 Kadianti - Gerador de Códigos Adianti iniciado!');

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(<App />);