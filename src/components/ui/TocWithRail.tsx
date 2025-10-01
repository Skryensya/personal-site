import React, { useEffect, useMemo, useRef, useState } from "react";

export type TocItem = {
  id: string
  title: string
  depth?: number
}

const RAIL_TOKENS = {
  railWidth: 12,
  xTop: 1,
  xChild: 11,
  strokeWidth: 1,
}

const ACTIVE_OBS_ROOT_MARGIN = "-20% 0px -60% 0px"

// Provide default items for demo
const defaultItems: TocItem[] = [
  { id: "intro", title: "The React hooks you actually need", depth: 0 },
  { id: "first-5-min", title: "Your first 5 minutes with shadcn hooks", depth: 0 },
  { id: "pick", title: "Pick the hook you need", depth: 1 },
  { id: "import", title: "Import and use it", depth: 1 },
  { id: "make", title: "Make it yours", depth: 1 },
  { id: "ship", title: "Ship it", depth: 1 },
  { id: "why", title: "Why this approach actually works", depth: 0 },
  { id: "diff", title: "What makes these hooks different", depth: 0 },
  { id: "philo", title: "The philosophy behind owning your hooks", depth: 0 },
  { id: "revolution", title: "The hooks that started a revolution", depth: 0 },
  { id: "when", title: "When you need them (and when you don't)", depth: 0 },
  { id: "cats", title: "Categories that matter", depth: 0 },
  { id: "questions", title: "Questions you might have", depth: 0 },
]

