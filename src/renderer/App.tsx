import { ProjectsList } from './components/ProjectsList';
import { Header } from './components/Header';
import { NotificationContainer } from './components/NotificationContainer';

export function App() {

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