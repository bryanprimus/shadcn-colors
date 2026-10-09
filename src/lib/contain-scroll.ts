/**
 * cmdk keeps its selected item visible with `scrollIntoView({ block: "nearest" })`,
 * which scrolls every scrollable ancestor. Inside the preview canvas that yanks
 * the whole gallery to the command palette demo on mount. Elements inside a
 * `[data-scroll-contain]` boundary instead only scroll ancestors up to and
 * including that boundary. Everything else keeps native behavior.
 */
export function installScrollContainment() {
  const proto = Element.prototype as Element & { __scrollContained?: boolean }
  if (proto.__scrollContained) return
  proto.__scrollContained = true
  const native = proto.scrollIntoView
  proto.scrollIntoView = function (this: Element, arg?: boolean | ScrollIntoViewOptions) {
    const boundary = this.closest("[data-scroll-contain]")
    if (!boundary) return native.call(this, arg)
    let el = this.parentElement
    while (el) {
      const style = getComputedStyle(el)
      if (el.scrollHeight > el.clientHeight && /(auto|scroll)/.test(style.overflowY)) {
        const item = this.getBoundingClientRect()
        const box = el.getBoundingClientRect()
        if (item.top < box.top) el.scrollTop -= box.top - item.top
        else if (item.bottom > box.bottom) el.scrollTop += item.bottom - box.bottom
      }
      if (el === boundary) break
      el = el.parentElement
    }
  }
}
