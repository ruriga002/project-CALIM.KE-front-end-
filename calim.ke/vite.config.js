import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const cwd = typeof globalThis.process !== 'undefined' && typeof globalThis.process.cwd === 'function'
  ? globalThis.process.cwd()
  : ''

export default ({ mode }) => {
  const env = loadEnv(mode, cwd, '')
  const apiTarget = env.VITE_API_URL || 'http://127.0.0.1:5000'

  return defineConfig({
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
