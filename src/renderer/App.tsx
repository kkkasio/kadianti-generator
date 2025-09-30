import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './components/Header';
import { NotificationContainer } from './components/NotificationContainer';
import { AppRoutes } from './AppRoutes';
import { useProjectStore } from './stores/useProjectStore';
import Main from './services/Main';

function AppContent() {
  const [isApiReady, setIsApiReady] = useState(false);
  const { loadActiveProject } = useProjectStore();

  useEffect(() => {
    const checkApiAvailability = async () => {
      try {
        if (Main.API) {
          setIsApiReady(true);
          await loadActiveProject();
        } else {
          // Aguardar um pouco e tentar novamente
          setTimeout(() => setIsApiReady(true), 2000);
        }
      } catch (error) {
        console.error('API test failed:', error);
      }
    };

    checkApiAvailability();
  }, [loadActiveProject]);

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
      <AppRoutes />
      <NotificationContainer />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
