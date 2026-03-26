import { useState } from 'react'
import ToolPage from '../layout/ToolPage'

function StatCard({ value, label }) {
  return (
    <div className="bg-bg-surface border border-bg-border rounded-xl p-4 text-center">
      <div className="font-mono text-2xl font-semibold text-accent-cyan">{value}</div>
      <div className="text-xs text-text-muted font-sans mt-1">{label}</div>
    </div>
  )
}

export default function WordCounter() {
  const [text, setText] = useState('')

  const words     = text.trim() ? text.trim().split(/\s+/).length : 0
  const chars     = text.length
  const charsNoSp = text.replace(/\s/g, '').length
  const sentences = text.trim() ? (text.match(/[.!?]+/g) || []).length : 0
  const paragraphs= text.trim() ? text.split(/\n\s*\n/).filter(Boolean).length : 0
  const readSecs  = Math.round(words / 3.5)
  const readTime  = readSecs < 60 ? `${readSecs}s` : `${Math.round(readSecs / 60)}m`

  return (
    <ToolPage icon="¶" title="Word Counter" description="Paste any text to get instant word, character, and reading time stats.">

      <div>
        <label className="block text-xs font-mono text-text-secondary mb-2">// input text</label>
        <textarea
          className="tool-input h-48"
          placeholder="Paste or type your text here..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-text-secondary mb-3">// stats</label>
        <div className="grid grid-cols-3 gap-3">
          <StatCard value={words}      label="words" />
          <StatCard value={chars}      label="characters" />
          <StatCard value={charsNoSp}  label="chars (no spaces)" />
          <StatCard value={sentences}  label="sentences" />
          <StatCard value={paragraphs} label="paragraphs" />
          <StatCard value={readTime}   label="read time" />
        </div>
      </div>

    </ToolPage>
  )
}
