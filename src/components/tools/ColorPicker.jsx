import { useState } from 'react'
import ToolPage from '../layout/ToolPage'

function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return r ? [parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16)] : null
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  if (max === min) { h = s = 0 }
  else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function CopyChip({ label, value }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }
  return (
    <div
      onClick={copy}
      className="bg-bg-surface border border-bg-border rounded-lg px-4 py-3 cursor-pointer
                 hover:border-accent-cyan/40 hover:bg-accent-cyan/5 transition-all duration-150 group"
    >
      <div className="text-xs text-text-muted font-mono mb-1">{label}</div>
      <div className="text-sm font-mono text-text-primary group-hover:text-accent-cyan transition-colors">
        {copied ? '✓ copied' : value}
      </div>
    </div>
  )
}

export default function ColorPicker() {
  const [hex, setHex] = useState('#00D9C0')

  const rgb = hexToRgb(hex)
  const hsl = rgb ? rgbToHsl(...rgb) : [0, 0, 0]

  const handlePicker = (e) => setHex(e.target.value)
  const handleText   = (e) => {
    const val = e.target.value
    if (/^#[0-9a-fA-F]{6}$/.test(val)) setHex(val)
  }

  return (
    <ToolPage icon="◉" title="Color Picker" description="Pick a color and instantly get HEX, RGB, HSL, and CSS values.">

      <div className="flex items-center gap-5">
        {/* Big color preview */}
        <div
          className="w-24 h-24 rounded-xl border-2 border-bg-border flex-shrink-0 shadow-glow"
          style={{ backgroundColor: hex }}
        />

        <div className="flex flex-col gap-3 flex-1">
          <div>
            <label className="text-xs font-mono text-text-secondary mb-2 block">// color picker</label>
            <input
              type="color"
              value={hex}
              onChange={handlePicker}
              className="w-full h-10 rounded-lg border border-bg-border bg-bg-surface cursor-pointer"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-text-secondary mb-2 block">// hex input</label>
            <input
              type="text"
              defaultValue={hex}
              onChange={handleText}
              placeholder="#00D9C0"
              className="tool-input"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-text-secondary mb-3">// values — click to copy</label>
        <div className="grid grid-cols-2 gap-3">
          <CopyChip label="HEX"    value={hex.toUpperCase()} />
          <CopyChip label="RGB"    value={rgb ? `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` : '-'} />
          <CopyChip label="HSL"    value={`hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`} />
          <CopyChip label="CSS"    value={`color: ${hex.toUpperCase()};`} />
        </div>
      </div>

    </ToolPage>
  )
}
