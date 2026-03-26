import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useToolPrefs } from '../../hooks/useToolPrefs'

export const TOOLS = [
  {
    path: 'json',     label: 'JSON',      icon: '{}', desc: 'Formatter & Validator',
    color: '#F59E0B', rgb: '245,158,11',
    gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)',
    bg: 'radial-gradient(ellipse 60% 40% at 80% 20%, rgba(245,158,11,0.12), transparent)',
  },
  {
    path: 'color',    label: 'Color',     icon: '◉',  desc: 'Picker & Converter',
    color: '#EC4899', rgb: '236,72,153',
    gradient: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
    bg: 'radial-gradient(ellipse 60% 40% at 80% 20%, rgba(236,72,153,0.12), transparent)',
  },
  {
    path: 'regex',    label: 'Regex',     icon: '.*', desc: 'Live Tester',
    color: '#8B5CF6', rgb: '139,92,246',
    gradient: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
    bg: 'radial-gradient(ellipse 60% 40% at 80% 20%, rgba(139,92,246,0.12), transparent)',
  },
  {
    path: 'counter',  label: 'Counter',   icon: '¶',  desc: 'Word & Char Stats',
    color: '#3B82F6', rgb: '59,130,246',
    gradient: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
    bg: 'radial-gradient(ellipse 60% 40% at 80% 20%, rgba(59,130,246,0.12), transparent)',
  },
  {
    path: 'base64',   label: 'Base64',    icon: '64', desc: 'Encode / Decode',
    color: '#F97316', rgb: '249,115,22',
    gradient: 'linear-gradient(135deg, #F97316, #EAB308)',
    bg: 'radial-gradient(ellipse 60% 40% at 80% 20%, rgba(249,115,22,0.12), transparent)',
  },
  {
    path: 'markdown', label: 'Markdown',  icon: 'Md', desc: 'Live Previewer',
    color: '#10B981', rgb: '16,185,129',
    gradient: 'linear-gradient(135deg, #10B981, #06B6D4)',
    bg: 'radial-gradient(ellipse 60% 40% at 80% 20%, rgba(16,185,129,0.12), transparent)',
  },
  {
    path: 'password', label: 'Password',  icon: '**', desc: 'Generator',
    color: '#EF4444', rgb: '239,68,68',
    gradient: 'linear-gradient(135deg, #EF4444, #EC4899)',
    bg: 'radial-gradient(ellipse 60% 40% at 80% 20%, rgba(239,68,68,0.12), transparent)',
  },
  {
    path: 'hash',     label: 'Hash',      icon: '##', desc: 'MD5, SHA-1, SHA-256',
    color: '#A78BFA', rgb: '167,139,250',
    gradient: 'linear-gradient(135deg, #A78BFA, #7C3AED)',
    bg: 'radial-gradient(ellipse 60% 40% at 80% 20%, rgba(167,139,250,0.12), transparent)',
  },
  {
    path: 'jscsv',    label: 'JSON↔CSV',  icon: '⇄', desc: 'Format Converter',
    color: '#34D399', rgb: '52,211,153',
    gradient: 'linear-gradient(135deg, #34D399, #059669)',
    bg: 'radial-gradient(ellipse 60% 40% at 80% 20%, rgba(52,211,153,0.12), transparent)',
  },
]

function NavItem({ t, isActive, isFav, onToggleFav, textPrimary, textSecondary, textMuted, light }) {
  return (
    <div className="relative group/item">
      <NavLink
        to={t.path}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
        style={({ isActive: a }) => a
          ? {
              background: `rgba(${t.rgb}, ${light ? 0.12 : 0.1})`,
              border: `1px solid rgba(${t.rgb}, 0.25)`,
              boxShadow: `0 0 20px rgba(${t.rgb}, 0.08)`,
            }
          : { border: '1px solid transparent' }
        }
      >
        {({ isActive: a }) => (
          <>
            <span className="font-mono text-sm w-7 text-center font-bold transition-all duration-200"
                  style={{
                    color: a ? t.color : textMuted,
                    textShadow: a ? `0 0 12px ${t.color}80` : 'none',
                    fontSize: '13px',
                  }}>
              {t.icon}
            </span>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-mono text-sm font-medium transition-colors duration-200"
                    style={{ color: a ? textPrimary : textSecondary }}>
                {t.label}
              </span>
              <span className="font-sans text-xs truncate transition-colors duration-200"
                    style={{ color: a ? `${t.color}90` : textMuted }}>
                {t.desc}
              </span>
            </div>
            {a && <div className="live-dot flex-shrink-0 mr-5"
                       style={{ background: t.color, boxShadow: `0 0 8px ${t.color}` }} />}
          </>
        )}
      </NavLink>
      {/* Star button - shows on hover */}
      <button
        onClick={e => { e.preventDefault(); e.stopPropagation(); onToggleFav(t.path) }}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center
                   rounded-md transition-all duration-150 opacity-0 group-hover/item:opacity-100"
        style={{
          background: isFav ? `rgba(${t.rgb},0.15)` : 'rgba(255,255,255,0.05)',
          fontSize: '11px',
          color: isFav ? t.color : 'rgba(255,255,255,0.3)',
        }}
        title={isFav ? 'Unstar' : 'Star this tool'}
      >
        {isFav ? '★' : '☆'}
      </button>
    </div>
  )
}

