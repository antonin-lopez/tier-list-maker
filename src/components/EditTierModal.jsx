import { useState } from 'react'
import { X, Trash2, Check } from 'lucide-react'

/** Preset color swatches for quick selection */
const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6',
  '#a855f7', '#ec4899', '#f43f5e', '#94a3b8',
]

/**
 * EditTierModal — edit a tier's label and color, or delete it.
 *
 * Props:
 *  tier     — { id, label, color }
 *  onSave   — callback(tierId, { label, color })
 *  onDelete — callback(tierId)
 *  onClose  — closes the modal
 */
export default function EditTierModal({ tier, onSave, onDelete, onClose }) {
  const [label, setLabel] = useState(tier.label)
  const [color, setColor] = useState(tier.color)

  const handleSave = (e) => {
    e.preventDefault()
    const trimmed = label.trim()
    if (!trimmed) return
    onSave(tier.id, { label: trimmed, color })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-box w-full max-w-xs mx-3 rounded-2xl bg-[#111120] border border-white/[0.08] p-5"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-white">Edit Tier</h2>
          <button onClick={onClose} className="btn btn-ghost w-8 h-8 p-0 justify-center">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Preview chip */}
          <div className="flex justify-center">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-extrabold text-white shadow-lg"
              style={{
                background: `linear-gradient(160deg, ${color}cc 0%, ${color}88 100%)`,
                fontFamily: '"Space Mono", monospace',
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              }}
            >
              {label || '?'}
            </div>
          </div>

          {/* Label input */}
          <div>
            <label className="block text-xs font-semibold text-[#7b7da0] mb-1.5 uppercase tracking-wider">
              Tier Label
            </label>
            <input
              className="input-base text-center font-bold text-lg"
              value={label}
              onChange={e => setLabel(e.target.value)}
              maxLength={4}
              autoFocus
            />
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-xs font-semibold text-[#7b7da0] mb-2 uppercase tracking-wider">
              Color
            </label>

            {/* Preset swatches */}
            <div className="grid grid-cols-8 gap-1.5 mb-2">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-6 h-6 rounded-md transition-transform hover:scale-110 focus:scale-110 relative"
                  style={{ background: c }}
                  title={c}
                >
                  {color === c && (
                    <Check
                      size={12}
                      strokeWidth={3}
                      className="absolute inset-0 m-auto text-white drop-shadow"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Custom color input */}
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                className="w-9 h-9 rounded-lg cursor-pointer border border-white/10 bg-transparent"
                title="Custom color"
              />
              <input
                className="input-base font-mono text-sm"
                value={color}
                onChange={e => {
                  const v = e.target.value
                  if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setColor(v)
                }}
                maxLength={7}
                placeholder="#rrggbb"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                if (confirm(`Delete tier "${tier.label}"? Its items will return to the bank.`)) {
                  onDelete(tier.id)
                }
              }}
              className="btn btn-danger flex-shrink-0 px-3 py-2 text-sm"
              title="Delete tier"
            >
              <Trash2 size={14} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost flex-1 py-2 text-sm justify-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!label.trim()}
              className="btn btn-primary flex-1 py-2 text-sm justify-center disabled:opacity-40"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
