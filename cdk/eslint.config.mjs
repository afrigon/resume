import eslint from "@eslint/js"
import { defineConfig } from "eslint/config"
import tseslint from "typescript-eslint"

export default defineConfig(
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname
            }
        }
    },
    {
        rules: {
            indent: ["error", 4],
            semi: ["error", "never"],
            quotes: ["error", "double"],
            "comma-dangle": ["error", "never"]
        }
    }
)