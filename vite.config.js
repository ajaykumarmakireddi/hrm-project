import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import jsconfigpaths from "vite-jsconfig-paths";
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), jsconfigpaths(), tailwindcss(),],

  server:{
    host:"0.0.0.0",
    port:5174,
    allowedHosts: ["mdms-frontend-ajay.kernn.xyz"]
  }
})
