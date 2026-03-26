import { useState, useMemo } from 'react'
import ToolPage from '../layout/ToolPage'

export default function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags]     = useState('g')
  const [testStr, setTestStr] = useState('')

  const { matches, parts, error } = useMemo(() => {
    if (!pattern || !testStr) return { matches: [], parts: [testStr], error: null }

    try {
      const safeFlags = flags.includes('g') ? flags : flags + 'g'
      const rx = new RegExp(pattern, safeFlags)
      const found = [...testStr.matchAll(rx)]
      const highlighted = testStr.replace(rx, m => `|||${m}|||`)
      const splitParts = highlighted.split('|||')
      return { matches: found, parts: splitParts, error: null }
    } catch (e) {
      return { matches: [], parts: [testStr], error: e.message }
    }
  }, [pattern, flags, testStr])

  return (
    <ToolPage icon=".*" title="Regex Tester" description="Write a regex pattern and see matches highlighted in real time.">

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-mono text-text-secondary mb-2">// pattern</label>
          <input
            type="text"
            className="tool-input font-mono"
            placeholder="\b\w+@\w+\.\w+"
            value={pattern}
            onChange={e => setPattern(e.target.value)}
          />
        </div>
        <div className="w-20">
          <label className="block text-xs font-mono text-text-secondary mb-2">// flags</label>
          <input
            type="text"
            className="tool-input font-mono text-center"
            value={flags}
            onChange={e => setFlags(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="badge-err self-start">{error}</div>}

      <div>
        <label className="block text-xs font-mono text-text-secondary mb-2">// test string</label>
        <textarea
          className="tool-input h-28"
          placeholder="Type or paste your test string here..."
          value={testStr}
          onChange={e => setTestStr(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="text-xs font-mono text-text-secondary">// matches</label>
        <span className={matches.length > 0 ? 'badge-ok' : 'badge-err'}>
          {matches.length} match{matches.length !== 1 ? 'es' : ''}
        </span>
      </div>

      <div className="output-box min-h-[80px]">
        {testStr ? (
          parts.map((part, i) =>
            i % 2 === 0
              ? <span key={i}>{part}</span>
              : <mark key={i} className="bg-accent-cyan/20 text-accent-cyan rounded px-0.5">{part}</mark>
          )
        ) : (
          <span className="text-text-muted">matches will be highlighted here...</span>
        )}
      </div>

    </ToolPage>
  )
}