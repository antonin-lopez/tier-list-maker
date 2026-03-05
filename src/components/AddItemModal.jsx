import { useState, useRef } from 'react'
import { X, Type, Image, Upload } from 'lucide-react'

/**
 * AddItemModal — allows creating text labels or uploading images.
 *
 * Props:
 *  onAdd   — callback({ type, content, label? })
 *  onClose — closes the modal
 */
export default function AddItemModal({ onAdd, onClose }) {
  const [tab, setTab] = useState('text') // 'text' | 'image'

  // Text tab
  const [textValue, setTextValue] = useState('')

  // Image tab
  const [imagePreview, setImagePreview] = useState(null) // base64 data URL
  const [imageLabel, setImageLabel] = useState('')
  const fileRef = useRef(null)

  /* ── Handlers ── */

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
    // Pre-fill label with filename (strip extension)
    if (!imageLabel) setImageLabel(file.name.replace(/\.[^.]+$/, ''))
  }

  const handleTextSubmit = (e) => {
    e.preventDefault()
    const trimmed = textValue.trim()
    if (!trimmed) return
    onAdd({ type: 'text', content: trimmed })
    setTextValue('')
    // Stay open so the user can add more items quickly
  }

  const handleImageSubmit = () => {
    if (!imagePreview) return
    onAdd({ type: 'image', content: imagePreview, label: imageLabel.trim() })
    setImagePreview(null)
    setImageLabel('')
  }

  /* ── Render ── */
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-box w-full max-w-sm mx-3 rounded-2xl bg-[#111120] border border-white/[0.08] p-5"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-white">New Item</h2>
          <button onClick={onClose} className="btn btn-ghost w-8 h-8 p-0 justify-center">
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <TabBtn active={tab === 'text'}  icon={<Type size={14}/>}  label="Text"  onClick={() => setTab('text')}  />
          <TabBtn active={tab === 'image'} icon={<Image size={14}/>} label="Image" onClick={() => setTab('image')} />
        </div>

        {/* Text tab */}
        {tab === 'text' && (
          <form onSubmit={handleTextSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#7b7da0] mb-1.5 uppercase tracking-wider">
                Label text
              </label>
              <input
                className="input-base"
                autoFocus
                placeholder="e.g. Dark Souls, Inception, React…"
                value={textValue}
                onChange={e => setTextValue(e.target.value)}
                maxLength={60}
              />
            </div>
            <button
              type="submit"
              disabled={!textValue.trim()}
              className="btn btn-primary w-full py-2 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add to Bank
            </button>
          </form>
        )}

        {/* Image tab */}
        {tab === 'image' && (
          <div className="space-y-3">
            {/* Drop / click zone */}
            <div
              onClick={() => fileRef.current?.click()}
              className="
                border-2 border-dashed border-white/[0.1] rounded-xl
                flex flex-col items-center justify-center
                h-32 cursor-pointer
                hover:border-[#6366f1]/50 hover:bg-[#6366f1]/5
                transition-all duration-150
                relative overflow-hidden
              "
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="h-full w-full object-contain"
                />
              ) : (
                <>
                  <Upload size={22} className="text-[#3d3d60] mb-2" />
                  <p className="text-sm text-[#4a4a6a] font-medium">Click to upload image</p>
                  <p className="text-[0.7rem] text-[#35355a] mt-0.5">PNG, JPG, GIF, WEBP…</p>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Optional label */}
            <div>
              <label className="block text-xs font-semibold text-[#7b7da0] mb-1.5 uppercase tracking-wider">
                Label (optional)
              </label>
              <input
                className="input-base"
                placeholder="Name for this image…"
                value={imageLabel}
                onChange={e => setImageLabel(e.target.value)}
                maxLength={50}
              />
            </div>

            <button
              onClick={handleImageSubmit}
              disabled={!imagePreview}
              className="btn btn-primary w-full py-2 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add to Bank
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Tab button ── */
function TabBtn({ active, icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 flex items-center justify-center gap-1.5
        py-1.5 rounded-lg text-sm font-semibold
        transition-all duration-150
        ${active
          ? 'bg-[#6366f1] text-white shadow-[0_0_16px_rgba(99,102,241,0.4)]'
          : 'bg-white/[0.05] text-[#7b7da0] hover:bg-white/[0.09]'
        }
      `}
    >
      {icon}
      {label}
    </button>
  )
}
