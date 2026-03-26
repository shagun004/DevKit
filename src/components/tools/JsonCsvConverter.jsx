import { useState } from 'react'
import ToolPage from '../layout/ToolPage'

function jsonToCsv(jsonStr) {
  const data = JSON.parse(jsonStr)
  const arr = Array.isArray(data) ? data : [data]
  if (!arr.length) return ''
  const headers = [...new Set(arr.flatMap(obj => Object.keys(obj)))]
  const escape = v => {
    const s = v === null || v === undefined ? '' : String(v)
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g,'""')}"` : s
  }
  return [
    headers.join(','),
    ...arr.map(row => headers.map(h => escape(row[h])).join(','))
  ].join('\n')
}

function csvToJson(csvStr) {
  const lines = csvStr.trim().split('\n').filter(Boolean)
  if (lines.length < 2) throw new Error('CSV must have at least a header and one data row')
  const parseRow = line => {
    const cells = []; let cur = ''; let inQ = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"' && !inQ) { inQ = true }
      else if (ch === '"' && inQ && line[i+1] === '"') { cur += '"'; i++ }
      else if (ch === '"' && inQ) { inQ = false }
      else if (ch === ',' && !inQ) { cells.push(cur); cur = '' }
      else { cur += ch }
    }
    cells.push(cur)
    return cells
  }
  const headers = parseRow(lines[0])
  return JSON.stringify(
    lines.slice(1).map(line => {
      const vals = parseRow(line)
      return Object.fromEntries(headers.map((h, i) => [h.trim(), vals[i]?.trim() ?? '']))
    }),
    null, 2
  )
}

export default function JsonCsvConverter() {
  const [input, setInput]   = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode]     = useState('json2csv')
  const [status, setStatus] = useState(null)
  const [copied, setCopied] = useState(false)

  const convert = () => {
    try {
      const result = mode === 'json2csv' ? jsonToCsv(input) : csvToJson(input)
      setOutput(result)
      setStatus('ok')
    } catch (e) {
      setOutput('Error: ' + e.message)
      setStatus('error')
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const swap = () => {
    setMode(m => m === 'json2csv' ? 'csv2json' : 'json2csv')
    setInput(output)
    setOutput('')
    setStatus(null)
  }

  return (
    <ToolPage icon="⇄" title="JSON ↔ CSV Converter" description="Convert JSON arrays to CSV spreadsheet format and back.">

      {/* Mode selector */}
      <div className="flex items-center gap-3">
        <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          {['json2csv','csv2json'].map(m => (
            <button key={m} onClick={() => { setMode(m); setOutput(''); setStatus(null) }}
                    className="px-4 py-2 font-mono text-sm transition-all duration-150"
                    style={{
                      background: mode === m ? 'var(--tool-gradient, linear-gradient(135deg,#10B981,#06B6D4))' : 'rgba(255,255,255,0.03)',
                      color: mode === m ? '#fff' : 'rgba(255,255,255,0.4)',
                    }}>
              {m === 'json2csv' ? 'JSON → CSV' : 'CSV → JSON'}
            </button>
          ))}
        </div>
        <button className="tool-btn" onClick={swap} title="Swap input/output">⇄ Swap</button>
      </div>

      <div>
        <label className="block text-xs font-mono text-text-secondary mb-2">
          // {mode === 'json2csv' ? 'JSON input' : 'CSV input'}
        </label>
        <textarea
          className="tool-input h-44"
          placeholder={mode === 'json2csv'
            ? '[{"name":"Shagun","role":"dev"},{"name":"Thunder","role":"AI"}]'
            : 'name,role\nShagun,dev\nThunder,AI'}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        <button className="tool-btn-primary" onClick={convert}>Convert</button>
        <button className="tool-btn" onClick={copy} disabled={!output}>{copied ? '✓ Copied' : 'Copy'}</button>
        {status === 'ok'    && <span className="badge-ok">converted</span>}
        {status === 'error' && <span className="badge-err">error</span>}
      </div>

      <div>
        <label className="block text-xs font-mono text-text-secondary mb-2">
          // {mode === 'json2csv' ? 'CSV output' : 'JSON output'}
        </label>
        <div className="output-box min-h-[140px]">
          {output || <span style={{ color: 'rgba(255,255,255,0.15)' }}>converted result will appear here...</span>}
        </div>
      </div>

    </ToolPage>
  )
}