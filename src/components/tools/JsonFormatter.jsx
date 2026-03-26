import { useState } from 'react'
import ToolPage from '../layout/ToolPage'

export default function JsonFormatter() {
  const [input, setInput]   = useState('')
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState(null) // 'ok' | 'error'
  const [copied, setCopied] = useState(false)

  const format = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setStatus('ok')
    } catch (e) {
      setOutput('Error: ' + e.message)
      setStatus('error')
    }
  }

  const minify = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input)))
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

  return (
    <ToolPage icon="{}" title="JSON Formatter" description="Paste raw JSON to format, validate, or minify it instantly.">

      <div>
        <label className="block text-xs font-mono text-text-secondary mb-2">// input</label>
        <textarea
          className="tool-input h-40"
          placeholder={'{\n  "name": "shagun",\n  "role": "developer"\n}'}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button className="tool-btn-primary" onClick={format}>Format</button>
        <button className="tool-btn" onClick={minify}>Minify</button>
        <button className="tool-btn" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
        {status === 'ok'    && <span className="badge-ok">valid JSON</span>}
        {status === 'error' && <span className="badge-err">invalid JSON</span>}
      </div>

      <div>
        <label className="block text-xs font-mono text-text-secondary mb-2">// output</label>
        <div className="output-box min-h-[160px]">{output || <span className="text-text-muted">formatted output will appear here...</span>}</div>
      </div>

    </ToolPage>
  )
}
