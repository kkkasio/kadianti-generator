import { BrowserWindow, ipcMain } from "electron";
import { AdiantiProject } from "../../types";
import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';
import logger from "../../lib/logger";

const fsPromises = fs.promises;

export default class Storage {

  static window: BrowserWindow | null = null;
  private static projectsFilePath: string | null = null;
  private static handlersRegistered = false;

  private static async getProjectsFilePath(): Promise<string> {
    if (Storage.projectsFilePath) {
      return Storage.projectsFilePath;
    }

    if (!app.isReady()) {
      await app.whenReady();
    }

    Storage.projectsFilePath = path.join(app.getPath('userData'), 'projects.json');
    return Storage.projectsFilePath;
  }

  private static async ensureProjectsFile(): Promise<string> {
    const filePath = await Storage.getProjectsFilePath();

    try {
      await fsPromises.access(filePath, fs.constants.F_OK);
    } catch {
      const dir = path.dirname(filePath);
      await fsPromises.mkdir(dir, { recursive: true });
      await fsPromises.writeFile(filePath, '[]', 'utf-8');
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
  }

  static async getProjects(): Promise<AdiantiProject[]> {
    try {
      const filePath = await Storage.ensureProjectsFile();

      const data = await fsPromises.readFile(filePath, 'utf-8');

      if (!data.trim()) {
        return [];
      }

      const projects = JSON.parse(data);
      return projects;
    } catch (error) {
      if (error instanceof SyntaxError) {
        try {
          const filePath = await Storage.ensureProjectsFile();
          await fsPromises.writeFile(filePath, '[]', 'utf-8');
        } catch (resetError) {
          logger.error('Error resetting projects file:', resetError);
        }
      }

      return [];
    }
  }

  static async saveProject(projectData: Omit<AdiantiProject, 'id' | 'createdAt'>): Promise<AdiantiProject> {
    try {
      const filePath = await Storage.ensureProjectsFile();
      const projects = await Storage.getProjects();

      const newProject: AdiantiProject = {
        ...projectData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };

      projects.push(newProject);
      await fsPromises.writeFile(filePath, JSON.stringify(projects, null, 2));

      return newProject;
    } catch (error) {
      logger.error('Error saving project:', error);
      throw error;
    }
  }

  static async removeProject(projectId: string): Promise<boolean> {
    try {
      const projects = await Storage.getProjects();
      const filteredProjects = projects.filter(p => p.id !== projectId);
      const filePath = await Storage.ensureProjectsFile();
      await fsPromises.writeFile(filePath, JSON.stringify(filteredProjects, null, 2));

      return true;
    } catch (error) {
      logger.error('Error removing project:', error);
      return false;
    }
  }

  static async updateProjectAccess(projectId: string): Promise<void> {
    try {
      const projects = await Storage.getProjects();
      const project = projects.find(p => p.id === projectId);

      if (project) {
        project.lastAccessed = new Date().toISOString();
        const filePath = await Storage.ensureProjectsFile();
        await fsPromises.writeFile(filePath, JSON.stringify(projects, null, 2));
      }
    } catch (error) {
      logger.error('Error updating project access:', error);
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