import { logger } from '../../lib/logger';
import { AdiantiProject } from 'src/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import Main from '../services/Main';

interface ProjectState {
  projects: AdiantiProject[];
  activeProject: AdiantiProject | null;
  isLoading: boolean;

  // Actions
  loadProjects: () => Promise<void>;
  addProject: (project: Omit<AdiantiProject, 'id' | 'createdAt'>) => Promise<AdiantiProject | null>;
  removeProject: (projectId: string) => Promise<boolean>;
  setActiveProject: (projectId: string | null) => Promise<boolean>;
  loadActiveProject: () => Promise<void>;
  refreshProjects: () => Promise<void>;
}

export const useProjectStore = create<ProjectState>()(
  devtools((set, get) => ({
    projects: [] as AdiantiProject[],
    activeProject: null as AdiantiProject | null,
    isLoading: false,

    loadProjects: async () => {
      try {
        set({ isLoading: true });
        const projects = await Main.API.getProjects();
        set({ projects, isLoading: false });
      } catch (error) {
        logger.error('Error loading projects:', error);
        set({ projects: [] as AdiantiProject[], isLoading: false });
      }
    },

    addProject: async (projectData) => {
      try {
        set({ isLoading: true });
        const newProject = await Main.API.saveProject(projectData);
        const currentProjects = get().projects;
        set({
          projects: [...currentProjects, newProject],
          isLoading: false
        });
        return newProject;
      } catch (error) {
        logger.error('Error adding project:', error);
        set({ isLoading: false });
        return null;
      }
    },

    removeProject: async (projectId) => {
      try {
        set({ isLoading: true });
        const success = await Main.API.removeProject(projectId);

        if (success) {
          const currentProjects = get().projects;
          const currentActiveProject = get().activeProject;

          set({
            projects: currentProjects.filter(p => p.id !== projectId),
            activeProject: currentActiveProject?.id === projectId ? null : currentActiveProject,
            isLoading: false
          });
        } else {
          set({ isLoading: false });
        }

        return success;
      } catch (error) {
        logger.error('Error removing project:', error);
        set({ isLoading: false });
        return false;
      }
    },

    setActiveProject: async (projectId) => {
      try {
        const success = await Main.API.setActiveProject(projectId);

        if (success) {
          const projects = get().projects;
          const activeProject = projectId ? projects.find(p => p.id === projectId) || null : null;
          set({ activeProject });
        }

        return success;
      } catch (error) {
        logger.error('Error setting active project:', error);
        return false;
      }
    },

    loadActiveProject: async () => {
      try {
        const activeProject = await Main.API.getActiveProject();
        set({ activeProject });
      } catch (error) {
        logger.error('Error loading active project:', error);
        set({ activeProject: null as AdiantiProject | null });
      }
    },

    refreshProjects: async () => {
      try {
        set({ isLoading: true });

        const [projects, activeProject] = await Promise.all([
          Main.API.getProjects(),
          Main.API.getActiveProject()
        ]);

        set({ projects, activeProject, isLoading: false });
      } catch (error) {
        logger.error('Error refreshing projects:', error);
        set({ projects: [] as AdiantiProject[], activeProject: null as AdiantiProject | null, isLoading: false });
      }
    }
  }))
);
