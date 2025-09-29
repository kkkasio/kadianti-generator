import { BrowserWindow, ipcMain } from "electron";
import { AdiantiProject } from "../../types";
import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';
import logger from "../../lib/logger";

export default class Storage {

  static window: BrowserWindow | null = null;
  private static projectsFilePath = path.join(app.getPath('userData'), 'projects.json');

  static setupIpcHandlers() {
    ipcMain.handle('storage:getProjects', async () => {
      return Storage.getProjects();
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
      if (!fs.existsSync(Storage.projectsFilePath)) {
        return [];
      }
      const data = fs.readFileSync(Storage.projectsFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      logger.error('Error reading projects:', error);
      return [];
    }
  }

  static async saveProject(projectData: Omit<AdiantiProject, 'id' | 'createdAt'>): Promise<AdiantiProject> {
    try {
      const projects = await Storage.getProjects();

      const newProject: AdiantiProject = {
        ...projectData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };

      projects.push(newProject);

      // Ensure directory exists
      const dir = path.dirname(Storage.projectsFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(Storage.projectsFilePath, JSON.stringify(projects, null, 2));

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

      fs.writeFileSync(Storage.projectsFilePath, JSON.stringify(filteredProjects, null, 2));

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
        fs.writeFileSync(Storage.projectsFilePath, JSON.stringify(projects, null, 2));
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