import './index.css';
import { AdiantiProject } from './types';

class KadiantiApp {
  private projects: AdiantiProject[] = [];
  private currentProject: AdiantiProject | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    await this.loadProjects();
    this.setupEventListeners();
    this.renderProjects();
  }

  private async loadProjects() {
    try {
      this.projects = await window.electronAPI.getProjects();
    } catch (error) {
      console.error('Error loading projects:', error);
      this.showError('Erro ao carregar projetos');
    }
  }

  private setupEventListeners() {
    // Add project button
    const addProjectBtn = document.getElementById('addProjectBtn');
    addProjectBtn?.addEventListener('click', () => this.showAddProjectModal());

    // Modal events
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const cancelBtn = document.getElementById('cancelBtn');

    modalOverlay?.addEventListener('click', (e) => {
      if (e.target === modalOverlay) this.hideAddProjectModal();
    });
    modalClose?.addEventListener('click', () => this.hideAddProjectModal());
    cancelBtn?.addEventListener('click', () => this.hideAddProjectModal());

    // Select path button
    const selectPathBtn = document.getElementById('selectPathBtn');
    selectPathBtn?.addEventListener('click', () => this.selectProjectPath());

    // Save project button
    const saveProjectBtn = document.getElementById('saveProjectBtn');
    saveProjectBtn?.addEventListener('click', () => this.saveProject());

    // Project name input validation
    const projectNameInput = document.getElementById('projectName') as HTMLInputElement;
    const projectPathInput = document.getElementById('projectPath') as HTMLInputElement;

    const validateForm = () => {
      const saveBtn = document.getElementById('saveProjectBtn') as HTMLButtonElement;
      const isValid = projectNameInput.value.trim() && projectPathInput.value.trim();
      saveBtn.disabled = !isValid;
    };

    projectNameInput?.addEventListener('input', validateForm);
    projectPathInput?.addEventListener('input', validateForm);
  }

  private renderProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    const emptyState = document.getElementById('emptyState');

    if (!projectsGrid || !emptyState) return;

    if (this.projects.length === 0) {
      projectsGrid.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }

    projectsGrid.style.display = 'grid';
    emptyState.style.display = 'none';

    projectsGrid.innerHTML = this.projects.map(project => `
      <div class="project-card" data-project-id="${project.id}">
        <div class="project-header">
          <div>
            <div class="project-title">${project.name}</div>
            <div class="project-path">${project.path}</div>
          </div>
          <div class="project-actions">
            <button class="btn-icon" onclick="kadiantiApp.removeProject('${project.id}')" title="Remover projeto">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="project-meta">
          <div class="project-date">
            Criado em ${new Date(project.createdAt).toLocaleDateString('pt-BR')}
          </div>
          <div class="project-status">
            <div class="status-dot"></div>
            <span>Ativo</span>
          </div>
        </div>
      </div>
    `).join('');

    // Add click events to project cards
    const projectCards = projectsGrid.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.project-actions')) {
          const projectId = card.getAttribute('data-project-id');
          if (projectId) {
            this.openProject(projectId);
          }
        }
      });
    });
  }

  private showAddProjectModal() {
    const modal = document.getElementById('modalOverlay');
    if (modal) {
      modal.style.display = 'flex';

      // Clear form
      const projectNameInput = document.getElementById('projectName') as HTMLInputElement;
      const projectPathInput = document.getElementById('projectPath') as HTMLInputElement;
      const projectInfo = document.getElementById('projectInfo');
      const saveBtn = document.getElementById('saveProjectBtn') as HTMLButtonElement;

      if (projectNameInput) projectNameInput.value = '';
      if (projectPathInput) projectPathInput.value = '';
      if (projectInfo) projectInfo.style.display = 'none';
      if (saveBtn) saveBtn.disabled = true;
    }
  }

  private hideAddProjectModal() {
    const modal = document.getElementById('modalOverlay');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  private async selectProjectPath() {
    try {
      const selectedPath = await window.electronAPI.selectDirectory();

      if (selectedPath) {
        const projectPathInput = document.getElementById('projectPath') as HTMLInputElement;
        const projectInfo = document.getElementById('projectInfo');
        const projectNameInput = document.getElementById('projectName') as HTMLInputElement;

        if (projectPathInput) {
          projectPathInput.value = selectedPath;
        }

        // Check if it's a valid Adianti project
        const isValid = await window.electronAPI.checkAdiantiProject(selectedPath);

        if (projectInfo) {
          if (isValid) {
            projectInfo.style.display = 'block';

            // Auto-fill project name if empty
            if (projectNameInput && !projectNameInput.value.trim()) {
              const pathParts = selectedPath.split(/[/\\]/);
              const folderName = pathParts[pathParts.length - 1];
              projectNameInput.value = folderName;
            }
          } else {
            projectInfo.style.display = 'none';
            this.showError('A pasta selecionada não parece ser um projeto Adianti válido');
          }
        }

        // Trigger validation
        const event = new Event('input');
        projectPathInput.dispatchEvent(event);
      }
    } catch (error) {
      console.error('Error selecting directory:', error);
      this.showError('Erro ao selecionar diretório');
    }
  }

  private async saveProject() {
    try {
      const projectNameInput = document.getElementById('projectName') as HTMLInputElement;
      const projectPathInput = document.getElementById('projectPath') as HTMLInputElement;

      const name = projectNameInput.value.trim();
      const path = projectPathInput.value.trim();

      if (!name || !path) {
        this.showError('Preencha todos os campos obrigatórios');
        return;
      }

      // Check if project already exists
      const existingProject = this.projects.find(p => p.path === path);
      if (existingProject) {
        this.showError('Este projeto já foi adicionado');
        return;
      }

      const project = await window.electronAPI.saveProject({ name, path });

      this.projects.push(project);
      this.renderProjects();
      this.hideAddProjectModal();

      this.showSuccess('Projeto adicionado com sucesso!');
    } catch (error) {
      console.error('Error saving project:', error);
      this.showError('Erro ao salvar projeto');
    }
  }

  async removeProject(projectId: string) {
    if (!confirm('Tem certeza que deseja remover este projeto?')) {
      return;
    }

    try {
      const success = await window.electronAPI.removeProject(projectId);

      if (success) {
        this.projects = this.projects.filter(p => p.id !== projectId);
        this.renderProjects();
        this.showSuccess('Projeto removido com sucesso!');
      } else {
        this.showError('Erro ao remover projeto');
      }
    } catch (error) {
      console.error('Error removing project:', error);
      this.showError('Erro ao remover projeto');
    }
  }

  private async openProject(projectId: string) {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return;

    try {
      // TODO: Navigate to project workspace
      this.currentProject = project;
      console.log('Opening project:', project);

      // For now, just show a message
      this.showSuccess(`Projeto "${project.name}" será aberto em breve!`);

      // Here we would implement navigation to the project workspace
    } catch (error) {
      console.error('Error opening project:', error);
      this.showError('Erro ao abrir projeto');
    }
  }

  private showError(message: string) {
    this.showNotification(message, 'error');
  }

  private showSuccess(message: string) {
    this.showNotification(message, 'success');
  }

  private showNotification(message: string, type: 'success' | 'error') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
      </div>
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }
}

// Global instance
declare global {
  interface Window {
    kadiantiApp: KadiantiApp;
  }
}

const kadiantiApp = new KadiantiApp();
window.kadiantiApp = kadiantiApp;

console.log('🚀 Kadianti - Gerador de Códigos Adianti iniciado!');
