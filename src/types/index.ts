export interface AdiantiProject {
  id: string;
  name: string;
  path: string;
  createdAt: string;
  lastAccessed?: string;
  models?: AdiantiModel[];
}

export interface AdiantiModel {
  name: string;
  table: string;
  fields: AdiantiField[];
  relationships: AdiantiRelationship[];
}

export interface AdiantiField {
  name: string;
  type: string;
  length?: number;
  nullable: boolean;
  primaryKey: boolean;
  foreignKey?: string;
  comment?: string;
}

export interface AdiantiRelationship {
  type: 'hasOne' | 'hasMany' | 'belongsTo' | 'belongsToMany';
  model: string;
  foreignKey?: string;
  localKey?: string;
  pivot?: string;
}

export interface CodeGenerationOptions {
  projectId: string;
  type: 'form' | 'list' | 'report' | 'api';
  model: string;
  fields: string[];
  options: {
    withSearch?: boolean;
    withPagination?: boolean;
    withExport?: boolean;
    template?: string;
  };
}

