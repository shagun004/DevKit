import { useOutletContext } from 'react-router-dom'

export default function ToolPage({ icon, title, description, children }) {
  const ctx = useOutletContext?.() || {}
  const tool = ctx.activeTool || { color: '#8B5CF6', gradient: 'linear-gradient(135deg,#8B5CF6,#6366F1)', rgb: '139,92,246' }

  return (
    <div style={{ animation: 'fadeInUp 0.3s ease forwards' }}>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-mono text-sm font-bold text-white flex-shrink-0"
               style={{
                 background: tool.gradient,
                 boxShadow: `0 4px 20px rgba(${tool.rgb},0.35)`
               }}>
            {icon}
          </div>
          <div>
            <h1 className="font-mono text-xl font-semibold text-white leading-tight">{title}</h1>
            <p className="font-sans text-sm mt-0.5" style={{ color: '#6B6B9A' }}>{description}</p>
          </div>
        </div>
        <div className="mt-4 h-px" style={{
          background: `linear-gradient(90deg, ${tool.color}60, ${tool.color}20, transparent)`
        }} />
      </div>

      {/* Tool CSS vars injected */}
      <style>{`
        :root {
          --tool-color: ${tool.color};
          --tool-color-rgb: ${tool.rgb};
          --tool-gradient: ${tool.gradient};
        }
        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      <div className="flex flex-col gap-5">
        {children}
      </div>
    </div>
  )
}