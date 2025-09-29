import React from 'react';
import { Calendar, FolderIcon, Trash2 } from 'lucide-react';
import { AdiantiProject } from '../types';
import { useProjects } from '../hooks/useProjects';
import { formatDate } from '../utils';

interface ProjectCardProps {
  project: AdiantiProject;
  onOpen: () => void;
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const { deleteProject } = useProjects();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Tem certeza que deseja remover este projeto?')) {
      return;
    }

    await deleteProject(project.id);
  };

  return (
    <div
      onClick={onOpen}
      className="group relative bg-dark-800/50 hover:bg-dark-800/80 border border-dark-700/50 hover:border-primary-500/30 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/10 hover:-translate-y-1"
    >
      {/* Header gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-cyan-500 to-emerald-500 rounded-t-xl"></div>
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white mb-1 truncate">
            {project.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-dark-400">
            <FolderIcon className="w-4 h-4" />
            <span className="truncate" title={project.path}>
              {project.path}
            </span>
          </div>
        </div>
        
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          title="Remover projeto"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-dark-700/50">
        <div className="flex items-center gap-2 text-sm text-dark-500">
          <Calendar className="w-4 h-4" />
          <span>Criado em {formatDate(project.createdAt)}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          <span className="text-xs text-dark-400">Ativo</span>
        </div>
      </div>
    </div>
  );
}