import { type Config } from "prettier"

const config: Config = {
    experimentalTernaries: false,
    experimentalOperatorPosition: "start",
    printWidth: 120,
    tabWidth: 4,
    useTabs: false,
    semi: false,
    singleQuote: false,
    quoteProps: "consistent",
    jsxSingleQuote: false,
    trailingComma: "none",
    bracketSpacing: true,
    objectWrap: "preserve",
    bracketSameLine: false,
    arrowParens: "avoid",
    endOfLine: "lf"
}

export default config
