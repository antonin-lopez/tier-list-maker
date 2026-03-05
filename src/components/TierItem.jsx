import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { X } from 'lucide-react'

/**
 * TierItem — A single draggable card.
 *
 * Props:
 *  item       — { id, type: 'text'|'image', content, label? }
 *  onDelete   — callback(itemId)
 *  overlay    — boolean; when true the item is rendered as the DragOverlay clone
 *               (no sortable hooks, no opacity tricks)
 */
export default function TierItem({ item, onDelete, overlay = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled: overlay,
  })

  const style = overlay ? {} : {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={overlay ? undefined : setNodeRef}
      style={style}
      className={`tier-item group ${isDragging && !overlay ? 'is-dragging' : ''}`}
      {...(overlay ? {} : attributes)}
      {...(overlay ? {} : listeners)}
    >
      {item.type === 'image' ? (
        <ImageCard item={item} />
      ) : (
        <TextCard item={item} />
      )}

      {/* Delete button — hidden until hover/focus (desktop) */}
      {onDelete && (
        <button
          onClick={e => { e.stopPropagation(); onDelete(item.id) }}
          className="
            absolute top-0.5 right-0.5
            w-5 h-5 rounded-full
            bg-black/70 text-white
            items-center justify-center
            opacity-0 group-hover:opacity-100
            focus:opacity-100
            transition-opacity duration-150
            z-10 hidden group-hover:flex
          "
          aria-label="Remove item"
          title="Remove"
        >
          <X size={11} strokeWidth={3} />
        </button>
      )}
    </div>
  )
}

/* ── Sub-cards ──────────────────────────────────────────────────────────── */

function TextCard({ item }) {
  return (
    <div
      className="
        min-w-[72px] max-w-[140px] h-[72px]
        flex items-center justify-center text-center
        bg-gradient-to-b from-[#1e1e2e] to-[#16162a]
        border border-white/[0.07]
        px-2 py-1
        text-[0.72rem] font-semibold leading-tight text-[#d4d6f0]
        select-none
      "
      title={item.content}
    >
      <span className="line-clamp-4 break-words">{item.content}</span>
    </div>
  )
}

function ImageCard({ item }) {
  return (
    <div className="w-[72px] h-[72px] relative flex-shrink-0">
      <img
        src={item.content}
        alt={item.label || 'tier item'}
        className="w-full h-full object-cover block select-none pointer-events-none"
        draggable={false}
      />
      {/* Optional label overlay */}
      {item.label && (
        <div className="
          absolute bottom-0 left-0 right-0
          bg-black/60 backdrop-blur-sm
          text-[0.6rem] text-white font-semibold
          text-center truncate px-1 py-0.5
        ">
          {item.label}
        </div>
      )}
    </div>
  )
}
