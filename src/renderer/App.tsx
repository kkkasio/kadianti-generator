import { useEffect, useState } from 'react';
import { ProjectsList } from './components/ProjectsList';
import { Header } from './components/Header';
import { NotificationContainer } from './components/NotificationContainer';
import Main from './services/Main';

export function App() {
  const [isApiReady, setIsApiReady] = useState(false);

  useEffect(() => {
    // Verificar se a API está disponível
    const checkApiAvailability = async () => {
      try {
        if (Main.API) {
          setIsApiReady(true);
        } else {
          // Aguardar um pouco e tentar novamente
          setTimeout(() => setIsApiReady(true), 2000);
        }
      } catch (error) {
        console.error('API test failed:', error);
      }
    };

    checkApiAvailability();
  }, []);

  if (!isApiReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-dark-400">Inicializando aplicação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800 text-white">
      <Header />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <ProjectsList />
        </div>
      </main>
      <NotificationContainer />
    </div>
  );
}
