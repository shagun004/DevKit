import { useState, useCallback } from 'react'
import ToolPage from '../layout/ToolPage'

const UPPER  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER  = 'abcdefghijklmnopqrstuvwxyz'
const NUMS   = '0123456789'
const SYMS   = '!@#$%^&*()_+-=[]{}|;:,.<>?'

function getStrength(pw, opts) {
  const score = (opts.upper ? 1 : 0) + (opts.lower ? 1 : 0) + (opts.nums ? 1 : 0) + (opts.syms ? 1 : 0)
  if (pw.length < 8) return { label: 'too short', color: 'text-red-400', bars: 1 }
  if (score === 1)   return { label: 'weak',       color: 'text-red-400', bars: 1 }
  if (score === 2)   return { label: 'fair',       color: 'text-yellow-400', bars: 2 }
  if (score === 3)   return { label: 'strong',     color: 'text-accent-cyan', bars: 3 }
  return               { label: 'very strong',  color: 'text-accent-green', bars: 4 }
}

export default function PasswordGenerator() {
  const [length, setLength]   = useState(16)
  const [opts, setOpts]       = useState({ upper: true, lower: true, nums: true, syms: false })
  const [password, setPassword] = useState('')
  const [copied, setCopied]   = useState(false)

  const generate = useCallback(() => {
    let chars = ''
    if (opts.upper) chars += UPPER
    if (opts.lower) chars += LOWER
    if (opts.nums)  chars += NUMS
    if (opts.syms)  chars += SYMS
    if (!chars) { setPassword('Select at least one option'); return }
    let pw = ''
    for (let i = 0; i < length; i++) pw += chars[Math.floor(Math.random() * chars.length)]
    setPassword(pw)
    setCopied(false)
  }, [length, opts])

  const copy = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const strength = password ? getStrength(password, opts) : null

  const toggle = (key) => setOpts(o => ({ ...o, [key]: !o[key] }))

  return (
    <ToolPage icon="**" title="Password Generator" description="Generate strong, customizable passwords with one click.">

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-mono text-text-secondary">// length</label>
          <span className="font-mono text-accent-cyan text-sm font-semibold">{length}</span>
        </div>
        <input
          type="range" min={6} max={64} step={1}
          value={length}
          onChange={e => setLength(Number(e.target.value))}
          className="w-full accent-accent-cyan"
        />
        <div className="flex justify-between text-xs font-mono text-text-muted mt-1">
          <span>6</span><span>64</span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-text-secondary mb-3">// character sets</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: 'upper', label: 'Uppercase',  sample: 'A–Z' },
            { key: 'lower', label: 'Lowercase',  sample: 'a–z' },
            { key: 'nums',  label: 'Numbers',    sample: '0–9' },
            { key: 'syms',  label: 'Symbols',    sample: '!@#$' },
          ].map(({ key, label, sample }) => (
            <div
              key={key}
              onClick={() => toggle(key)}
              className={`flex items-center justify-between px-4 py-3 rounded-lg border cursor-pointer transition-all duration-150
                ${opts[key]
                  ? 'bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan'
                  : 'bg-bg-surface border-bg-border text-text-secondary hover:border-bg-border/80'}`}
            >
              <span className="font-sans text-sm">{label}</span>
              <span className="font-mono text-xs opacity-60">{sample}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button className="tool-btn-primary" onClick={generate}>Generate</button>
        <button className="tool-btn" onClick={copy} disabled={!password}>{copied ? '✓ Copied' : 'Copy'}</button>
        {strength && (
          <span className={`font-mono text-xs ${strength.color} flex items-center gap-1.5`}>
            {[1,2,3,4].map(i => (
              <span key={i} className={`inline-block w-5 h-1 rounded-full transition-colors duration-200
                ${i <= strength.bars ? 'bg-current' : 'bg-bg-border'}`} />
            ))}
            {strength.label}
          </span>
        )}
      </div>

      {password && (
        <div className="output-box text-base tracking-widest min-h-[56px] flex items-center">
          {password}
        </div>
      )}

    </ToolPage>
  )
}
