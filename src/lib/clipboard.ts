import { toast } from "sonner"

/** Copies text and reports the result through the editor's Sonner toaster. */
export async function copyText(text: string, message: string) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
    } else {
      const el = document.createElement("textarea")
      el.value = text
      el.setAttribute("readonly", "")
      el.style.position = "fixed"
      el.style.opacity = "0"
      document.body.appendChild(el)
      el.select()
      const ok = document.execCommand("copy")
      el.remove()
      if (!ok) throw new Error("copy command failed")
    }
    toast.success(message)
  } catch {
    toast.error("Copy failed", { description: "Your browser blocked clipboard access." })
  }
}
