import logger from '@/lib/logger';
import { AdiantiProject } from 'src/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ProjectState {
  projects: AdiantiProject[];
  currentProject: AdiantiProject | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setProjects: (projects: AdiantiProject[]) => void;
  addProject: (project: AdiantiProject) => void;
  removeProject: (projectId: string) => void;
  setCurrentProject: (project: AdiantiProject | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Async Actions
  loadProjects: () => Promise<void>;
  saveProject: (projectData: Omit<AdiantiProject, 'id' | 'createdAt'>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>()(
  devtools(
    (set, get): ProjectState => ({
      projects: [],
      currentProject: null,
      isLoading: false,
      error: null,

      setProjects: (projects) => set({ projects }),

      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, project]
        })),

      removeProject: (projectId) =>
        set((state) => ({
          projects: state.projects.filter(p => p.id !== projectId)
        })),

      setCurrentProject: (project) => set({ currentProject: project }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      loadProjects: async () => {
        try {
          set({ isLoading: true, error: null });
          const projects = await window.electronAPI.getProjects();
          set({ projects, isLoading: false });
        } catch (error) {
          logger.error('Error loading projects:', error);
          set({
            error: 'Erro ao carregar projetos',
            isLoading: false
          });
        }
      },

      saveProject: async (projectData) => {
        try {
          set({ isLoading: true, error: null });

          // Check if project already exists
          const { projects } = get();
          const existingProject = projects.find(p => p.path === projectData.path);
          if (existingProject) {
            throw new Error('Este projeto já foi adicionado');
          }

          const newProject = await window.electronAPI.saveProject(projectData);
          get().addProject(newProject);
          set({ isLoading: false });
        } catch (error) {
          console.error('Error saving project:', error);
          const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar projeto';
          set({
            error: errorMessage,
            isLoading: false
          });
          throw error;
        }
      },

      deleteProject: async (projectId) => {
        try {
          set({ isLoading: true, error: null });
          const success = await window.electronAPI.removeProject(projectId);

          if (success) {
            get().removeProject(projectId);
          } else {
            throw new Error('Falha ao remover projeto');
          }

          set({ isLoading: false });
        } catch (error) {
          console.error('Error deleting project:', error);
          set({
            error: 'Erro ao remover projeto',
            isLoading: false
          });
          throw error;
        }
      },
    }),
    {
      name: 'project-store',
    }
  )
);