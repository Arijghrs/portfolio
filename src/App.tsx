import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import Lenis from 'lenis'
import { PROFILE as P, NAV, SKILL_GROUPS, EXPERIENCE, EDUCATION, PROJECTS } from './lib/data'

/* ═════════════════════════════ Helpers ═════════════════════════════ */

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis: Lenis | null = null
const go = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -20 })
  else el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' })
}

/** Only allow real web links (blocks javascript:, data:, etc.). Returns undefined if unsafe. */
const safeUrl = (u?: string) => {
  if (!u) return undefined
  try {
    const url = new URL(u)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : undefined
  } catch {
    return undefined
  }
}

/** Section order on the page and in the menu. Projects come before skills. */
const ORDER = ['about', 'work', 'skills', 'experience', 'contact']
const rank = (id: string) => (ORDER.indexOf(id) === -1 ? 99 : ORDER.indexOf(id))
const NAV_ITEMS = [...NAV].sort((a, b) => rank(a[0]) - rank(b[0]))

function Tag({ n, label }: { n: string; label: string }) {
  return <p className="tag rv">{n} — {label}</p>
}

/* ═════════════════════════════ Nav ═════════════════════════════ */

function Nav() {
  const [solid, setSolid] = useState(false)
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight)
      if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, scrollY / max)})`
      setSolid(scrollY > 40)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    addEventListener('scroll', onScroll, { passive: true })
    update()

    const io = new IntersectionObserver(
      es => es.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    NAV_ITEMS.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el) })

    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    addEventListener('keydown', esc)

    return () => {
      cancelAnimationFrame(frame)
      removeEventListener('scroll', onScroll)
      removeEventListener('keydown', esc)
      io.disconnect()
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) lenis?.stop()
    else lenis?.start()
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <div
        ref={bar}
        className="fixed top-0 left-0 z-50 h-[2px] w-full origin-left bg-[var(--ink)] will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />

      <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-[clamp(18px,4vw,64px)] py-4">
        <a
          href="#top"
          onClick={e => { e.preventDefault(); go('top') }}
          className="flex items-center gap-3"
          aria-label={`${P.name} — top`}
        >
          <span
            className={`grid place-items-center w-11 h-11 rounded-full text-sm font-semibold transition-all duration-500 hover:rotate-[360deg] ${
              solid ? 'bg-[var(--ink)] text-white' : 'shadow-[inset_0_0_0_1px_var(--ink)]'
            }`}
          >
            AG
          </span>
          <span className={`font-semibold transition-opacity ${solid ? 'opacity-0' : ''}`}>{P.name}</span>
        </a>

        <nav
          aria-label="Primary"
          className={`hidden md:flex gap-1 rounded-full p-1 ${
            solid ? 'bg-white/70 backdrop-blur-[12px] shadow-[inset_0_0_0_1px_var(--line)]' : ''
          }`}
        >
          {NAV_ITEMS.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={e => { e.preventDefault(); go(id) }}
              className={`rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                active === id ? 'bg-[var(--ink)] text-white' : ''
              }`}
            >
              {label}
            </a>
          ))}
        </nav>

        <button
          className="md:hidden pill pill-s bg-white/70 backdrop-blur"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          Menu
        </button>
      </header>

      <div
        className="fixed inset-0 z-50 bg-[var(--paper)] p-8 flex flex-col justify-center gap-4 transition-[clip-path] duration-700"
        style={{
          clipPath: open ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
          transitionTimingFunction: 'var(--ease)',
        }}
        aria-hidden={!open}
      >
        <button
          className="absolute top-5 right-5 pill pill-s"
          onClick={() => setOpen(false)}
          tabIndex={open ? 0 : -1}
        >
          Close
        </button>
        {NAV_ITEMS.map(([id, label], i) => (
          <a
            key={id}
            tabIndex={open ? 0 : -1}
            href={`#${id}`}
            className="h2 transition-all duration-700"
            style={{
              transitionDelay: `${i * 70}ms`,
              opacity: open ? 1 : 0,
              transform: open ? 'none' : 'translateY(30px)',
            }}
            onClick={e => { e.preventDefault(); setOpen(false); setTimeout(() => go(id), 50) }}
          >
            <span className="tag mr-3">0{i + 1}</span>
            {label}
          </a>
        ))}
      </div>
    </>
  )
}

/* ═════════════════════════════ Hero ═════════════════════════════ */

/* Make the character bigger / smaller */
const VIDEO_HEIGHT = 'min(112svh, 1400px)' // bigger number = bigger character
const VIDEO_TOP = '-6svh'                  // more negative = character moves up

