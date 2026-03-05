import { useRef } from 'react'
import {
  Plus,
  Layers,
  Trash2,
  Download,
  Upload,
  Trophy,
} from 'lucide-react'

/**
 * Toolbar — sticky header with all global actions.
 *
 * Props:
 *  onAddItem   — opens AddItemModal
 *  onAddTier   — creates a new empty tier
 *  onClearTiers — moves all tier items back to bank
 *  onExport    — downloads JSON
 *  onImport    — receives a File object
 */
export default function Toolbar({ onAddItem, onAddTier, onClearTiers, onExport, onImport }) {
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      onImport(file)
      e.target.value = '' // reset so the same file can be re-imported
    }
  }

  return (
    <header
      className="
        sticky top-0 z-50
        flex items-center justify-between
        px-3 sm:px-6 py-3
        border-b border-white/[0.06]
        bg-[#07070d]/90 backdrop-blur-xl
      "
      style={{ boxShadow: '0 2px 30px rgba(0,0,0,0.5)' }}
    >
      {/* ── Brand ── */}
      <div className="flex items-center gap-2.5">
        <Trophy size={20} className="text-[#6366f1]" strokeWidth={2.5} />
        <span
          className="text-base sm:text-lg font-extrabold tracking-tight text-white"
          style={{ fontFamily: '"Space Mono", monospace', letterSpacing: '-0.02em' }}
        >
          TIER<span className="text-[#6366f1]">LIST</span>
        </span>
      </div>

      {/* ── Actions ── */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
        {/* Add Item */}
        <button
          onClick={onAddItem}
          className="btn btn-primary px-3 py-1.5 text-sm"
          title="Add a new item to the bank"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span className="hidden sm:inline">Add Item</span>
        </button>

        {/* Add Tier */}
        <button
          onClick={onAddTier}
          className="btn btn-ghost px-3 py-1.5 text-sm"
          title="Add a new tier row"
        >
          <Layers size={14} />
          <span className="hidden sm:inline">+ Tier</span>
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-white/10 mx-0.5 hidden sm:block" />

        {/* Export */}
        <button
          onClick={onExport}
          className="btn btn-ghost px-3 py-1.5 text-sm"
          title="Export tier list as JSON"
        >
          <Download size={14} />
          <span className="hidden sm:inline">Export</span>
        </button>

        {/* Import */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn btn-ghost px-3 py-1.5 text-sm"
          title="Import tier list from JSON"
        >
          <Upload size={14} />
          <span className="hidden sm:inline">Import</span>
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
          aria-hidden="true"
        />

        {/* Divider */}
        <div className="w-px h-5 bg-white/10 mx-0.5 hidden sm:block" />

        {/* Clear Tiers */}
        <button
          onClick={() => {
            if (confirm('Move all placed items back to the bank?')) onClearTiers()
          }}
          className="btn btn-danger px-3 py-1.5 text-sm"
          title="Clear all tiers (items return to bank)"
        >
          <Trash2 size={14} />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>
    </header>
  )
}
