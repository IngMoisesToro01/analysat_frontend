# 🛣️ Estructura de Rutas - Analysat

Esta carpeta contiene la organización jerárquica de las rutas de la aplicación.

## 📁 Estructura de Archivos

```
src/routes/
├── index.tsx          # Rutas principales de la aplicación
├── AuthRoutes.tsx     # Rutas de autenticación
├── UserRoutes.tsx     # Rutas del usuario
├── ProjectRoutes.tsx  # Rutas de proyectos
├── TaskRoutes.tsx     # Rutas de tareas
├── routes.ts          # Exportaciones centralizadas
└── README.md          # Esta documentación
```

## 🗺️ Mapa de Rutas

### Rutas Principales (`/`)

- `/` → Redirige a `/login`
- `/auth/*` → Rutas de autenticación
- `/user/*` → Rutas del usuario (protegidas)
- `/*` → Redirige a `/login` (catch-all)

### Rutas de Autenticación (`/auth/`)

- `/auth/login` → Página de inicio de sesión
- `/auth/register` → Página de registro
- `/auth/*` → Redirige a `/auth/login`

### Rutas del Usuario (`/user/:userId/`)

- `/user/:userId/projects/*` → Rutas de proyectos
- `/user/*` → Redirige a `/user/1/projects`

### Rutas de Proyectos (`/user/:userId/projects/`)

- `/user/:userId/projects/` → Lista de proyectos
- `/user/:userId/projects/:projectId/*` → Rutas de tareas
- `/user/:userId/projects/*` → Redirige a la ruta actual

### Rutas de Tareas (`/user/:userId/projects/:projectId/`)

- `/user/:userId/projects/:projectId/` → Lista de tareas
- `/user/:userId/projects/:projectId/tasks` → Lista de tareas
- `/user/:userId/projects/:projectId/tasks/:taskId` → Detalle de tarea
- `/user/:userId/projects/:projectId/*` → Redirige a la ruta actual

## 🔧 Uso

### Importar rutas

```typescript
import { AppRoutes } from '@/routes/routes'
```

### Navegación

```typescript
// Navegar a proyectos del usuario
navigate('/user/1/projects')

// Navegar a tareas de un proyecto
navigate('/user/1/projects/123')

// Navegar a detalle de tarea
navigate('/user/1/projects/123/tasks/456')
```

## 🎯 Ventajas de esta Estructura

1. **Organización jerárquica**: Las rutas están organizadas por contexto
2. **Mantenibilidad**: Cada grupo de rutas está en su propio archivo
3. **Escalabilidad**: Fácil agregar nuevas rutas sin afectar otras
4. **Reutilización**: Los componentes de rutas pueden ser reutilizados
5. **Claridad**: La estructura refleja la jerarquía de la aplicación

## 📝 Convenciones

- Cada archivo de rutas maneja un nivel específico de la jerarquía
- Las rutas anidadas usan `/*` para delegar a rutas hijas
- Las rutas catch-all redirigen a la ruta padre o a una ruta por defecto
- Los parámetros de ruta se mantienen consistentes en toda la jerarquía
