import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// `base` is the public path the app is served from. For GitHub Pages it's
// `/<repo>/`. CI sets VITE_BASE_PATH; locally it falls back to `/`.
const base = process.env.VITE_BASE_PATH ?? "/"

export default defineConfig({
  base,
  plugins: [react()],
})