/* When the intro ends, the page scrolls to "About" by itself. */
const AUTO_SCROLL = true        // false = no automatic scrolling
const AUTO_SCROLL_DELAY = 500   // ms to wait after the video ends

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const vid = useRef<HTMLVideoElement>(null)
  const [hint, setHint] = useState(false)

  useEffect(() => {
    const v = vid.current!
    let visible = true
    let started = false
    let timer = 0

    const unlockEvents = ['pointerdown', 'keydown', 'touchend']
    const cancelEvents = ['wheel', 'touchstart', 'keydown', 'pointerdown']
    const removeUnlock = () => unlockEvents.forEach(t => removeEventListener(t, unlock))
    const cancelScroll = () => clearTimeout(timer)

    // First click / tap / key press: start the intro from the beginning WITH sound.
    function unlock() {
      removeUnlock()
      setHint(false)
      started = true
      v.muted = false
      v.currentTime = 0
      if (visible) v.play().catch(() => {})
    }

    const start = async () => {
      try {
        v.muted = false
        await v.play() // works only if the browser allows sound autoplay
        started = true
      } catch {
        // Blocked: wait on the first frame so the sound is never missed
        v.pause()
        setHint(true)
        unlockEvents.forEach(t => addEventListener(t, unlock, { once: true }))
      }
    }
    start()

    // Pause when the hero is out of view. Never restart on scroll.
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.intersectionRatio >= 0.35
        if (!visible) v.pause()
        else if (started && !v.ended) v.play().catch(() => {})
      },
      { threshold: [0, 0.35, 1] }
    )
    io.observe(ref.current!)

    // When the intro finishes, glide down to About.
    const onEnded = () => {
      if (!AUTO_SCROLL) return
      timer = window.setTimeout(() => {
        if (scrollY < innerHeight * 0.4) go('about') // only if the visitor is still at the top
        cancelEvents.forEach(t => removeEventListener(t, cancelScroll))
      }, AUTO_SCROLL_DELAY)
      cancelEvents.forEach(t => addEventListener(t, cancelScroll, { passive: true }))
    }
    v.addEventListener('ended', onEnded)

    return () => {
      io.disconnect()
      removeUnlock()
      v.removeEventListener('ended', onEnded)
      cancelScroll()
      cancelEvents.forEach(t => removeEventListener(t, cancelScroll))
    }
  }, [])

  return (
    <section
      id="top"
      ref={ref}
      className="relative h-svh min-h-[640px] overflow-hidden"
      style={{ background: 'var(--paper)', isolation: 'isolate' }}
      aria-label="Introduction"
    >
      {/* Giant outlined first name behind the person */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-[18%] text-center font-bold uppercase leading-none tracking-[-0.05em] select-none text-transparent"
        style={{
          fontSize: 'clamp(120px,24vw,380px)',
          WebkitTextStroke: '1.5px rgba(15,26,46,.12)',
        }}
      >
        {P.first}
      </span>

      {/* The video's gray backdrop is lifted to white, then "multiplied" onto the page colour,
          so it disappears and only the character remains. */}
      <video
        ref={vid}
        playsInline
        preload="auto"
        aria-label="Video introduction by Arij Gharsalli"
        className="absolute z-10 left-1/2 -translate-x-1/2 max-w-none"
        style={{
          height: VIDEO_HEIGHT,
          top: VIDEO_TOP,
          mixBlendMode: 'multiply',
          filter: 'brightness(1.13) contrast(1.03)',
          WebkitMaskImage: 'radial-gradient(ellipse 50% 56% at 50% 45%, #000 60%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 50% 56% at 50% 45%, #000 60%, transparent 100%)',
        }}
      >
        <source src="/hero/hero1.webm" type="video/webm" />
        <source src="/hero/hero1.mp4" type="video/mp4" />
      </video>

      {/* Shown only when the browser blocks sound autoplay */}
      {hint && (
        <p
          aria-live="polite"
          className="absolute z-20 top-24 inset-x-0 mx-auto w-fit pointer-events-none pill pill-s bg-white/70 backdrop-blur !py-2 !px-4 text-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
          Click anywhere to start with sound
        </p>
      )}

      {/* Soft edge so the hero blends into the next section */}
      <div
        aria-hidden
        className="absolute z-10 inset-x-0 bottom-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--paper))' }}
      />

      <div className="absolute z-20 bottom-[8svh] left-0 right-0 px-[clamp(18px,4vw,64px)] flex flex-wrap items-end justify-between gap-6">
        <h1 className="h2">
          {P.role.split(' ')[0]} <em>{P.role.split(' ')[1]}.</em>
        </h1>

        <div className="flex flex-wrap gap-3 items-center">
          <a className="pill pill-p" href="#work" onClick={e => { e.preventDefault(); go('work') }}>
            Explore work
          </a>
          <a className="pill pill-s bg-white/60" href="#contact" onClick={e => { e.preventDefault(); go('contact') }}>
            Let’s talk
          </a>
          <a className="pill pill-s bg-white/60" href={P.resume} download>
            Résumé ↓
          </a>
        </div>
      </div>
    </section>
  )
}

/* ═════════════════════════════ About ═════════════════════════════ */

