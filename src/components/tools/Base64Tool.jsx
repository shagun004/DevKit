import { useState } from 'react'
import ToolPage from '../layout/ToolPage'

export default function Base64Tool() {
  const [input, setInput]   = useState('')
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState(null)
  const [copied, setCopied] = useState(false)

  const encode = () => {
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))))
      setStatus('encoded')
    } catch {
      setOutput('Encoding failed.')
      setStatus('error')
    }
  }

  const decode = () => {
    try {
      setOutput(decodeURIComponent(escape(atob(input.trim()))))
      setStatus('decoded')
    } catch {
      setOutput('Invalid Base64 string.')
      setStatus('error')
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <ToolPage icon="64" title="Base64 Encoder / Decoder" description="Encode plain text to Base64 or decode Base64 strings back to text.">

      <div>
        <label className="block text-xs font-mono text-text-secondary mb-2">// input</label>
        <textarea
          className="tool-input h-36"
          placeholder="Enter text to encode, or a Base64 string to decode..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button className="tool-btn-primary" onClick={encode}>Encode →</button>
        <button className="tool-btn" onClick={decode}>← Decode</button>
        <button className="tool-btn" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
        {status === 'encoded' && <span className="badge-ok">encoded</span>}
        {status === 'decoded' && <span className="badge-ok">decoded</span>}
        {status === 'error'   && <span className="badge-err">error</span>}
      </div>

      <div>
        <label className="block text-xs font-mono text-text-secondary mb-2">// output</label>
        <div className="output-box min-h-[120px]">
          {output || <span className="text-text-muted">result will appear here...</span>}
        </div>
      </div>

    </ToolPage>
  )
}