export default function Layout() {
  const location   = useLocation()
  const activeTool = TOOLS.find(t => location.pathname.includes(t.path)) || TOOLS[0]
  const [light, setLight] = useState(() => localStorage.getItem('devkit-theme') === 'light')
  const { favorites, recents, toggleFavorite, trackRecent } = useToolPrefs()

  useEffect(() => {
    const root = document.getElementById('root')
    if (light) {
      root.classList.add('light-mode')
      document.body.style.background = '#F4F4FF'
      localStorage.setItem('devkit-theme', 'light')
    } else {
      root.classList.remove('light-mode')
      document.body.style.background = '#07070F'
      localStorage.setItem('devkit-theme', 'dark')
    }
  }, [light])

  // Track recent on route change
  useEffect(() => {
    const matched = TOOLS.find(t => location.pathname.includes(t.path))
    if (matched) trackRecent(matched.path)
  }, [location.pathname, trackRecent])

  const textPrimary   = light ? '#0E0E1A'               : '#F0F0FF'
  const textSecondary = light ? '#555577'               : '#6B6B9A'
  const textMuted     = light ? '#AAAACC'               : '#2E2E4A'
  const sidebarBg     = light ? 'rgba(255,255,255,0.9)' : 'rgba(14,14,26,0.85)'
  const footerBg      = light ? 'rgba(255,255,255,0.92)': 'rgba(14,14,26,0.9)'
  const borderColor   = light ? 'rgba(0,0,0,0.07)'     : 'rgba(255,255,255,0.05)'
  const gridColor     = light ? 'rgba(0,0,0,0.04)'     : 'rgba(255,255,255,0.015)'
  const rootBg        = light ? '#F4F4FF'               : '#07070F'

  const favTools    = TOOLS.filter(t => favorites.includes(t.path))
  const recentTools = TOOLS.filter(t => recents.includes(t.path))
                           .sort((a,b) => recents.indexOf(a.path) - recents.indexOf(b.path))

  const sharedNavProps = { onToggleFav: toggleFavorite, textPrimary, textSecondary, textMuted, light }

  const SectionLabel = ({ children }) => (
    <p className="font-mono text-xs px-3 mb-1.5 mt-3" style={{ color: textMuted, letterSpacing: '0.12em' }}>
      {children}
    </p>
  )

  return (
    <div className="flex flex-col min-h-screen" style={{ background: rootBg }}>

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
        <div className="absolute inset-0 transition-all duration-700" style={{ background: activeTool.bg, opacity: light ? 0.6 : 1 }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{
          background: `linear-gradient(90deg, transparent, ${activeTool.color}60, transparent)`,
        }} />
      </div>

      <div className="flex flex-1 relative z-10">

        {/* Sidebar */}
        <aside className="w-60 min-w-[240px] flex flex-col sticky top-0 h-screen transition-colors duration-300"
               style={{ background: sidebarBg, backdropFilter: 'blur(24px)', borderRight: `1px solid ${borderColor}` }}>

          {/* Logo + toggle */}
          <div className="px-6 pt-6 pb-5 flex items-start justify-between"
               style={{ borderBottom: `1px solid ${borderColor}` }}>
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                     style={{ background: activeTool.gradient, transition: 'background 0.5s ease' }}>
                  DK
                </div>
                <span className="font-mono font-bold text-base tracking-tight" style={{ color: textPrimary }}>DevKit</span>
              </div>
              <p className="font-mono text-xs ml-9" style={{ color: textMuted }}>developer tools</p>
            </div>

            {/* Theme toggle */}
            <button onClick={() => setLight(l => !l)}
                    title={light ? 'Switch to dark mode' : 'Switch to light mode'}
                    style={{
                      width: '44px', height: '24px', borderRadius: '12px',
                      border: `1px solid ${light ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)'}`,
                      background: light ? 'linear-gradient(135deg, #FDE68A, #F59E0B)' : 'linear-gradient(135deg, #1e1b4b, #312e81)',
                      position: 'relative', cursor: 'pointer', transition: 'all 0.3s ease',
                      flexShrink: 0, marginTop: '2px',
                      boxShadow: light ? '0 2px 8px rgba(245,158,11,0.3)' : '0 2px 8px rgba(99,102,241,0.3)',
                    }}>
              <span style={{ position:'absolute', left:'5px', top:'50%', transform:'translateY(-50%)', fontSize:'9px', opacity: light?0:0.6, transition:'opacity 0.2s' }}>★</span>
              <span style={{ position:'absolute', right:'5px', top:'50%', transform:'translateY(-50%)', fontSize:'9px', opacity: light?0.8:0, transition:'opacity 0.2s' }}>☀</span>
              <div style={{
                position: 'absolute', top: '3px', left: light ? '22px' : '3px',
                width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
                transition: 'left 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px',
              }}>
                {light ? '☀' : '☾'}
              </div>
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto py-3 px-3 flex flex-col">

            {/* Favorites */}
            {favTools.length > 0 && (
              <>
                <SectionLabel>★ FAVORITES</SectionLabel>
                {favTools.map(t => (
                  <NavItem key={t.path} t={t} isFav={favorites.includes(t.path)} {...sharedNavProps} />
                ))}
                <div className="my-2" style={{ height: '1px', background: borderColor }} />
              </>
            )}

            {/* Recents */}
            {recentTools.length > 0 && (
              <>
                <SectionLabel>◷ RECENT</SectionLabel>
                {recentTools.map(t => (
                  <NavItem key={t.path} t={t} isFav={favorites.includes(t.path)} {...sharedNavProps} />
                ))}
                <div className="my-2" style={{ height: '1px', background: borderColor }} />
              </>
            )}

            {/* All tools */}
            <SectionLabel>ALL TOOLS</SectionLabel>
            {TOOLS.map(t => (
              <NavItem key={t.path} t={t} isFav={favorites.includes(t.path)} {...sharedNavProps} />
            ))}
          </nav>

          {/* Sidebar bottom */}
          <div className="px-5 py-4" style={{ borderTop: `1px solid ${borderColor}` }}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs" style={{ color: textMuted }}>v1.0.0</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded-md"
                    style={{ background: light ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)', color: textMuted }}>
                9 tools
              </span>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 max-w-3xl w-full mx-auto px-8 py-8">
            <Outlet context={{ activeTool, light }} />
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 mt-auto transition-colors duration-300"
              style={{ background: footerBg, backdropFilter: 'blur(20px)', borderTop: `1px solid ${borderColor}` }}>
        <div className="h-px w-full" style={{
          background: `linear-gradient(90deg, transparent, ${activeTool.color}50, transparent)`,
        }} />
        <div className="max-w-6xl mx-auto px-8 py-10">
          <div className="grid grid-cols-4 gap-8 mb-8">

            {/* Brand */}
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white"
                     style={{ background: activeTool.gradient }}>DK</div>
                <span className="font-mono font-bold" style={{ color: textPrimary }}>DevKit</span>
              </div>
              <p className="font-sans text-sm leading-relaxed" style={{ color: textSecondary }}>
                Essential tools for developers. Fast, free, and runs entirely in your browser.
              </p>
            </div>

            {/* Tools col 1 */}
            <div>
              <p className="font-mono text-xs mb-4 tracking-widest" style={{ color: textMuted }}>TOOLS</p>
              <div className="flex flex-col gap-2">
                {TOOLS.slice(0, 5).map(t => (
                  <a key={t.path} href={`/${t.path}`}
                     className="font-sans text-sm transition-colors duration-150"
                     style={{ color: textSecondary }}
                     onMouseEnter={e => { e.target.style.color = t.color }}
                     onMouseLeave={e => { e.target.style.color = textSecondary }}>
                    {t.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Tools col 2 */}
            <div>
              <p className="font-mono text-xs mb-4 tracking-widest" style={{ color: textMuted }}>MORE</p>
              <div className="flex flex-col gap-2">
                {TOOLS.slice(5).map(t => (
                  <a key={t.path} href={`/${t.path}`}
                     className="font-sans text-sm transition-colors duration-150"
                     style={{ color: textSecondary }}
                     onMouseEnter={e => { e.target.style.color = t.color }}
                     onMouseLeave={e => { e.target.style.color = textSecondary }}>
                    {t.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <p className="font-mono text-xs mb-4 tracking-widest" style={{ color: textMuted }}>FEATURES</p>
              <div className="flex flex-col gap-2">
                {['No Sign-up Required', 'Runs in Browser', 'Privacy Friendly', 'Open Source'].map(item => (
                  <span key={item} className="font-sans text-sm flex items-center gap-2" style={{ color: textSecondary }}>
                    <span style={{ color: activeTool.color, fontSize: '10px' }}>✦</span>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between pt-6" style={{ borderTop: `1px solid ${borderColor}` }}>
            <p className="font-mono text-xs" style={{ color: textMuted }}>
              © 2025 DevKit · Built with React, Vite &amp; Tailwind CSS
            </p>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs" style={{ color: textMuted }}>Crafted by</span>
              <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, rgba(${activeTool.rgb},0.15), rgba(${activeTool.rgb},0.08))`,
                      border: `1px solid rgba(${activeTool.rgb},0.25)`,
                      color: activeTool.color,
                      boxShadow: `0 0 12px rgba(${activeTool.rgb},0.1)`,
                    }}>
                Shagun Sharma
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}