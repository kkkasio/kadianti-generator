import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ProjectsList } from './components/ProjectsList';
import { Sidebar } from './components/Sidebar';
import { DatabaseManager } from './pages/DatabaseManager';
import { CodeGenerator } from './pages/CodeGenerator';
import { Explorer } from './pages/Explorer';
import { Settings } from './pages/Settings';
import { useProjectStore } from './stores/useProjectStore';

function WorkspaceLayout() {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Sidebar />
      <Outlet />
    </div>
  );
}

function WorkspaceRoutes() {
  return (
    <Routes>
      <Route path="/workspace" element={<WorkspaceLayout />}>
        <Route index element={<Navigate to="/workspace/database" replace />} />
        <Route path="database" element={<DatabaseManager />} />
        <Route path="code-generator" element={<CodeGenerator />} />
        <Route path="explorer" element={<Explorer />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/workspace" replace />} />
    </Routes>
  );
}

function ProjectsRoutes() {
  return (
    <Routes>
      <Route path="*" element={
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <ProjectsList />
          </div>
        </main>
      } />
    </Routes>
  );
}

export function AppRoutes() {
  const { activeProject } = useProjectStore();

  return activeProject ? <WorkspaceRoutes /> : <ProjectsRoutes />;
}
