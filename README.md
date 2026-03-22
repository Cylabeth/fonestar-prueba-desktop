
# NodeTron — Desktop Node Editor

Aplicación de escritorio construida con Electron, React y TypeScript que permite visualizar y editar un diagrama de nodos conectados. Los datos persisten en una base de datos SQLite local, y toda la comunicación entre la interfaz y el sistema de archivos se realiza de forma segura a través del sistema IPC de Electron.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Desktop | Electron 41 |
| Frontend | React 19 + TypeScript 5.9 |
| Build | Vite 8 |
| UI | Material UI 7 |
| Diagrama | React Flow 11 |
| Base de datos | SQLite via better-sqlite3 |
| Estilos | Emotion (CSS-in-JS) |

---

## Qué hace la aplicación

1. El usuario se autentica con credenciales hardcodeadas (prueba técnica, sin backend real).
2. Accede a un diagrama de nodos cargado desde SQLite.
3. Puede seleccionar cualquier nodo para editar su título, descripción e imagen.
4. Los cambios se guardan de forma asíncrona en la base de datos local.
5. Las imágenes se seleccionan desde el sistema de archivos mediante un diálogo nativo y se almacenan como rutas absolutas, nunca como binarios.

---

## Arquitectura

El proyecto sigue la arquitectura de procesos de Electron de forma estricta, separando tres capas con responsabilidades bien definidas:
```
src/
  main/          → proceso principal: Electron, SQLite, IPC handlers
  preload/       → bridge seguro entre main y renderer
  renderer/      → aplicación React
  shared/        → contratos comunes (canales IPC, tipos TypeScript)
```

### Main process

Es el único proceso con acceso al sistema de archivos y a SQLite. Contiene:

- `database/connection.ts` — singleton de conexión SQLite con WAL mode activado
- `database/schema.ts` — creación de tablas y seed inicial, idempotente
- `database/repositories/` — queries SQL encapsuladas por dominio
- `ipc/` — handlers que reciben peticiones del renderer y delegan en los repositorios
- `protocol.ts` — registro del protocolo personalizado `localfile://`

### Preload

Script que se ejecuta antes de que cargue el renderer, con acceso controlado a las APIs de Electron. Expone `window.electronAPI` mediante `contextBridge`, que es el único canal autorizado entre la interfaz y el sistema.
```typescript
contextBridge.exposeInMainWorld('electronAPI', {
  getNodes: () => ipcRenderer.invoke(IpcChannels.nodes.getAll),
  updateNode: (id, data) => ipcRenderer.invoke(IpcChannels.nodes.update, id, data),
  getEdges: () => ipcRenderer.invoke(IpcChannels.edges.getAll),
  openImageDialog: () => ipcRenderer.invoke(IpcChannels.dialog.openImage),
})
```

### Renderer

Aplicación React estándar que no tiene ninguna dependencia directa de Electron o Node. Se comunica con el sistema exclusivamente a través de `window.electronAPI`.

Contiene hooks, componentes y páginas organizados por responsabilidad:

- `hooks/useNodes.ts` — carga nodos y edges desde IPC al montar
- `hooks/useNodeEditor.ts` — gestiona selección, formulario de edición y guardado
- `components/diagram/DiagramCanvas.tsx` — canvas React Flow con sincronización asíncrona
- `components/diagram/CustomNode.tsx` — nodo personalizado con imagen y paleta de colores
- `components/sidebar/NodeSidebar.tsx` — panel lateral de edición, puramente presentacional
- `pages/LoginPage.tsx` — pantalla de autenticación con toggle de tema
- `pages/MainPage.tsx` — página principal que orquesta canvas, sidebar y feedback

### Shared

Dos archivos que actúan como contrato entre procesos:

- `ipcChannels.ts` — constantes tipadas para los nombres de canales IPC. Evita literales duplicados entre main y preload.
- `types.ts` — interfaces de dominio (`NodeRecord`, `EdgeRecord`, `NodeUpdatePayload`) en camelCase. Los repositorios hacen el mapeo desde snake_case de SQLite usando alias SQL.

