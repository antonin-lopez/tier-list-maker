import { useDroppable } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { Settings2 } from 'lucide-react'
import TierItem from './TierItem'

/**
 * TierRow — one horizontal tier (label + items drop zone).
 *
 * Props:
 *  tier         — { id, label, color, items[] }
 *  onEdit       — opens EditTierModal
 *  onDeleteItem — removes an item globally
 */
export default function TierRow({ tier, onEdit, onDeleteItem }) {
  // Make the items area droppable so empty tiers still accept drops
  const { setNodeRef, isOver } = useDroppable({ id: tier.id })

  return (
    <div
      className="flex min-h-[76px] rounded-xl overflow-hidden border border-white/[0.06] bg-[#0e0e1a]"
      style={{ boxShadow: `0 0 0 1px ${tier.color}18` }}
    >
      {/* ── Tier label ── */}
      <button
        onClick={onEdit}
        className="
          flex-shrink-0 w-[64px] sm:w-[80px]
          flex flex-col items-center justify-center gap-1
          font-extrabold text-2xl
          transition-all duration-150
          group relative
        "
        style={{
          background: `linear-gradient(160deg, ${tier.color}cc 0%, ${tier.color}88 100%)`,
          color: '#fff',
          textShadow: '0 1px 4px rgba(0,0,0,0.5)',
        }}
        title={`Edit tier "${tier.label}"`}
        aria-label={`Edit tier ${tier.label}`}
      >
        <span className="font-mono tracking-wide" style={{ fontFamily: '"Space Mono", monospace' }}>
          {tier.label}
        </span>
        {/* edit hint on hover */}
        <Settings2
          size={13}
          className="opacity-0 group-hover:opacity-70 absolute bottom-1.5 transition-opacity"
        />
      </button>

      {/* ── Items zone ── */}
      <SortableContext
        id={tier.id}
        items={tier.items.map(i => i.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={`items-area flex-1 flex flex-row flex-wrap gap-1 items-center p-1.5 min-h-[76px] overflow-x-auto transition-all duration-150 ${isOver ? 'is-over' : ''}`}
        >
          {tier.items.map(item => (
            <TierItem
              key={item.id}
              item={item}
              onDelete={onDeleteItem}
            />
          ))}

          {/* Empty-state hint */}
          {tier.items.length === 0 && !isOver && (
            <p className="text-[0.72rem] text-[#2e2e44] font-medium pl-2 select-none pointer-events-none">
              Drop items here
            </p>
          )}
        </div>
      </SortableContext>
    </div>
  )
}
