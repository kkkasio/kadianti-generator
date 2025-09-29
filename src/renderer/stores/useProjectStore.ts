import logger from '@/lib/logger';
import { AdiantiProject } from 'src/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ProjectState {

}

export const useProjectStore = create<ProjectState>(() => ({

}))();