---

## Flujo de datos
```
Usuario interactúa con React
  → window.electronAPI.getNodes()
    → ipcRenderer.invoke('nodes:getAll')
      → ipcMain.handle('nodes:getAll')
        → nodeRepository.getAllNodes(db)
          → SELECT con alias SQL (snake_case → camelCase)
        ← NodeRecord[]
      ← NodeRecord[]
    ← NodeRecord[]
  ← setNodes(data) en useNodes hook
← React Flow renderiza los nodos
```

El mismo flujo aplica para `updateNode` y `openImageDialog`. Todo es asíncrono y basado en promesas.

---

## Problemas reales encontrados y soluciones

### 1. Preload no cargaba — conflicto ESM vs CommonJS

El `package.json` tiene `"type": "module"`, lo que hace que Node interprete todos los `.js` como ESM. Sin embargo, Electron carga el preload en un contexto donde CommonJS es más fiable, especialmente con `sandbox: false` y native addons.

El síntoma era `window.electronAPI === undefined` en el renderer, sin ningún error visible.

**Solución:** separar la compilación del lado Electron del renderer. El main y el preload compilan a `dist-electron/` con `"module": "CommonJS"`. Se añade un `package.json` en `dist-electron/` con `"type": "commonjs"` para que Node los interprete correctamente independientemente del `type` del proyecto raíz. Un script `prepare-electron.cjs` garantiza que ese archivo exista antes de arrancar Electron.

### 2. better-sqlite3 incompatible con Electron

`better-sqlite3` es un native addon que compila contra Node. Electron tiene su propia versión de Node internamente, por lo que el addon compilado para Node estándar no es compatible.

**Solución:** `electron-rebuild` recompila el addon contra la versión de Node que usa Electron. Se ejecuta tras `npm install`.

### 3. Imágenes locales no cargaban en el renderer

Electron bloquea el protocolo `file://` en el renderer por políticas de seguridad de Chromium. Las rutas absolutas del sistema de archivos no se pueden usar directamente como `src` en elementos `<img>`.

**Solución:** se registra un protocolo personalizado `localfile://` en el main process usando `protocol.registerSchemesAsPrivileged` (antes de `app.whenReady()`) y `protocol.handle` (dentro de `app.whenReady()`). El protocolo intercepta las peticiones, convierte `localfile://` a `file://` internamente y sirve el archivo. En el renderer, una función `toLocalFileUrl()` normaliza las rutas de Windows (barras invertidas) antes de construir la URL.

### 4. Rutas de Windows con barras invertidas

Las rutas devueltas por el diálogo de archivo en Windows usan `\` como separador. Los protocolos de URL esperan `/`.

**Solución:** `toLocalFileUrl()` en `src/renderer/services/electronApi.ts` normaliza el separador antes de construir la URL `localfile://`.

---

## Cómo ejecutar el proyecto

### Requisitos previos

- Node.js 20+
- npm 10+

### Instalación
```bash
npm install
npx electron-rebuild
```

### Desarrollo
```bash
npm run dev
```

Este comando lanza tres procesos en paralelo mediante `concurrently`:

- `dev:renderer` — servidor Vite con HMR en `localhost:5173`
- `dev:tsc` — compilación en watch del main y preload a `dist-electron/`
- `dev:electron` — espera a que exista `dist-electron/main/index.js` y lanza Electron con `electronmon`

### Credenciales de acceso
```
Email:    admin@nodetron.local
Password: Admin123!
```

---

## Decisiones de diseño

**Por qué IPC y no acceso directo a SQLite desde React**

Electron permite activar `nodeIntegration: true` para que el renderer tenga acceso completo a Node. Se descartó por razones de seguridad: cualquier código que se ejecute en el renderer (incluyendo dependencias de terceros) tendría acceso al sistema de archivos y a la base de datos. Con `contextIsolation: true` y `nodeIntegration: false`, el renderer está completamente aislado y solo puede hacer lo que el preload expone explícitamente.

**Por qué un archivo centralizado de canales IPC**

