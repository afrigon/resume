import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig(() => {
    return {
        build: {
            outDir: "dist"
        },
        plugins: [
            react(),
            tailwindcss()
        ]
    }
})