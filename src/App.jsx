import { useState, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core'
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'

import TierRow from './components/TierRow'
import ItemBank from './components/ItemBank'
import TierItem from './components/TierItem'
import Toolbar from './components/Toolbar'
import AddItemModal from './components/AddItemModal'
import EditTierModal from './components/EditTierModal'

// ── Helpers ────────────────────────────────────────────────────────────────

/** Generate a short unique id without external deps */
const uid = () => Math.random().toString(36).slice(2, 10)

/** Default tier setup on first load */
const DEFAULT_TIERS = [
  { id: 'tier-s', label: 'S', color: '#ef4444', items: [] },
  { id: 'tier-a', label: 'A', color: '#f97316', items: [] },
  { id: 'tier-b', label: 'B', color: '#eab308', items: [] },
  { id: 'tier-c', label: 'C', color: '#22c55e', items: [] },
  { id: 'tier-d', label: 'D', color: '#3b82f6', items: [] },
]

/** DragOverlay drop animation */
const DROP_ANIMATION = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: { active: { opacity: '0.3' } },
  }),
}

// ── Custom collision detection ─────────────────────────────────────────────
// Prefer pointer-within (exact cursor position) then fall back to rect overlap
const collisionDetection = (args) => {
  const pw = pointerWithin(args)
  if (pw.length > 0) return pw
  return rectIntersection(args)
}