Los nombres de los canales IPC son strings que deben coincidir exactamente entre `ipcMain.handle` (main) y `ipcRenderer.invoke` (preload). Sin centralización, cualquier typo produce un bug silencioso en runtime. `src/shared/ipcChannels.ts` es la única fuente de verdad para estos valores.

**Por qué camelCase en los tipos TypeScript con mapeo en el repositorio**

SQLite usa snake_case por convención (`image_path`, `pos_x`). TypeScript y React usan camelCase. En lugar de hacer la transformación en los componentes o en el hook, el mapeo se hace mediante alias SQL en el `SELECT` del repositorio. Así el resto del código trabaja siempre con tipos TypeScript consistentes.

**Por qué no se editan los edges**

El scope de esta prueba técnica no incluye edición de conexiones. Los edges se cargan desde SQLite como datos de visualización. La arquitectura está preparada para añadir esta funcionalidad sin cambios estructurales: bastaría con implementar `onConnect` en `DiagramCanvas`, añadir un handler `edges:create` y su repositorio correspondiente.

**Por qué no hay router externo**

La navegación de la aplicación se reduce a dos estados mutuamente excluyentes: autenticado o no autenticado. Introducir `react-router` para gestionar dos vistas sería sobrearquitectura. El estado de autenticación vive en `App.tsx` como un booleano local.

---

## Estructura de base de datos
```sql
CREATE TABLE nodes (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_path  TEXT NOT NULL DEFAULT '',
  pos_x       REAL NOT NULL DEFAULT 0,
  pos_y       REAL NOT NULL DEFAULT 0
);

CREATE TABLE edges (
  id      TEXT PRIMARY KEY,
  source  TEXT NOT NULL REFERENCES nodes(id),
  target  TEXT NOT NULL REFERENCES nodes(id),
  label   TEXT
);
```

La base de datos se crea automáticamente en `app.getPath('userData')` si no existe. El seed inicial inserta 5 nodos y 4 edges en una transacción atómica, solo si la tabla está vacía.

---

## Limitaciones conocidas

- La aplicación depende del entorno Electron para acceder a SQLite y al sistema de archivos.
- En ejecución web (Vite), el bridge `window.electronAPI` no existe, por lo que las funcionalidades de datos no están disponibles.
- No existe persistencia de sesión ni autenticación real.
- No hay validación avanzada de inputs en edición de nodos.

---

## Trade-offs y decisiones conscientes

- **Electron + SQLite en local vs backend remoto**
  - Se priorizó simplicidad y offline-first para la prueba.
  - Trade-off: no hay sincronización ni multiusuario.

- **IPC explícito vs acceso directo desde renderer**
  - Se eligió IPC para aislamiento y seguridad.
  - Trade-off: mayor complejidad inicial, pero arquitectura más robusta.

- **No uso de router**
  - La navegación es binaria (login / app).
  - Trade-off: menos flexibilidad futura, pero evita sobrearquitectura.

- **Almacenamiento de rutas de imagen vs binarios**
  - Se guardan rutas absolutas en lugar de blobs.
  - Trade-off: dependiente del sistema de archivos local, pero más eficiente.

---

## Posibles mejoras futuras

- **Autenticación real**: sustituir las credenciales hardcodeadas por un sistema de usuarios con contraseñas hasheadas almacenadas en SQLite.
- **Creación y eliminación de nodos**: el flujo IPC está preparado para añadir `nodes:create` y `nodes:delete` sin cambios estructurales.
- **Edición de edges**: implementar `onConnect` en React Flow con persistencia en SQLite.
- **Empaquetado**: configurar `electron-builder` para generar instaladores para Windows, macOS y Linux.
- **Tests**: añadir tests de integración para los handlers IPC y tests unitarios para los repositorios.
- **Gestión de usuarios**: la sección "My Profile" está preparada visualmente para cuando el sistema de autenticación sea real.

---

## Notas finales

Este proyecto no pretende ser un producto completo, sino una demostración de arquitectura, toma de decisiones y resolución de problemas reales en un entorno Electron moderno.