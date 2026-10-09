import * as React from "react"
import { cn } from "@/lib/utils"

import { Toaster, createToastManager } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { PortalContainerProvider } from "@/lib/portal-container"
import { toCssVariables } from "@/theme/serialize"
import type { GeneratedTheme, ThemeMode } from "@/theme/types"

import { PreviewContext } from "./preview-context"

/**
 * A themed island. Generated variables are applied as inline custom properties
 * on this element only, so the editor shell around it never changes. Portaled
 * content (dialogs, menus, toasts) renders into a container inside this root
 * and therefore inherits the same variables and the same light/dark class.
 */
export function PreviewRoot({
  theme,
  mode,
  className,
  children,
}: {
  theme: GeneratedTheme
  mode: ThemeMode
  className?: string
  children: React.ReactNode
}) {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null)
  const [toast] = React.useState(() => createToastManager())
  const style = React.useMemo(
    () => ({ ...toCssVariables(theme[mode], theme.radius), colorScheme: mode }) as React.CSSProperties,
    [theme, mode]
  )
  const ctx = React.useMemo(() => ({ mode, toast }), [mode, toast])

  return (
    <div data-preview-root={mode} className={cn(mode, className)} style={style}>
      <PortalContainerProvider container={container}>
        <PreviewContext.Provider value={ctx}>
          <TooltipProvider delay={300}>{children}</TooltipProvider>
          {container && <Toaster toastManager={toast} />}
        </PreviewContext.Provider>
      </PortalContainerProvider>
      <div ref={setContainer} data-slot="preview-portal-container" className="relative z-50" />
    </div>
  )
}
