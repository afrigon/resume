
import eslint from "@eslint/js"
import { defineConfig } from "eslint/config"
import tseslint from "typescript-eslint"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hook"
import reactRefresh from "eslint-plugin-react-refresh"

export default defineConfig(
    eslint.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    reactHooks.configs.recommendedTypeChecked,
    {
        languageOptions: {
            ecmaVersion: 2022,
            globals: globals.browser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname
            }
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh
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