import "@fontsource-variable/inter"
import "./index.css"

import { createRoot } from "react-dom/client"

import App from "./components/App"

const container = document.getElementById("root")

if (!container) {
    throw new Error("Could not find an element with root id")
}

const root = createRoot(container)
root.render(<App />)
