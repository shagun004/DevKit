import { useState } from 'react'
import ToolPage from '../layout/ToolPage'

const SAMPLE = `# Hello, DevKit

Write **bold**, *italic*, or \`inline code\` text.

## Features
- Live preview as you type
- Supports headings, lists, code
- Clean, minimal rendering

> A blockquote looks like this.

\`\`\`
const greet = () => "hello world"
\`\`\`
`

function parseMarkdown(md) {
  return md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm,  '<h2>$1</h2>')
    .replace(/^# (.+)$/gm,   '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,   '<em>$1</em>')
    .replace(/`{3}[\s\S]*?`{3}/g, m => `<pre>${m.replace(/`{3}/g,'')}</pre>`)
    .replace(/`(.+?)`/g,     '<code>$1</code>')
    .replace(/^> (.+)$/gm,   '<blockquote>$1</blockquote>')
    .replace(/^- (.+)$/gm,   '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
    .replace(/\n\n/g, '<br/>')
}

export default function MarkdownPreviewer() {
  const [md, setMd] = useState(SAMPLE)

  return (
    <ToolPage icon="Md" title="Markdown Previewer" description="Write markdown on the left and see a live preview on the right.">

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-text-secondary mb-2">// editor</label>
          <textarea
            className="tool-input h-80 text-xs leading-relaxed"
            value={md}
            onChange={e => setMd(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-text-secondary mb-2">// preview</label>
          <div
            className="bg-bg-surface border border-bg-border rounded-lg p-4 h-80 overflow-y-auto
                       prose prose-invert prose-sm max-w-none font-sans text-sm leading-relaxed
                       [&_h1]:text-text-primary [&_h1]:text-lg [&_h1]:font-semibold [&_h1]:mb-2
                       [&_h2]:text-text-primary [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mb-2
                       [&_h3]:text-text-secondary [&_h3]:text-sm [&_h3]:font-medium [&_h3]:mb-1
                       [&_strong]:text-accent-cyan [&_em]:text-text-secondary [&_em]:italic
                       [&_code]:bg-bg-card [&_code]:text-accent-cyan [&_code]:px-1 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono
                       [&_pre]:bg-bg-card [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:text-xs [&_pre]:font-mono [&_pre]:text-text-secondary [&_pre]:my-2
                       [&_blockquote]:border-l-2 [&_blockquote]:border-accent-cyan/40 [&_blockquote]:pl-3 [&_blockquote]:text-text-secondary [&_blockquote]:italic
                       [&_ul]:list-disc [&_ul]:pl-4 [&_li]:text-text-secondary [&_li]:my-0.5"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(md) }}
          />
        </div>
      </div>

    </ToolPage>
  )
}
