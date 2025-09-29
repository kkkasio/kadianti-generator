import { dialog, ipcMain } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { AdiantiProject, AdiantiModel } from '../../types';

export class ProjectService {
  
  static setupIpcHandlers() {
    // Dialog handlers
    ipcMain.handle('dialog:openDirectory', async () => {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
        title: 'Selecionar pasta do projeto Adianti'
      });
      
      return result.canceled ? null : result.filePaths[0];
    });

    // File system handlers
    ipcMain.handle('fs:checkAdiantiProject', async (_, projectPath: string) => {
      return ProjectService.isAdiantiProject(projectPath);
    });

    // Project handlers
    ipcMain.handle('project:readModels', async (_, projectPath: string) => {
      return ProjectService.readModels(projectPath);
    });
  }

  static isAdiantiProject(projectPath: string): boolean {
    try {
      // Check for common Adianti Framework structure
      const requiredPaths = [
        path.join(projectPath, 'app'),
        path.join(projectPath, 'lib'),
        path.join(projectPath, 'app', 'model'),
        path.join(projectPath, 'app', 'control'),
      ];

      return requiredPaths.every(requiredPath => {
        return fs.existsSync(requiredPath) && fs.statSync(requiredPath).isDirectory();
      });
    } catch (error) {
      return false;
    }
  }

  static async readModels(projectPath: string): Promise<AdiantiModel[]> {
    const models: AdiantiModel[] = [];
    const modelsPath = path.join(projectPath, 'app', 'model');
    
    try {
      if (!fs.existsSync(modelsPath)) {
        return models;
      }

      const files = fs.readdirSync(modelsPath);
      
      for (const file of files) {
        if (file.endsWith('.php') || file.endsWith('.class.php')) {
          const filePath = path.join(modelsPath, file);
          const model = await ProjectService.parseModelFile(filePath);
          if (model) {
            models.push(model);
          }
        }
      }
    } catch (error) {
      console.error('Error reading models:', error);
    }

    return models;
  }

  private static async parseModelFile(filePath: string): Promise<AdiantiModel | null> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const filename = path.basename(filePath, '.php').replace('.class', '');
      
      // Basic PHP class parsing (pode ser melhorado com um parser mais robusto)
      const classMatch = content.match(/class\s+(\w+)/);
      const tableMatch = content.match(/const\s+TABLENAME\s*=\s*['"](.*?)['"]/);
      
      if (!classMatch) {
        return null;
      }

      const model: AdiantiModel = {
        name: classMatch[1],
        table: tableMatch ? tableMatch[1] : filename.toLowerCase(),
        fields: [],
        relationships: []
      };

      // Parse fields (basic implementation)
      const fieldMatches = content.matchAll(/\$this->(\w+)\s*=\s*\$data->(\w+)/g);
      for (const match of fieldMatches) {
        model.fields.push({
          name: match[1],
          type: 'string', // Default type, could be improved with better parsing
          nullable: true,
          primaryKey: match[1] === 'id'
        });
      }

      // Parse relationships (basic implementation)
      const relationshipMatches = content.matchAll(/\$this->(\w+)\s*=\s*new\s+(\w+)\(\$data->(\w+)\)/g);
      for (const match of relationshipMatches) {
        model.relationships.push({
          type: 'belongsTo',
          model: match[2],
          foreignKey: match[3]
        });
      }

      return model;
    } catch (error) {
      console.error(`Error parsing model file ${filePath}:`, error);
      return null;
    }
  }
}