function About() {
  const [flip, setFlip] = useState(false)
  const flipKey = (e: ReactKeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlip(f => !f) }
  }

  const facts = [
    ['Location', P.location],
    ['Education', 'Computer Software Engineering — TEK-UP'],
    ['Latest role', 'AI Quality Analyst & RL'],
    ['Email', P.email],
  ]

  return (
    <section id="about" className="sec" aria-labelledby="about-h">
      <Tag n="01" label="About" />
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px_minmax(0,1fr)] items-start">
        <div className="rv">
          <h2 id="about-h" className="h2 mb-8">Hi, I'm {P.first}<em>.</em></h2>
          <p className="text-lg text-[var(--ink)]/80 leading-relaxed">{P.summary}</p>
          <p className="mt-4 text-[var(--mute)]">{P.languages}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="pill pill-p" href={P.resume} download>Résumé</a>
            <a className="pill pill-s" href={safeUrl(P.github)} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="pill pill-s" href={safeUrl(P.linkedin)} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>

        <div className="mx-auto w-[300px] rv" style={{ perspective: 1200 }}>
          <div className="mx-auto w-[30px] h-14 bg-[var(--ink)] rounded-sm" aria-hidden />
          <div className="sway">
            <div
              role="button"
              tabIndex={0}
              aria-label="ID card — flip"
              onClick={() => setFlip(f => !f)}
              onKeyDown={flipKey}
              onMouseEnter={() => matchMedia('(hover:hover)').matches && setFlip(true)}
              onMouseLeave={() => setFlip(false)}
              className="relative w-[300px] h-[404px] transition-transform duration-700"
              style={{
                transformStyle: 'preserve-3d',
                transform: flip ? 'rotateY(180deg)' : 'none',
                transitionTimingFunction: 'var(--ease)',
              }}
            >
              <div className="card absolute inset-0 overflow-hidden shadow-xl" style={{ backfaceVisibility: 'hidden' }}>
                <div className="bg-[var(--ink)] text-white text-center text-xs tracking-[.3em] py-3">DEVELOPER ID</div>
                <img
                  src="/portrait.png"
                  alt={`Portrait of ${P.name}`}
                  width={128}
                  height={156}
                  decoding="async"
                  className="mx-auto mt-5 w-32 h-[156px] object-cover rounded-2xl ring-4 ring-neutral-200"
                />
                <div className="text-center mt-4">
                  <p className="text-xl font-bold tracking-tight">{P.name}</p>
                  <p className="text-sm text-[var(--mute)]">{P.role}</p>
                </div>
                <dl className="mt-4 px-8 text-xs font-mono grid grid-cols-2 gap-y-1 text-[var(--mute)]">
                  <dt>Dept.</dt><dd className="text-right text-[var(--ink)]">Software Eng.</dd>
                  <dt>Valid till</dt><dd className="text-right text-[var(--ink)]">{P.validTill}</dd>
                </dl>
                <div
                  aria-hidden
                  className="absolute bottom-5 inset-x-8 h-8"
                  style={{ background: 'repeating-linear-gradient(90deg,#0d0d0d 0 2px,transparent 2px 5px,#0d0d0d 5px 6px,transparent 6px 10px)' }}
                />
              </div>

              <div
                className="card absolute inset-0 p-8 flex flex-col shadow-xl"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <p className="tag">What I am</p>
                <ul className="space-y-2 text-sm">
                  <li>registered as an Auto-Entrepreneur in Tunisia, which allows me to work on freelance projects and collaborate remotely with companies</li>
                </ul>
                <p className="mt-auto text-xs text-[var(--mute)]">If found, say hello · {P.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rv card p-8 self-center">
          <p className="tag">Quick facts</p>
          <dl className="divide-y divide-[var(--line)] text-sm">
            {facts.map(([k, v]) => (
              <div key={k} className="py-3 flex justify-between gap-4">
                <dt className="text-[var(--mute)]">{k}</dt>
                <dd className="text-right break-all">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 font-[Instrument_Serif,Georgia,serif] italic text-xl text-[var(--mute)]">
            Different challenges, different hats, same curiosity and determination to make things work.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ═════════════════════════════ Work ═════════════════════════════ */

type Category = 'frontend' | 'other'

type Project = {
  id: string
  category?: string // anything other than "frontend" (e.g. "backend") counts as "other"
  title: string
  kicker: string
  description: string
  features: string[]
  image?: string    // frontend: picture
  url?: string      // frontend: live site
  github?: string   // other: repository
  tools?: string[]  // frontend: tools used
}

const FILTERS: { id: 'all' | Category; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'other', label: 'Other' },
]

const categoryOf = (p: Project): Category =>
  p.category ? (p.category === 'frontend' ? 'frontend' : 'other') : p.github && !p.image ? 'other' : 'frontend'

const TECH_BY_ID = new Map<string, string[]>(EXPERIENCE.map(e => [e.id, e.tech] as [string, string[]]))

function FrontendCard({ p }: { p: Project }) {
  const tools = p.tools ?? []

  return (
    <a
      href={safeUrl(p.url)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${p.title} live demo`}
      className="card group flex h-full flex-col gap-3 p-3 overflow-hidden"
    >
      <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[var(--paper)]">
        <img
          src={p.image}
          alt={`${p.title} project preview`}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 px-2 pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="tag">{p.kicker}</p>
            <h3 className="mt-1 text-2xl font-bold tracking-tighter">{p.title}</h3>
            <p className="mt-2 text-sm text-[var(--ink)]/80">{p.description}</p>
          </div>
          <span
            aria-hidden
            className="text-xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          >
            ↗
          </span>
        </div>

        {tools.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-2" aria-label="Tools used">
            {tools.map(t => (
              <li key={t} className="rounded-full px-3 py-1 text-xs shadow-[inset_0_0_0_1px_var(--line)]">
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </a>
  )
}

/** One single row of frontend cards. Swipe, scroll sideways, or use the arrows. Add as many projects as you like. */
function FrontendCarousel({ items, label }: { items: Project[]; label?: string }) {
  const track = useRef<HTMLUListElement>(null)
  const [edge, setEdge] = useState({ start: true, end: false })

  const update = useCallback(() => {
    const el = track.current
    if (!el) return
    setEdge({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    })
  }, [])

  useEffect(() => {
    const el = track.current
    if (!el) return
    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [update, items.length])

  const slide = (dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector('li')?.getBoundingClientRect().width ?? 320
    el.scrollBy({ left: dir * (card + 16), behavior: reduced() ? 'auto' : 'smooth' })
  }

  /* Drag with the mouse: press, move left / right, release. (Touch screens already swipe natively.) */
  const drag = useRef({ down: false, moved: false, startX: 0, startLeft: 0 })

  const onPointerDown = (e: ReactPointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    const el = track.current!
    drag.current = { down: true, moved: false, startX: e.clientX, startLeft: el.scrollLeft }
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLUListElement>) => {
    const d = drag.current
    if (!d.down) return
    const el = track.current!
    const dx = e.clientX - d.startX
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true
      el.setPointerCapture(e.pointerId)
      el.style.scrollSnapType = 'none' // free movement while dragging
      el.style.cursor = 'grabbing'
    }
    if (d.moved) el.scrollLeft = d.startLeft - dx
  }

  const endDrag = (e: ReactPointerEvent<HTMLUListElement>) => {
    const d = drag.current
    if (!d.down) return
    const el = track.current!
    d.down = false
    if (d.moved) {
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
      el.style.scrollSnapType = '' // cards snap into place again
      el.style.cursor = ''
      setTimeout(() => { d.moved = false }, 0)
    }
  }

  // A drag must not open the project link underneath the cursor.
  const blockClickAfterDrag = (e: ReactMouseEvent) => {
    if (drag.current.moved) { e.preventDefault(); e.stopPropagation() }
  }

  const arrow = 'pill pill-s !p-0 h-11 w-11 justify-center text-lg disabled:opacity-30 disabled:pointer-events-none'

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold text-[var(--mute)]">{label ?? ''}</h3>
        <div className="flex gap-2">
          <button type="button" className={arrow} onClick={() => slide(-1)} disabled={edge.start} aria-label="Previous projects">
            ←
          </button>
          <button type="button" className={arrow} onClick={() => slide(1)} disabled={edge.end} aria-label="Next projects">
            →
          </button>
        </div>
      </div>

      <ul
        ref={track}
        tabIndex={0}
        aria-label="Frontend projects, drag or scroll sideways to see more"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={blockClickAfterDrag}
        onDragStart={e => e.preventDefault()}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 cursor-grab select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map(p => (
          <li key={p.id} className="snap-start shrink-0 w-[min(85vw,340px)]">
            <FrontendCard p={p} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function BackendAccordion({ items }: { items: Project[] }) {
  const [open, setOpen] = useState(0)

  return (
    <div className="flex flex-wrap items-stretch gap-3">
      {items.map((p, i) => {
        const o = open === i
        const number = String(i + 1).padStart(2, '0')
        const tech = TECH_BY_ID.get(p.id) ?? []
        const github = safeUrl(p.github)

        return (
          <article
            key={p.id}
            tabIndex={0}
            aria-expanded={o}
            onMouseEnter={() => setOpen(i)}
            onFocus={() => setOpen(i)}
            onClick={() => setOpen(i)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(i) }
            }}
            className="card overflow-hidden relative p-6 transition-[flex-basis,flex-grow] duration-700 min-h-[280px] cursor-pointer focus-visible:outline focus-visible:outline-2"
            style={{
              flex: o ? '2 1 560px' : '1 1 180px',
              maxWidth: '100%',
              transitionTimingFunction: 'var(--ease)',
            }}
          >
            {!o ? (
              <div className="h-full flex md:flex-col items-center justify-between gap-4">
                <span className="font-mono text-xs">{number}</span>
                <h3 className="font-semibold md:[writing-mode:vertical-rl] md:rotate-180">{p.title}</h3>
                <span aria-hidden className="text-2xl">+</span>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <p className="tag">{number} — {p.kicker}</p>
                <h3 className="text-4xl font-bold tracking-tighter">{p.title}</h3>
                <p className="mt-4 max-w-xl text-[var(--ink)]/80">{p.description}</p>

                <ul className="mt-5 grid sm:grid-cols-2 gap-2 text-sm max-w-xl">
                  {p.features.map(f => (
                    <li key={f} className="before:content-['—_'] before:text-[var(--mute)]">{f}</li>
                  ))}
                </ul>

                <div className="mt-auto pt-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {tech.slice(0, 6).map(t => (
                      <span key={t} className="rounded-full px-3 py-1 text-xs shadow-[inset_0_0_0_1px_var(--line)]">{t}</span>
                    ))}
                  </div>

                  {github && (
                    <a
                      href={github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      aria-label={`View ${p.title} on GitHub`}
                      className="group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-[inset_0_0_0_1px_var(--line)] hover:bg-[var(--paper)] transition-colors"
                    >
                      View on GitHub
                      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                        ↗
                      </span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}

function Work() {
  const [filter, setFilter] = useState<'all' | Category>('all')

  const projects: Project[] = PROJECTS
  const frontend = useMemo(() => projects.filter(p => categoryOf(p) === 'frontend'), [projects])
  const other = useMemo(() => projects.filter(p => categoryOf(p) === 'other'), [projects])

  const showFront = filter === 'all' || filter === 'frontend'
  const showOther = filter === 'all' || filter === 'other'

  return (
    <section id="work" className="sec" aria-labelledby="wk-h">
      <Tag n="02" label="Selected work" />
      <h2 id="wk-h" className="h2 rv mb-6">
        Things I’ve <em>built.</em>
      </h2>

      <div role="group" aria-label="Filter projects" className="mb-10 flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`pill !py-2 !px-4 text-sm ${filter === f.id ? 'pill-p' : 'pill-s'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {showFront && frontend.length > 0 && (
        <div className="mb-16">
          <FrontendCarousel items={frontend} label="Frontend projects" />
        </div>
      )}

      {showOther && other.length > 0 && (
        <div>
          {filter === 'all' && <h3 className="mb-5 text-sm font-semibold text-[var(--mute)]">Other projects</h3>}
          <BackendAccordion items={other} />
        </div>
      )}
    </section>
  )
}

/* ═════════════════════════════ Skills ═════════════════════════════ */

function Skills() {
  const all = useMemo(() => SKILL_GROUPS.flatMap(g => g.items.map(n => ({ n, f: g.family }))), [])

  const placesByTech = useMemo(() => {
    const map = new Map<string, string[]>()
    for (const e of EXPERIENCE) {
      const place = e.place.split(' · ')[0].replace('Freelance, full time', 'Freelance')
      for (const t of e.tech) map.set(t, [...(map.get(t) ?? []), place])
    }
    return map
  }, [])

  const [fam, setFam] = useState('All')
  const [sel, setSel] = useState(all[0])
  const places = placesByTech.get(sel.n) ?? []

  return (
    <section id="skills" className="sec" aria-labelledby="sk-h">
      <Tag n="03" label="Skills" />
      <h2 id="sk-h" className="h2 rv mb-10">The periodic table <em>of my stack.</em></h2>

      <div className="flex flex-wrap gap-2 mb-8 rv" role="group" aria-label="Filter by family">
        {['All', ...SKILL_GROUPS.map(g => g.family)].map(f => (
          <button
            key={f}
            aria-pressed={fam === f}
            onClick={() => setFam(f)}
            className={`pill !py-2 !px-4 text-sm ${fam === f ? 'pill-p' : 'pill-s'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="grid grid-cols-4 md:grid-cols-8 gap-2 list-none">
          {all.map((s, i) => (
            <li key={s.n} className="rv" style={{ '--i': ((i % 8) + Math.floor(i / 8)) * 0.67 } as CSSProperties}>
              <button
                onMouseEnter={() => setSel(s)}
                onFocus={() => setSel(s)}
                onClick={() => setSel(s)}
                className={`card w-full aspect-square p-2 text-left flex flex-col justify-between transition-all duration-500 ${
                  fam !== 'All' && fam !== s.f ? 'opacity-25' : ''
                } ${sel.n === s.n ? 'bg-[var(--ink)] !text-white' : ''}`}
                aria-label={`${s.n}, ${s.f}`}
              >
                <span className="font-mono text-[10px] opacity-60">{i + 1}</span>
                <span className="text-xl md:text-2xl font-bold tracking-tight">{s.n.slice(0, 2)}</span>
                <span className="text-[9px] leading-tight truncate">{s.n}</span>
              </button>
            </li>
          ))}
        </ul>

        <aside className="card p-8 lg:sticky lg:top-24 self-start" aria-live="polite">
          <p className="tag">{sel.f}</p>
          <p className="text-6xl font-bold tracking-tighter">{sel.n.slice(0, 2)}</p>
          <h3 className="text-2xl font-semibold mt-2">{sel.n}</h3>
          <p className="text-sm text-[var(--mute)] mt-4">
            {places.length ? `Used at: ${places.join(', ')}` : 'Listed in technical skills.'}
          </p>
        </aside>
      </div>
    </section>
  )
}

/* ═════════════════════════════ Experience ═════════════════════════════ */

type TimelineItem = { y: string; t: string; pl: string; d?: string }
type ExperienceEntry = (typeof EXPERIENCE)[number]

function Timeline({ items, next = false }: { items: TimelineItem[]; next?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const line = useRef<HTMLDivElement>(null)
  const [lit, setLit] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const r = ref.current!.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height))
      if (line.current) line.current.style.transform = `scaleY(${p})`
      let count = 0
      items.forEach((_, i) => { if (p >= (i + 0.3) / items.length) count = i + 1 })
      setLit(count)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener('scroll', onScroll)
    }
  }, [items])

  return (
    <div ref={ref} className="relative pl-10 md:pl-16">
      <div className="absolute left-3 md:left-5 top-0 bottom-0 w-px bg-[var(--line)]" />
      <div
        ref={line}
        className="absolute left-3 md:left-5 top-0 bottom-0 w-px bg-[var(--ink)] origin-top will-change-transform"
        style={{ transform: 'scaleY(0)' }}
      />

      {items.map((it, i) => {
        const on = i < lit
        return (
          <div key={`${it.t}-${it.y}`} className={`relative pb-14 transition-opacity duration-700 ${on ? 'opacity-100' : 'opacity-35'}`}>
            <span
              className={`absolute -left-[34px] md:-left-[46px] top-2 w-3 h-3 rounded-full transition-colors ${
                on ? 'bg-[var(--ink)]' : 'bg-[var(--line)]'
              }`}
            />
            <p className="tag">{it.y}</p>
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">{it.t}</h3>
            <p className="text-[var(--mute)]">{it.pl}</p>
            {it.d && <p className="mt-2 max-w-2xl">{it.d}</p>}
          </div>
        )
      })}

      {next && (
        <div className="relative pb-14 opacity-35">
          <p className="tag">Next</p>
          <p className="text-2xl font-semibold">Your company, my next adventure.</p>
        </div>
      )}
    </div>
  )
}

/** Internship = description mentions "internship" / "final-year project". Add `type: 'internship' | 'professional'` to an entry to override. */
const kindOf = (e: ExperienceEntry): 'professional' | 'internship' => {
  const t = (e as { type?: string }).type
  if (t === 'professional' || t === 'internship') return t
  const s = `${e.id} ${e.title} ${e.place} ${e.points.join(' ')}`.toLowerCase()
  return /internship|final-year project/.test(s) ? 'internship' : 'professional'
}

const toItem = (e: ExperienceEntry): TimelineItem => ({ y: e.year, t: e.title, pl: e.place, d: e.points[0] })

function Experience() {
  const groups = useMemo(() => {
    const professional = EXPERIENCE.filter(e => kindOf(e) === 'professional').map(toItem)
    const internships = EXPERIENCE.filter(e => kindOf(e) === 'internship').map(toItem)
    const studies: TimelineItem[] = EDUCATION.map(e => ({ y: e.year, t: e.title, pl: e.place }))
    return [
      { id: 'pro', label: 'Professional experience', items: professional, next: true },
      { id: 'int', label: 'Internships', items: internships, next: false },
      { id: 'edu', label: 'Studies', items: studies, next: false },
    ].filter(g => g.items.length > 0)
  }, [])

  return (
    <section id="experience" className="sec" aria-labelledby="ex-h">
      <Tag n="04" label="Experience & education" />
      <h2 id="ex-h" className="h2 rv mb-16">
        The path <em>so far.</em>
      </h2>

      <div className="space-y-20">
        {groups.map(g => (
          <div key={g.id} aria-labelledby={`ex-${g.id}`}>
            <h3 id={`ex-${g.id}`} className="mb-8 pl-10 md:pl-16 text-sm font-semibold text-[var(--mute)]">
              {g.label}
            </h3>
            <Timeline items={g.items} next={g.next} />
          </div>
        ))}
      </div>
    </section>
  )
}

/* ═════════════════════════════ Contact ═════════════════════════════ */

const FAQ = [
  {
    q: 'Why did I choose to work in different roles?',
    a: 'I believe every opportunity is a chance to grow, contribute, and make an impact. I m always open to new challenges, exploring different fields, and putting my skills into practice. For me, growth comes from staying curious, embracing challenges, and never stopping learning.',
  },
  {
    q: 'What is my current status?',
    a: 'I hold an Auto-Entrepreneur license (patente auto-entrepreneur) in Tunisia, so I can take on freelance work and collaborate remotely with companies.',
  },
  {
    q: 'What else do I work on?',
    a: 'Alongside my main roles, I also build web projects and do digital marketing.',
  },
  {
    q: 'What type of contract am I looking for?',
    a: 'I’m open to a CIVP, a CDI or a CDD.',
  },
  {
    q: 'What is my ideal job?',
    a: 'A job where I can be creative. I’m looking for a place where I can come up with ideas and build things, not just follow a checklist.',
  },
]

function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="mt-24" aria-labelledby="faq-h">
      <p className="tag">Good to know</p>
      <h3 id="faq-h" className="h2 !text-[clamp(32px,4vw,56px)] mb-8">
        Questions <em>&amp; answers.</em>
      </h3>

      <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
        {FAQ.map((item, i) => {
          const o = open === i
          return (
            <div key={item.q}>
              <h4>
                <button
                  type="button"
                  aria-expanded={o}
                  aria-controls={`faq-${i}`}
                  id={`faq-btn-${i}`}
                  onClick={() => setOpen(o ? null : i)}
                  className="w-full flex items-center justify-between gap-6 py-5 text-left text-lg md:text-xl font-semibold tracking-tight focus-visible:outline focus-visible:outline-2"
                >
                  <span>{item.q}</span>
                  <span aria-hidden className="text-2xl transition-transform duration-500" style={{ transform: o ? 'rotate(45deg)' : 'none' }}>
                    +
                  </span>
                </button>
              </h4>

              <div
                id={`faq-${i}`}
                role="region"
                aria-labelledby={`faq-btn-${i}`}
                className="grid transition-[grid-template-rows] duration-500"
                style={{ gridTemplateRows: o ? '1fr' : '0fr', transitionTimingFunction: 'var(--ease)' }}
              >
                <div className="overflow-hidden">
                  <p className="pb-6 max-w-2xl text-[var(--ink)]/80 leading-relaxed">{item.a}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* Messages reach your Gmail through Web3Forms (free, no backend).
   1. Get a free Access Key at https://web3forms.com (enter your Gmail address).
   2. Create a file named `.env` next to package.json containing:
        VITE_WEB3FORMS_KEY=your-access-key
   3. Restart the dev server, and add the same variable in your hosting dashboard (Vercel / Netlify).
   Note: the key is not a secret (it can only send mail to your inbox), but this keeps it out of your code. */
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined

const LIMITS = { name: 80, email: 120, message: 2000, minMessage: 10 }
const COOLDOWN_MS = 30_000

type Status = { kind: 'idle' | 'sending' | 'sent' | 'error'; text?: string }

function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [len, setLen] = useState(0)
  const lastSent = useRef(0)

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status.kind === 'sending') return

    const form = e.currentTarget
    const fd = new FormData(form)

    // Spam bots fill the hidden field: pretend success and send nothing.
    if (fd.get('botcheck')) {
      setStatus({ kind: 'sent', text: 'Message sent!' })
      return
    }

    const name = String(fd.get('name') ?? '').trim().slice(0, LIMITS.name)
    const email = String(fd.get('email') ?? '').trim().slice(0, LIMITS.email)
    const message = String(fd.get('message') ?? '').trim().slice(0, LIMITS.message)

    if (!name || !email) return setStatus({ kind: 'error', text: 'Please enter your name and email.' })
    if (message.length < LIMITS.minMessage)
      return setStatus({ kind: 'error', text: `Please write a message of at least ${LIMITS.minMessage} characters.` })
    if (!WEB3FORMS_KEY)
      return setStatus({ kind: 'error', text: 'The contact form is not set up yet. Please try again later.' })
    if (Date.now() - lastSent.current < COOLDOWN_MS)
      return setStatus({ kind: 'error', text: 'Please wait a few seconds before sending another message.' })

    setStatus({ kind: 'sending' })
    const ctrl = new AbortController()
    const timeout = setTimeout(() => ctrl.abort(), 12_000)

    try {
      const body = new FormData()
      body.append('access_key', WEB3FORMS_KEY)
      body.append('subject', `New message from your portfolio — ${name}`)
      body.append('from_name', 'Portfolio contact form')
      body.append('name', name)
      body.append('email', email)
      body.append('message', message)

      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body, signal: ctrl.signal })
      const json = await res.json()

      if (json.success) {
        lastSent.current = Date.now()
        form.reset()
        setLen(0)
        setStatus({ kind: 'sent', text: 'Message sent! Thank you, I’ll reply to you by email.' })
      } else {
        setStatus({ kind: 'error', text: 'Your message could not be sent. Please try again in a moment.' })
      }
    } catch {
      setStatus({ kind: 'error', text: 'Connection problem. Please check your internet and try again.' })
    } finally {
      clearTimeout(timeout)
    }
  }

  const field =
    'mt-2 w-full rounded-2xl bg-white/60 px-4 py-3 shadow-[inset_0_0_0_1px_var(--line)] placeholder:text-[var(--mute)]/70 ' +
    'focus:outline-none focus:bg-white focus:shadow-[inset_0_0_0_2px_var(--accent)] transition-shadow'

  return (
    <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-start">
      <div>
        <p className="tag">Write to me</p>
        <h3 id="form-h" className="h2 !text-[clamp(32px,4vw,56px)] mb-4">
          Send me <em>a message.</em>
        </h3>
        <p className="max-w-md text-[var(--ink)]/80 leading-relaxed">
          Have a project, an opportunity or just a question? Fill in the form and your message will land straight in my
          inbox. I’ll reply to the email address you enter.
        </p>
      </div>

      <form onSubmit={submit} aria-labelledby="form-h" className="card p-6 md:p-10">
        {/* Honeypot: hidden from people, catches spam bots */}
        <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="cf-name" className="text-sm font-medium">Your name</label>
            <input id="cf-name" name="name" required maxLength={LIMITS.name} autoComplete="name" placeholder="Jane Doe" className={field} />
          </div>
          <div>
            <label htmlFor="cf-email" className="text-sm font-medium">Your email</label>
            <input id="cf-email" name="email" type="email" required maxLength={LIMITS.email} autoComplete="email" placeholder="jane@company.com" className={field} />
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-baseline justify-between">
            <label htmlFor="cf-message" className="text-sm font-medium">Your message</label>
            <span className="text-xs text-[var(--mute)]" aria-hidden>{len}/{LIMITS.message}</span>
          </div>
          <textarea
            id="cf-message"
            name="message"
            required
            rows={6}
            maxLength={LIMITS.message}
            placeholder="Tell me about your project or opportunity…"
            onChange={e => setLen(e.target.value.length)}
            className={`${field} resize-y`}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button type="submit" disabled={status.kind === 'sending'} className="pill pill-p disabled:opacity-60">
            {status.kind === 'sending' ? 'Sending…' : 'Send message →'}
          </button>
          <p className="text-xs text-[var(--mute)]">All fields are required.</p>
        </div>

        <div aria-live="polite" className="mt-5">
          {status.kind === 'sent' && (
            <p role="status" className="rounded-2xl px-4 py-3 text-sm font-medium bg-emerald-50 text-emerald-900 shadow-[inset_0_0_0_1px_rgba(16,120,80,.25)]">
              ✓ {status.text}
            </p>
          )}
          {status.kind === 'error' && (
            <p role="alert" className="rounded-2xl px-4 py-3 text-sm font-medium bg-red-50 text-red-900 shadow-[inset_0_0_0_1px_rgba(180,35,28,.25)]">
              ✕ {status.text}
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

function Contact() {
  const hop = (t: string) =>
    t.split('').map((c, i) => (
      <span key={i} className="inline-block transition-transform duration-300 hover:-translate-y-3 whitespace-pre">
        {c}
      </span>
    ))

  return (
    <section id="contact" className="sec" aria-labelledby="ct-h">
      <Tag n="05" label="Contact" />
      <h2 id="ct-h" className="h2 !text-[clamp(44px,9vw,140px)]">
        <span aria-label="Let’s build something together.">
          {hop('Let’s build')}
          <br />
          {hop('something together.')}
        </span>
      </h2>

      <ContactForm />
      <Faq />

      <footer className="mt-32 flex flex-wrap justify-between gap-4 text-sm text-[var(--mute)] border-t border-[var(--line)] pt-6">
        <p>© {new Date().getFullYear()} {P.name}</p>
        <a href="#top" onClick={e => { e.preventDefault(); go('top') }}>Back to top ↑</a>
        <p>Built with React</p>
      </footer>
    </section>
  )
}

/* ═════════════════════════════ App ═════════════════════════════ */

export default function App() {
  useEffect(() => {
    // Smooth scrolling (skipped when the visitor prefers reduced motion)
    let raf = 0
    let instance: Lenis | null = null
    if (!reduced()) {
      instance = new Lenis({ lerp: 0.1 })
      lenis = instance
      const loop = (t: number) => {
        instance!.raf(t)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    }

    // Reveal-on-scroll
    const io = new IntersectionObserver(
      es => es.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in')
          io.unobserve(e.target)
        }
      }),
      { threshold: 0.12 }
    )
    const t = setTimeout(() => document.querySelectorAll('.rv').forEach(el => io.observe(el)), 0)

    return () => {
      clearTimeout(t)
      io.disconnect()
      cancelAnimationFrame(raf)
      instance?.destroy()
      lenis = null
    }
  }, [])

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Work />
        <Skills />
        <Experience />
        <Contact />
      </main>
    </>
  )
}