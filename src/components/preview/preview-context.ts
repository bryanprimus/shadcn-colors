import * as React from "react"

import type { createToastManager } from "@/components/ui/toast"
import type { ThemeMode } from "@/theme/types"

export interface PreviewContextValue {
  mode: ThemeMode
  /** Toasts are scoped per preview pane so split view does not duplicate them. */
  toast: ReturnType<typeof createToastManager>
}

export const PreviewContext = React.createContext<PreviewContextValue | null>(null)

export function usePreview() {
  const ctx = React.useContext(PreviewContext)
  if (!ctx) throw new Error("usePreview must be used inside a PreviewRoot")
  return ctx
}
