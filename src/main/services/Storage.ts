import { BrowserWindow, ipcMain } from "electron";
import { AdiantiProject } from "../../types";
import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';
import logger from "../../lib/logger";

const fsPromises = fs.promises;

interface AppConfig {
  activeProjectId: string | null;
  projects: AdiantiProject[];
}

export default class Storage {

  static window: BrowserWindow | null = null;
  private static configFilePath: string | null = null;
  private static handlersRegistered = false;

  private static async getConfigFilePath(): Promise<string> {
    if (Storage.configFilePath) {
      return Storage.configFilePath;
    }

    if (!app.isReady()) {
      await app.whenReady();
    }

    Storage.configFilePath = path.join(app.getPath('userData'), 'kadianti-config.json');
    return Storage.configFilePath;
  }

  private static async ensureConfigFile(): Promise<string> {
    const filePath = await Storage.getConfigFilePath();

    try {
      await fsPromises.access(filePath, fs.constants.F_OK);
    } catch {
      const dir = path.dirname(filePath);
      await fsPromises.mkdir(dir, { recursive: true });
      const defaultConfig: AppConfig = {
        activeProjectId: null,
        projects: []
      };
      await fsPromises.writeFile(filePath, JSON.stringify(defaultConfig, null, 2), 'utf-8');
    }

    return filePath;
  }

  static setupIpcHandlers() {
    if (Storage.handlersRegistered) {
      console.log('IPC handlers already registered, skipping...');
      return;
    }

    Storage.handlersRegistered = true;

    ipcMain.handle('storage:getProjects', async () => {
      const result = await Storage.getProjects();
      return result;
    });

    ipcMain.handle('storage:saveProject', async (_, project: Omit<AdiantiProject, 'id' | 'createdAt'>) => {
      return Storage.saveProject(project);
    });

    ipcMain.handle('storage:removeProject', async (_, projectId: string) => {
      return Storage.removeProject(projectId);
    });

    ipcMain.handle('storage:getActiveProject', async () => {
      return Storage.getActiveProject();
    });

    ipcMain.handle('storage:setActiveProject', async (_, projectId: string | null) => {
      return Storage.setActiveProject(projectId);
    });

    ipcMain.handle('storage:getConfig', async () => {
      return Storage.getConfig();
    });
  }

  static async getProjects(): Promise<AdiantiProject[]> {
    try {
      const config = await Storage.getConfig();
      return config.projects;
    } catch (error) {
      logger.error('Error getting projects:', error);
      return [];
    }
  }

  static async getConfig(): Promise<AppConfig> {
    try {
      const filePath = await Storage.ensureConfigFile();
      const data = await fsPromises.readFile(filePath, 'utf-8');

      if (!data.trim()) {
        const defaultConfig: AppConfig = {
          activeProjectId: null,
          projects: []
        };
        await fsPromises.writeFile(filePath, JSON.stringify(defaultConfig, null, 2), 'utf-8');
        return defaultConfig;
      }

      const config = JSON.parse(data);
      return config;
    } catch (error) {
      logger.error('Error getting config:', error);
      const defaultConfig: AppConfig = {
        activeProjectId: null,
        projects: []
      };
      return defaultConfig;
    }
  }

  static async saveConfig(config: AppConfig): Promise<void> {
    try {
      const filePath = await Storage.ensureConfigFile();
      await fsPromises.writeFile(filePath, JSON.stringify(config, null, 2), 'utf-8');
    } catch (error) {
      logger.error('Error saving config:', error);
      throw error;
    }
  }

  static async saveProject(projectData: Omit<AdiantiProject, 'id' | 'createdAt'>): Promise<AdiantiProject> {
    try {
      const config = await Storage.getConfig();

      // Verificar se já existe um projeto com o mesmo caminho
      const existingProject = config.projects.find(p => p.path === projectData.path);
      if (existingProject) {
        throw new Error('Já existe um projeto com este caminho');
      }

      const newProject: AdiantiProject = {
        ...projectData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };

      config.projects.push(newProject);
      await Storage.saveConfig(config);

      return newProject;
    } catch (error) {
      logger.error('Error saving project:', error);
      throw error;
    }
  }

  static async removeProject(projectId: string): Promise<boolean> {
    try {
      const config = await Storage.getConfig();
      config.projects = config.projects.filter(p => p.id !== projectId);

      // Se o projeto removido era o ativo, limpar o projeto ativo
      if (config.activeProjectId === projectId) {
        config.activeProjectId = null;
      }

      await Storage.saveConfig(config);
      return true;
    } catch (error) {
      logger.error('Error removing project:', error);
      return false;
    }
  }

  static async updateProjectAccess(projectId: string): Promise<void> {
    try {
      const config = await Storage.getConfig();
      const project = config.projects.find(p => p.id === projectId);

      if (project) {
        project.lastAccessed = new Date().toISOString();
        await Storage.saveConfig(config);
      }
    } catch (error) {
      logger.error('Error updating project access:', error);
    }
  }

  static async getActiveProject(): Promise<AdiantiProject | null> {
    try {
      const config = await Storage.getConfig();
      if (!config.activeProjectId) {
        return null;
      }

      const activeProject = config.projects.find(p => p.id === config.activeProjectId);
      return activeProject || null;
    } catch (error) {
      logger.error('Error getting active project:', error);
      return null;
    }
  }

  static async setActiveProject(projectId: string | null): Promise<boolean> {
    try {
      const config = await Storage.getConfig();

      // Se projectId não é null, verificar se o projeto existe
      if (projectId !== null) {
        const projectExists = config.projects.some(p => p.id === projectId);
        if (!projectExists) {
          logger.error(`Project with id ${projectId} not found`);
          return false;
        }

        // Atualizar lastAccessed do projeto
        await Storage.updateProjectAccess(projectId);
      }

      config.activeProjectId = projectId;
      await Storage.saveConfig(config);
      return true;
    } catch (error) {
      logger.error('Error setting active project:', error);
      return false;
    }
  }

  static async getAll() {
    if (!Storage.hasWindow()) return null;

    return await Storage.getWindow()!.webContents.executeJavaScript(`({...localStorage})`, true)
  }

  async get(key: string) {
    if (!Storage.hasWindow()) return null;

    return await Storage.getWindow()!.webContents.executeJavaScript(`localStorage.getItem('${key}')`, true)
  }

  async set(key: string, value: string) {
    if (!Storage.hasWindow()) return null;
    return await Storage.getWindow()!.webContents.executeJavaScript(`localStorage.setItem('${key}', '${value}')`, true);
  }

  static clear() {
    if (!Storage.hasWindow()) return null;
    return Storage.getWindow()!.webContents.executeJavaScript(`localStorage.clear()`, true);
  }

  static setWindow(window: BrowserWindow) {
    Storage.window = window
  }

  static hasWindow() {
    return Storage.window !== null
  }

  static getWindow() {
    return Storage.window
  }
}
