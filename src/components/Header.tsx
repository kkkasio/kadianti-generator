import React from 'react';
import { Code2, Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-dark-900/80 backdrop-blur-lg border-b border-dark-700/50 px-6 py-4 -webkit-app-region-drag">
      <div className="max-w-7xl mx-auto -webkit-app-region-no-drag">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Code2 className="w-8 h-8 text-primary-500" />
              <Sparkles className="w-4 h-4 text-primary-400 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
                Kadianti
              </h1>
              <p className="text-sm text-dark-400">
                Gerador de Códigos Adianti Framework
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}