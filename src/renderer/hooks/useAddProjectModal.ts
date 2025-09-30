import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useNotificationStore } from '../stores/useNotificationStore';
import { useProjectStore } from '../stores/useProjectStore';
import { extractFolderName } from '../utils';
import Main from '../services/Main';
import { logger } from '../../lib/logger';
import PathUtil from '../../common/util/PathUtil';

// Schema de validação Zod
const projectSchema = z.object({
  name: z.string()
    .min(1, 'Nome do projeto é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
  path: z.string()
    .min(1, 'Caminho do projeto é obrigatório')
});

export type ProjectFormData = z.infer<typeof projectSchema>;

interface UseAddProjectModalProps {
  onClose: () => void;
}

export function useAddProjectModal({ onClose }: UseAddProjectModalProps) {
  const [isValidProject, setIsValidProject] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const { addNotification } = useNotificationStore();
  const { addProject, isLoading } = useProjectStore();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      path: '',
    },
  });

  const watchedName = form.watch('name');

  const handleSelectPath = async () => {
    try {
      const selectedPath = await Main.API.openFolderDialog();

      if (!selectedPath) return;

      if (selectedPath) {
        setIsValidating(true);
        form.setValue('path', selectedPath);

        if (!watchedName.trim()) {
          const folderName = extractFolderName(selectedPath);
          form.setValue('name', folderName);
        }

        setIsValidProject(true);

        // TODO: Implementar validação real do projeto Adianti
        // if (!isValidAdiantiProject(selectedPath)) {
        //   addNotification({
        //     type: 'error',
        //     title: 'Projeto inválido',
        //     message: 'A pasta selecionada não parece ser um projeto Adianti válido',
        //   });
        //   setIsValidProject(false);
        // }

        setIsValidating(false);
      }
    } catch (error) {

      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao selecionar diretório',
      });
      setIsValidating(false);
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const projectPath = PathUtil.normalize(data.path);
      data.path = projectPath;

      logger.info('Submitting project:', data);

      if (!isValidProject) {
        addNotification({
          type: 'error',
          title: 'Projeto inválido',
          message: 'Selecione um projeto Adianti válido',
        });
        return;
      }
      const newProject = await addProject(data);

      if (newProject) {
        addNotification({
          type: 'success',
          title: 'Projeto adicionado',
          message: `Projeto "${newProject.name}" foi adicionado com sucesso`,
        });
        handleClose();
      } else {
        addNotification({
          type: 'error',
          title: 'Erro',
          message: 'Erro ao salvar projeto',
        });
      }
    } catch (error) {

      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao salvar projeto',
      });
    }
  };

  const handleClose = () => {
    form.reset();
    setIsValidProject(false);
    setIsValidating(false);
    onClose();
  };

  return {
    form,
    isValidProject,
    isValidating,
    isLoading,
    handleSelectPath,
    onSubmit,
    handleClose,
  };
}
