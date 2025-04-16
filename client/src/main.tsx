import { createRoot } from "react-dom/client"
import { ThemeProvider } from "./context/ThemeContext"
import App from "./App"
import "./styles/main.scss"
import "./styles/theme.scss"

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
)
