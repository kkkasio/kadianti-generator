import React, { useState } from 'react';
import { X, Folder, CheckCircle } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { useNotificationStore } from '../stores/useNotificationStore';
import { extractFolderName, isNotEmpty } from '../utils';
import Main from '../services/Main';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddProjectModal({ isOpen, onClose }: AddProjectModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    path: '',
  });
  const [isValidProject, setIsValidProject] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const isLoading = false;

  const { addNotification } = useNotificationStore();

  const handleSelectPath = async () => {
    try {

      const selectedPath = await Main.API.openFolderDialog();

      if (!selectedPath) return;

      if (selectedPath) {

        setIsValidating(true);
        setFormData(prev => ({ ...prev, path: selectedPath }));
        if (!formData.name.trim()) {
          // Auto-fill project name if empty
          const folderName = extractFolderName(selectedPath);
          setFormData(prev => ({ ...prev, name: folderName }));
          setIsValidProject(true);
        }


        if (false) {
          addNotification({
            type: 'error',
            title: 'Projeto inválido',
            message: 'A pasta selecionada não parece ser um projeto Adianti válido',
          });
        }

        setIsValidating(false);
      }
    } catch (error) {
      console.error('Error selecting directory:', error);
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao selecionar diretório',
      });
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isNotEmpty(formData.name) || !isNotEmpty(formData.path)) {
      addNotification({
        type: 'error',
        title: 'Campos obrigatórios',
        message: 'Preencha todos os campos obrigatórios',
      });
      return;
    }

    if (!isValidProject) {
      addNotification({
        type: 'error',
        title: 'Projeto inválido',
        message: 'Selecione um projeto Adianti válido',
      });
      return;
    }

    //const success = await saveProject(formData);

    const success = true;
    if (success) {
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({ name: '', path: '' });
    setIsValidProject(false);
    setIsValidating(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-dark-800 border border-dark-700 rounded-xl shadow-2xl w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <h3 className="text-lg font-semibold text-white">
            Adicionar Projeto Adianti
          </h3>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Nome do Projeto
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Digite o nome do projeto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Caminho do Projeto
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.path}
                readOnly
                className="flex-1 px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Selecione a pasta do projeto"
              />
              <button
                type="button"
                onClick={handleSelectPath}
                disabled={isValidating}
                className="px-4 py-2 bg-dark-700 hover:bg-dark-600 border border-dark-600 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Folder className="w-4 h-4" />
                Procurar
              </button>
            </div>
          </div>

          {isValidating && (
            <div className="flex items-center gap-2 text-primary-400 text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-400"></div>
              <span>Validando projeto...</span>
            </div>
          )}

          {isValidProject && !isValidating && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
              <CheckCircle className="w-4 h-4" />
              <span>Projeto Adianti detectado</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-dark-300 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !isNotEmpty(formData.name) || !isNotEmpty(formData.path) || !isValidProject}
              className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-dark-600 disabled:to-dark-600 text-white rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              Salvar Projeto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}