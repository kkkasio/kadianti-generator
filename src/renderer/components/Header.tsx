import { Code2, Sparkles, FolderOpen } from 'lucide-react';
import { useProjectStore } from '../stores/useProjectStore';
import Main from '../services/Main';

export function Header() {
  const { activeProject } = useProjectStore();

  const version = async () => {
    return await Main.API.getAppVersion();
  }

  return (
    <header className="bg-dark-900/80 backdrop-blur-lg border-b border-dark-700/50 px-6 py-4 -webkit-app-region-drag">
      <div className="max-w-7xl mx-auto -webkit-app-region-no-drag">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Code2 className="w-8 h-8 text-primary-500" />
              <Sparkles className="w-4 h-4 text-primary-400 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-red-400">
                KAdianti
              </h1>
              <p className="text-sm text-dark-400">
                Gerador de Códigos Adianti Framework
              </p>
            </div>
          </div>

          {/* Projeto Ativo */}
          <div className="flex items-center gap-2 px-4 py-2 bg-dark-800/50 rounded-lg border border-dark-700/50">
            <FolderOpen className="w-4 h-4 text-primary-500" />
            {activeProject ? (
              <div>
                <p className="text-sm font-medium text-white">
                  {activeProject.name}
                </p>
                <p className="text-xs text-dark-400">
                  Projeto Ativo
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-dark-400">
                  Nenhum projeto ativo
                </p>
                <p className="text-xs text-dark-500">
                  Selecione um projeto
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}