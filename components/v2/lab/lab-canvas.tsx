'use client'

import { ReactNode, useRef, useState } from 'react'
import { Draggable } from '@/components/v2/lab/draggable'
import { saveLabPosition } from '@/actions/lab'
import type { LabPosition } from '@/actions/lab'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export interface LabItem {
    id: string
    defaultPosition: LabPosition
    element: ReactNode
}

interface LabCanvasProps {
    items: LabItem[]
    initialPositions: Record<string, LabPosition>
}

export function LabCanvas({ items, initialPositions }: LabCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [positions, setPositions] = useState<Record<string, LabPosition>>(() => {
        const merged: Record<string, LabPosition> = {}
        for (const item of items) merged[item.id] = initialPositions[item.id] ?? item.defaultPosition
        return merged
    })
    const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set())
    const [password, setPassword] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState(false)

    function handlePositionChange(id: string, position: LabPosition) {
        setPositions((prev) => ({ ...prev, [id]: position }))
        setDirtyIds((prev) => new Set(prev).add(id))
        setError(false)
    }

    async function handleSave() {
        setIsSaving(true)
        for (const id of dirtyIds) {
            const result = await saveLabPosition(password, id, positions[id])
            if (!result.ok) {
                setIsSaving(false)
                setError(true)
                return
            }
        }
        setIsSaving(false)
        setError(false)
        setDirtyIds(new Set())
    }

    return (
        <div ref={containerRef} className="relative h-full w-full overflow-hidden">
            {items.map((item) => (
                <Draggable
                    key={item.id}
                    containerRef={containerRef}
                    position={positions[item.id]}
                    onPositionChange={(position) => handlePositionChange(item.id, position)}
                >
                    {item.element}
                </Draggable>
            ))}

            {dirtyIds.size > 0 && (
                <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg border border-border bg-card p-2 shadow-md">
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="h-7 w-28 text-0_7"
                    />
                    <Button size="sm" onClick={handleSave} isSaving={isSaving}>
                        Save layout
                    </Button>
                    {error && <span className="text-0_7 text-destructive">Wrong password</span>}
                </div>
            )}
        </div>
    )
}
