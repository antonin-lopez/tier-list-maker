import { useDroppable } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { LayoutGrid } from 'lucide-react'
import TierItem from './TierItem'

/**
 * ItemBank — holds all items that haven't been placed in a tier yet.
 *
 * Props:
 *  items        — Item[]
 *  onDeleteItem — removes an item globally
 */
export default function ItemBank({ items, onDeleteItem }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'bank' })

  return (
    <section className="mt-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 px-1">
        <LayoutGrid size={15} className="text-[#4d4d70]" />
        <span className="text-[0.75rem] font-bold tracking-widest uppercase text-[#4d4d70]">
          Item Bank
        </span>
        <span className="text-[0.7rem] text-[#3a3a55] ml-1">
          ({items.length} {items.length === 1 ? 'item' : 'items'})
        </span>
      </div>

      {/* Drop zone */}
      <SortableContext
        id="bank"
        items={items.map(i => i.id)}
        strategy={rectSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={`
            bank-area
            min-h-[100px] rounded-xl
            border border-white/[0.06]
            bg-[#0a0a14]
            flex flex-row flex-wrap gap-1.5 p-2
            transition-all duration-150
            ${isOver ? 'is-over' : ''}
          `}
        >
          {items.map(item => (
            <TierItem
              key={item.id}
              item={item}
              onDelete={onDeleteItem}
            />
          ))}

          {items.length === 0 && !isOver && (
            <div className="w-full flex items-center justify-center py-6">
              <p className="text-[0.78rem] text-[#25253a] font-medium select-none">
                Add items or drag them back here
              </p>
            </div>
          )}
        </div>
      </SortableContext>
    </section>
  )
}
