import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/**
 * Vite solo gestiona el renderer (React).
 * Main y preload los compila tsc -p tsconfig.node.json.
 *
 * Aliases:
 * - @  → src/renderer  (componentes, hooks, páginas)
 * - @shared → src/shared  (tipos e ipcChannels)
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/renderer'),
      '@shared': resolve(__dirname, 'src/shared'),
    },
  },
})