import React, { useState } from 'react';
import { Plus, FolderOpen } from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import { AddProjectModal } from './AddProjectModal';
import { useProjects } from '../hooks/useProjects';

export function ProjectsList() {
  const { projects, isLoading, openProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Meus Projetos</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          Adicionar Projeto
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16">
          <FolderOpen className="w-16 h-16 text-dark-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Nenhum projeto adicionado
          </h3>
          <p className="text-dark-400 mb-6 max-w-md mx-auto">
            Adicione seu primeiro projeto Adianti para começar a gerar códigos automaticamente
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Adicionar Primeiro Projeto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={() => openProject(project.id)}
            />
          ))}
        </div>
      )}

      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}