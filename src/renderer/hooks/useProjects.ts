import { useEffect } from 'react';
import { useProjectStore } from '../stores/useProjectStore';
import { useNotificationStore } from '../stores/useNotificationStore';
import logger from '@/lib/logger';

export function useProjects() {

  const { addNotification } = useNotificationStore();

  return;
}