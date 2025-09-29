import { useEffect } from 'react';
import { useProjectStore } from '../stores/useProjectStore';
import { useNotificationStore } from '../stores/useNotificationStore';

export function useProjects() {
  const {
    projects,
    currentProject,
    isLoading,
    error,
    loadProjects,
    saveProject,
    deleteProject,
    setCurrentProject,
  } = useProjectStore();
  
  const { addNotification } = useNotificationStore();

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Show error notifications
  useEffect(() => {
    if (error) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: error,
      });
    }
  }, [error, addNotification]);

  const handleSaveProject = async (projectData: { name: string; path: string }) => {
    try {
      await saveProject(projectData);
      addNotification({
        type: 'success',
        title: 'Projeto adicionado',
        message: 'Projeto adicionado com sucesso!',
      });
      return true;
    } catch (error) {
      // Error already handled by store and shown via useEffect above
      return false;
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      addNotification({
        type: 'success',
        title: 'Projeto removido',
        message: 'Projeto removido com sucesso!',
      });
      return true;
    } catch (error) {
      // Error already handled by store and shown via useEffect above
      return false;
    }
  };

  const handleOpenProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
      // TODO: Navigate to project workspace
      addNotification({
        type: 'info',
        title: 'Projeto selecionado',
        message: `Projeto "${project.name}" será aberto em breve!`,
      });
    }
  };

  return {
    projects,
    currentProject,
    isLoading,
    saveProject: handleSaveProject,
    deleteProject: handleDeleteProject,
    openProject: handleOpenProject,
  };
}