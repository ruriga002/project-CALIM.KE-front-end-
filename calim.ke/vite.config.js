import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default ({ mode }) => {
  const env = loadEnv(mode, __dirname, '')
  const apiTarget = env.VITE_API_URL || 'http://127.0.0.1:5000'

  return defineConfig({
    root: __dirname,
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  })
}