export function TocWithRail({
  items = defaultItems,
  className,
  title = "On this page",
}: {
  items?: TocItem[]
  className?: string
  title?: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const anchorsRef = useRef<Record<string, HTMLAnchorElement | null>>({})
  const [activeId, setActiveId] = useState<string | null>(null)

  const [positions, setPositions] = useState<
    Array<{ id: string; top: number; height: number; depth: number }>
  >([])

  const recompute = () => {
    const el = scrollRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const list = items.map((it) => {
      const a = anchorsRef.current[it.id]
      if (!a) return { id: it.id, top: 0, height: 0, depth: it.depth ?? 0 }
      const aRect = a.getBoundingClientRect()
      const top = aRect.top - rect.top + el.scrollTop
      return {
        id: it.id,
        top,
        height: aRect.height,
        depth: Math.max(0, Math.min(1, it.depth ?? 0)),
      }
    })
    setPositions(list)
  }

  useEffect(() => {
    recompute()
    const ro = new ResizeObserver(() => recompute())
    if (scrollRef.current) ro.observe(scrollRef.current)
    window.addEventListener("resize", recompute)
    const t = setTimeout(recompute, 0)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", recompute)
      clearTimeout(t)
    }
  }, [items])

  const railSvg = useMemo(() => {
    const { railWidth, xTop, xChild } = RAIL_TOKENS
    if (!positions.length) return { w: railWidth, h: 0, d: "" }
    const h = positions.at(-1)!.top + positions.at(-1)!.height

    const yMid = (p: { top: number; height: number }) => p.top + p.height / 2

    const pts = positions.map((p) => ({
      y1: p.top,
      y2: p.top + p.height,
      yMid: yMid(p),
      x: p.depth === 0 ? xTop : xChild,
      depth: p.depth,
      id: p.id,
    }))

    let d = ""
    if (pts.length) {
      d += `M ${pts[0].x} ${Math.max(0, pts[0].y1)}`
      d += ` L ${pts[0].x} ${pts[0].y2}`
      for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1]
        const curr = pts[i]
        d += ` L ${prev.x} ${curr.y1}`
        if (prev.x !== curr.x) {
          d += ` L ${curr.x} ${curr.y1}`
        }
        d += ` L ${curr.x} ${curr.y2}`
      }
    }

    return { w: railWidth, h: Math.max(0, Math.ceil(h)), d }
  }, [positions])

  useEffect(() => {
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter(Boolean) as HTMLElement[]
    if (!headings.length) return

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) {
          setActiveId(visible[0].target.id)
        } else {
          const above = entries
            .slice()
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
            .filter((e) => e.boundingClientRect.top < 0)
            .at(-1)
          if (above) setActiveId(above.target.id)
        }
      },
      { root: null, rootMargin: ACTIVE_OBS_ROOT_MARGIN, threshold: [0, 0.1, 0.5, 1] }
    )

    headings.forEach((h) => obs.observe(h))
    return () => obs.disconnect()
  }, [items])

  const highlight = useMemo(() => {
    const p = positions.find((p) => p.id === activeId)
    if (!p) return { top: 0, height: 0 }
    return { top: p.top, height: p.height }
  }, [positions, activeId])

  useEffect(() => {
    const sc = scrollRef.current
    if (!sc) return
    const a = anchorsRef.current[activeId ?? ""]
    if (!a) return
    const aTop = a.offsetTop
    const aBottom = aTop + a.offsetHeight
    if (aTop < sc.scrollTop + 24) sc.scrollTo({ top: aTop - 24, behavior: "smooth" })
    else if (aBottom > sc.scrollTop + sc.clientHeight - 24)
      sc.scrollTo({ top: aBottom - sc.clientHeight + 24, behavior: "smooth" })
  }, [activeId])

  return (
    <aside
      className={["sticky pb-2 pt-12 max-xl:hidden", className ?? ""].join(" ")}
      style={{
        top: "calc(var(--fd-banner-height,0px) + var(--fd-nav-height,0px))",
        height: "calc(100dvh - var(--fd-banner-height,0px) - var(--fd-nav-height,0px))",
      }}
    >
      <div className="flex h-full w-[var(--fd-toc-width,16rem)] max-w-full flex-col pe-4">
        <h3 className="inline-flex items-center gap-1.5 text-sm text-neutral-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <path d="M15 18H3" />
            <path d="M17 6H3" />
            <path d="M21 12H3" />
          </svg>
          {title}
        </h3>

        <div
          ref={scrollRef}
          className="relative min-h-0 text-sm ms-px overflow-auto [scrollbar-width:none] [mask-image:linear-gradient(to_bottom,transparent,white_16px,white_calc(100%-16px),transparent)] py-3"
        >
          <div
            className="absolute start-0 top-0 rtl:-scale-x-100"
            style={{ width: RAIL_TOKENS.railWidth, height: railSvg.h }}
          >
            <svg
              width={RAIL_TOKENS.railWidth}
              height={railSvg.h}
              viewBox={`0 0 ${RAIL_TOKENS.railWidth} ${railSvg.h || 1}`}
              className="absolute inset-0"
            >
              <path
                d={railSvg.d}
                stroke="currentColor"
                strokeWidth={RAIL_TOKENS.strokeWidth}
                fill="none"
                className="text-neutral-300"
              />
            </svg>
            <div
              role="none"
              className="absolute bg-blue-600/80 transition-all"
              style={{
                left: 0,
                width: RAIL_TOKENS.railWidth,
                top: highlight.top,
                height: highlight.height,
                maskImage:
                  "linear-gradient(to bottom, transparent 2px, black 2px, black calc(100% - 2px), transparent calc(100% - 2px))",
              }}
            />
          </div>

          <nav className="flex flex-col">
            {items.map((it) => (
              <a
                key={it.id}
                href={`#${it.id}`}
                ref={(el) => (anchorsRef.current[it.id] = el)}
                data-active={activeId === it.id}
                className={[
                  "relative py-1.5 text-sm transition-colors [overflow-wrap:anywhere] first:pt-0 last:pb-0",
                  activeId === it.id
                    ? "text-blue-600"
                    : "text-neutral-500 hover:text-neutral-800",
                ].join(" ")}
                style={{ paddingInlineStart: (it.depth ?? 0) > 0 ? 26 : 14 }}
              >
                <div
                  className="absolute inset-y-0 w-px bg-neutral-300"
                  style={{
                    insetInlineStart: (it.depth ?? 0) > 0 ? 10 : 0,
                    top: (it.depth ?? 0) > 0 ? 6 : 0,
                    bottom: (it.depth ?? 0) > 0 ? 6 : 0,
                  }}
                />

                {it.depth === 1 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    className="absolute -top-1.5 start-0 size-4 rtl:-scale-x-100"
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="10"
                      y2="12"
                      className="stroke-neutral-300"
                      strokeWidth="1"
                    />
                  </svg>
                )}

                {it.title}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  )
}

export default TocWithRail;
