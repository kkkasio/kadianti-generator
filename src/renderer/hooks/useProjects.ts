import { useProjectStore } from '../stores/useProjectStore';
import { useNotificationStore } from '../stores/useNotificationStore';

export function useProjects() {
  const {
    projects,
    activeProject,
    isLoading,
    loadProjects,
    removeProject: removeProjectAction,
    setActiveProject,
    refreshProjects
  } = useProjectStore();

  const { addNotification } = useNotificationStore();


  const removeProject = async (projectId: string) => {
    try {
      const success = await removeProjectAction(projectId);

      if (success) {
        addNotification({
          type: 'success',
          title: 'Projeto removido',
          message: 'Projeto foi removido com sucesso',
        });
      } else {
        addNotification({
          type: 'error',
          title: 'Erro',
          message: 'Erro ao remover projeto',
        });
      }

      return success;
    } catch (error) {
      console.error('Error removing project:', error);
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao remover projeto',
      });
      return false;
    }
  };

  const activateProject = async (projectId: string | null) => {
    try {
      const success = await setActiveProject(projectId);

      if (success && projectId) {
        const project = projects.find(p => p.id === projectId);
        addNotification({
          type: 'success',
          title: 'Projeto ativado',
          message: `Projeto "${project?.name}" está agora ativo`,
        });
      } else if (success && !projectId) {
        addNotification({
          type: 'info',
          title: 'Projeto desativado',
          message: 'Nenhum projeto está ativo no momento',
        });
      } else {
        addNotification({
          type: 'error',
          title: 'Erro',
          message: 'Erro ao definir projeto ativo',
        });
      }

      return success;
    } catch (error) {
      console.error('Error setting active project:', error);
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao definir projeto ativo',
      });
      return false;
    }
  };

  return {
    projects,
    activeProject,
    loading: isLoading,
    removeProject,
    activateProject,
    refreshProjects,
  };
}