// ── Main component ─────────────────────────────────────────────────────────
export default function App() {
  // ── State ──────────────────────────────────────────────────────────────
  const [tiers, setTiers] = useState(DEFAULT_TIERS)
  const [bank, setBank] = useState([])
  const [activeItem, setActiveItem] = useState(null) // item being dragged
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTierId, setEditingTierId] = useState(null)

  // ── DnD sensors ────────────────────────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 220, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // ── Container helpers ──────────────────────────────────────────────────
  /**
   * Given an item id (or container id), find which container owns it.
   * Works against a snapshot of tiers + bank (passed in to support use inside setState).
   */
  const findContainer = (itemId, snapTiers, snapBank) => {
    if (itemId === 'bank') return 'bank'
    if (snapTiers.find(t => t.id === itemId)) return itemId // it IS a container
    if (snapBank.find(i => i.id === itemId)) return 'bank'
    for (const tier of snapTiers) {
      if (tier.items.find(i => i.id === itemId)) return tier.id
    }
    return null
  }

  const getContainerItems = (containerId, snapTiers, snapBank) =>
    containerId === 'bank'
      ? snapBank
      : snapTiers.find(t => t.id === containerId)?.items ?? []

  const setContainerItems = (state, containerId, items) => {
    if (containerId === 'bank') return { ...state, bank: items }
    return {
      ...state,
      tiers: state.tiers.map(t => t.id === containerId ? { ...t, items } : t),
    }
  }

  // ── DnD event handlers ─────────────────────────────────────────────────

  const handleDragStart = useCallback(({ active }) => {
    const all = [...bank, ...tiers.flatMap(t => t.items)]
    setActiveItem(all.find(i => i.id === active.id) ?? null)
  }, [bank, tiers])

  /**
   * onDragOver fires continuously during movement.
   * When the pointer enters a new container, we immediately move the item there
   * so the placeholder reflects the live position.
   */
  const handleDragOver = useCallback(({ active, over }) => {
    if (!over || active.id === over.id) return

    const activeId = active.id
    const overId   = over.id

    setTiers(prevTiers => {
      // We need a coordinated update of both tiers and bank.
      // Build a temporary combined state snapshot.
      // NOTE: Because setTiers doesn't give us bank, we close over `bank`.
      // This is safe here since bank is read-only in this callback.
      let snap = { tiers: prevTiers, bank }

      const activeContainer = findContainer(activeId, snap.tiers, snap.bank)
      // over.data.current.sortable?.containerId tells us the container of the
      // item we're hovering; fall back to treating overId as a container id.
      const overContainer =
        over.data?.current?.sortable?.containerId ??
        findContainer(overId, snap.tiers, snap.bank)

      if (!activeContainer || !overContainer || activeContainer === overContainer) {
        return prevTiers // no change needed
      }

      const activeItems = getContainerItems(activeContainer, snap.tiers, snap.bank)
      const overItems   = getContainerItems(overContainer,   snap.tiers, snap.bank)

      const activeIdx = activeItems.findIndex(i => i.id === activeId)
      if (activeIdx === -1) return prevTiers

      const movedItem = activeItems[activeIdx]

      const newActiveItems = activeItems.filter((_, i) => i !== activeIdx)
      const overItemIdx    = overItems.findIndex(i => i.id === overId)
      const insertIdx      = overItemIdx >= 0 ? overItemIdx : overItems.length

      const newOverItems = [
        ...overItems.slice(0, insertIdx),
        movedItem,
        ...overItems.slice(insertIdx),
      ]

      snap = setContainerItems(snap, activeContainer, newActiveItems)
      snap = setContainerItems(snap, overContainer,   newOverItems)

      // Sync bank state separately (setTiers can't update bank)
      if (snap.bank !== bank) setBank(snap.bank)

      return snap.tiers
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bank])

  /**
   * onDragEnd fires once when the user releases.
   * By this point the item is already in the correct container (handled by onDragOver).
   * We only need to handle same-container reordering.
   */
  const handleDragEnd = useCallback(({ active, over }) => {
    setActiveItem(null)
    if (!over || active.id === over.id) return

    const activeId = active.id
    const overId   = over.id

    setTiers(prevTiers => {
      let snap = { tiers: prevTiers, bank }

      const activeContainer = findContainer(activeId, snap.tiers, snap.bank)
      const overContainer   =
        over.data?.current?.sortable?.containerId ??
        findContainer(overId, snap.tiers, snap.bank)

      if (!activeContainer || activeContainer !== overContainer) return prevTiers

      const items    = getContainerItems(activeContainer, snap.tiers, snap.bank)
      const oldIndex = items.findIndex(i => i.id === activeId)
      const newIndex = items.findIndex(i => i.id === overId)

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prevTiers

      const reordered = arrayMove(items, oldIndex, newIndex)
      snap = setContainerItems(snap, activeContainer, reordered)
      if (snap.bank !== bank) setBank(snap.bank)

      return snap.tiers
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bank])

  // ── Item CRUD ──────────────────────────────────────────────────────────

  /** Add a new item to the bank */
  const handleAddItem = (itemData) => {
    setBank(prev => [...prev, { id: uid(), ...itemData }])
  }

  /** Remove an item from wherever it lives */
  const handleDeleteItem = useCallback((itemId) => {
    setBank(prev => prev.filter(i => i.id !== itemId))
    setTiers(prev =>
      prev.map(t => ({ ...t, items: t.items.filter(i => i.id !== itemId) }))
    )
  }, [])

  // ── Tier CRUD ──────────────────────────────────────────────────────────

  const handleAddTier = () => {
    const labels = ['E', 'F', 'G', 'H', 'I', 'J', 'K']
    const used   = new Set(tiers.map(t => t.label))
    const label  = labels.find(l => !used.has(l)) ?? `T${tiers.length}`
    setTiers(prev => [...prev, {
      id:    `tier-${uid()}`,
      label,
      color: '#6366f1',
      items: [],
    }])
  }

  const handleSaveTier = useCallback((tierId, updates) => {
    setTiers(prev => prev.map(t => t.id === tierId ? { ...t, ...updates } : t))
    setEditingTierId(null)
  }, [])

  const handleDeleteTier = useCallback((tierId) => {
    setTiers(prev => {
      const tier = prev.find(t => t.id === tierId)
      if (tier) setBank(b => [...b, ...tier.items]) // return items to bank
      return prev.filter(t => t.id !== tierId)
    })
    setEditingTierId(null)
  }, [])

  // ── Clear all items from all tiers → back to bank ──────────────────────
  const handleClearTiers = () => {
    setBank(prev => [...prev, ...tiers.flatMap(t => t.items)])
    setTiers(prev => prev.map(t => ({ ...t, items: [] })))
  }

  // ── Export / Import ────────────────────────────────────────────────────

  const handleExport = () => {
    const data = JSON.stringify({ tiers, bank }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'tier-list.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result)
        if (!parsed.tiers || !Array.isArray(parsed.tiers)) throw new Error('Invalid format')
        setTiers(parsed.tiers)
        setBank(parsed.bank ?? [])
      } catch {
        alert('⚠️ Invalid JSON file. Please import a valid Tier List export.')
      }
    }
    reader.readAsText(file)
  }

  // ── Render ─────────────────────────────────────────────────────────────

  const editingTier = tiers.find(t => t.id === editingTierId) ?? null

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Top toolbar ── */}
      <Toolbar
        onAddItem={() => setShowAddModal(true)}
        onAddTier={handleAddTier}
        onClearTiers={handleClearTiers}
        onExport={handleExport}
        onImport={handleImport}
      />

      {/* ── Tier list + Bank ── */}
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <main className="flex-1 px-3 sm:px-6 py-4 max-w-6xl mx-auto w-full space-y-2">
          {/* Tier rows */}
          {tiers.map(tier => (
            <TierRow
              key={tier.id}
              tier={tier}
              onEdit={() => setEditingTierId(tier.id)}
              onDeleteItem={handleDeleteItem}
            />
          ))}

          {tiers.length === 0 && (
            <div className="text-center py-16 text-[#3d3d5c]">
              <p className="text-lg font-semibold">No tiers yet.</p>
              <p className="text-sm mt-1">Click <strong>+ Tier</strong> in the toolbar to get started.</p>
            </div>
          )}

          {/* Item bank */}
          <ItemBank items={bank} onDeleteItem={handleDeleteItem} />
        </main>

        {/* Floating drag preview */}
        <DragOverlay dropAnimation={DROP_ANIMATION}>
          {activeItem && (
            <div className="drag-overlay-wrapper">
              <TierItem item={activeItem} overlay />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* ── Modals ── */}
      {showAddModal && (
        <AddItemModal
          onAdd={handleAddItem}
          onClose={() => setShowAddModal(false)}
        />
      )}
      {editingTier && (
        <EditTierModal
          tier={editingTier}
          onSave={handleSaveTier}
          onDelete={handleDeleteTier}
          onClose={() => setEditingTierId(null)}
        />
      )}
    </div>
  )
}
