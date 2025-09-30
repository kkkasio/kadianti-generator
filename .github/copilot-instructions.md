# Kadianti - Copilot Instructions

Kadianti is an Electron desktop app for generating code for Adianti Framework PHP projects. Built with React + TypeScript + TailwindCSS.

## Architecture Overview

**Electron Process Architecture:**
- `src/main.ts` - Main process with window creation and IPC setup
- `src/preload.ts` - Secure bridge exposing `window.api` to renderer
- `src/renderer/` - React app using Vite for development

**Key Data Flow:**
Renderer ↔ Preload (`window.api`) ↔ IPC ↔ Main Process ↔ File System

## Critical Patterns

### IPC Communication Pattern
Follow the established pattern for adding new IPC handlers:

1. **Main Process** (`src/main/IpcMessagesHandler.ts`):
```typescript
ipcMain.handle("namespace:action:verb", async (event) => {
  return handleError(event, async () => {
    // Implementation
  })
})
```

2. **Preload** (`src/preload.ts`):
```typescript
contextBridge.exposeInMainWorld('api', {
  methodName: () => ipcRenderer.invoke("namespace:action:verb")
});
```

3. **Renderer** (`src/renderer/services/Main.ts`):
```typescript
// Access via Main.API.methodName()
```

### Component Architecture Pattern
Use **logic-UI separation** pattern exemplified in `AddProjectModal`:
- **Logic**: Custom hooks in `src/renderer/hooks/` (e.g., `useAddProjectModal.ts`)
- **UI**: Pure components that consume hooks
- **State**: Zustand stores in `src/renderer/stores/`

### State Management with Zustand
Store pattern in `src/renderer/stores/`:
```typescript
export const useStoreNameStore = create<StoreState>()(
  devtools((set) => ({
    // State properties
    actions: (params) => set((state) => ({ /* updates */ }))
  }))
);
```

### Error Handling Pattern
All IPC calls wrapped with `handleError` utility in main process. Renderer uses notification system:
```typescript
import { useNotificationStore } from '../stores/useNotificationStore';
const { addNotification } = useNotificationStore();
```

## Development Workflow

**Start Development:**
```bash
yarn dev  # or yarn start - launches Electron with hot reload
```

**Build & Package:**
```bash
yarn make  # Creates distributable packages
yarn package  # Package without creating installers
```

**Styling:**
- TailwindCSS with custom `ks-` prefix
- Dark theme with custom color palette in `tailwind.config.ts`
- Main colors: `primary-*`, `dark-800`, `dark-900`

## Project-Specific Conventions

**File Organization:**
- `src/main/` - Electron main process (Node.js)
- `src/renderer/` - React frontend
- `src/types/` - Shared TypeScript interfaces
- `src/common/` - Utilities used by both processes

**Naming Conventions:**
- Services: PascalCase classes (e.g., `ProjectService`)
- Components: PascalCase with `.tsx` extension
- Hooks: `use` prefix (e.g., `useAddProjectModal`)
- Stores: `use` + name + `Store` (e.g., `useProjectStore`)

**Type Safety:**
- All IPC methods must be typed in `src/types/electron.d.ts`
- Domain types in `src/types/index.ts` (e.g., `AdiantiProject`)
- Global types in `src/types/common.d.ts`

**Adianti Project Validation:**
Projects must contain: `app/`, `lib/`, `app/model/`, `app/control/` directories.

## Integration Points

**File System Access:**
Only through IPC - use `Main.API.openFolderDialog()` for directory selection.

**Storage:**
Main process handles all file I/O via `Storage` service with IPC handlers.

**Cross-Component Communication:**
Use Zustand stores for global state, props/callbacks for local communication.

## Build Configuration

- **Vite**: Multi-config setup (`vite.main.config.ts`, `vite.renderer.config.ts`, `vite.preload.config.ts`)
- **Electron Forge**: Packaging via `forge.config.ts`
- **TailwindCSS v4**: PostCSS integration via `postcss.config.js`

Always maintain type safety between processes and follow the established IPC patterns when adding new functionality.
