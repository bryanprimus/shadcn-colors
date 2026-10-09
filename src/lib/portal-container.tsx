import * as React from "react"

/**
 * Base UI portals render into document.body by default, which escapes the
 * themed preview root. Preview roots provide their own portal container so
 * dialogs, menus, popovers and toasts inherit the generated theme variables.
 * Outside a preview (the editor shell) this resolves to undefined, which keeps
 * the default body container.
 */
const PortalContainerContext = React.createContext<HTMLElement | null>(null)

export function PortalContainerProvider({
  container,
  children,
}: {
  container: HTMLElement | null
  children: React.ReactNode
}) {
  return (
    <PortalContainerContext.Provider value={container}>
      {children}
    </PortalContainerContext.Provider>
  )
}

export function usePortalContainer(): HTMLElement | undefined {
  return React.useContext(PortalContainerContext) ?? undefined
}
