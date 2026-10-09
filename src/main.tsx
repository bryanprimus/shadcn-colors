import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeLabProvider } from "@/state/theme-lab"
import { installScrollContainment } from "@/lib/contain-scroll"

installScrollContainment()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeLabProvider>
      <TooltipProvider delay={400}>
        <App />
      </TooltipProvider>
    </ThemeLabProvider>
  </StrictMode>
)
