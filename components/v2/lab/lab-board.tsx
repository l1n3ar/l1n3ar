'use client'

import { useRef, useState, type ComponentType, type RefObject } from 'react'
import { motion } from 'motion/react'
import { LAB_REGISTRY, type LabItemConfig } from '@/data/lab/registry'
import { labSections } from '@/data/lab/items'
import { Draggable } from '@/components/v2/lab/draggable'
import { AnimatedBeam } from '@/components/v2/lab/animated-beam'
import { LabDotPattern } from '@/components/v2/lab/lab-dot-pattern'
import { saveLabPosition, type LabPosition } from '@/actions/lab'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Save } from 'lucide-react'

interface LabConnection {
    from: string
    to: string
}

const CONNECTIONS: LabConnection[] = [
    { from: 'NOTE-002', to: 'WEB-001' },
    { from: 'NOTE-003', to: 'CLI-001' },
    { from: 'NOTE-004', to: 'WEB-002' },
  
]

function renderItem(item: LabItemConfig) {
    const Component = LAB_REGISTRY[item.component] as ComponentType<any>
    return <Component id={item.id} {...item.props} />
}

interface LabBoardProps {
    initialPositions: Record<string, LabPosition>
}

export function LabBoard({ initialPositions }: LabBoardProps) {
    const boardRef = useRef<HTMLDivElement>(null)
    const freeAreaRef = useRef<HTMLDivElement>(null)

    const notes = labSections.find((section) => section.title === 'Notes')?.items ?? []
    const freeItems = labSections
        .filter((section) => section.title !== 'Notes')
        .flatMap((section) => section.items)

    const itemRefs = useRef<Record<string, RefObject<HTMLDivElement | null>>>(undefined)
    if (!itemRefs.current) {
        itemRefs.current = {}
        for (const item of [...notes, ...freeItems]) itemRefs.current[item.id] = { current: null }
    }
    const refs = itemRefs.current

    const [positions, setPositions] = useState<Record<string, LabPosition>>(() => {
        const merged: Record<string, LabPosition> = {}
        for (const item of freeItems) {
            merged[item.id] = initialPositions[item.id] ?? item.defaultPosition ?? { x: 0, y: 0 }
        }
        return merged
    })
    const [notesOpen, setNotesOpen] = useState(true)
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
        <div ref={boardRef} className="relative z-0 flex flex-1 min-h-0 gap-6 py-2">
            <LabDotPattern />

            <div className="relative shrink-0">
                <Badge
                    render={<button type="button" onClick={() => setNotesOpen((v) => !v)} />}
                    className="absolute -top-3 -left-3 z-10 cursor-pointer rotate-[-4deg] bg-foreground px-3 py-1 text-[0.65rem] font-semibold tracking-wide text-background shadow-md"
                >
                    NOTES
                </Badge>
                <motion.div
                    initial={false}
                    animate={{ width: notesOpen ? 320 : 0, opacity: notesOpen ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="h-full overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
                >
                    <div className="grid w-80 grid-cols-2 content-start gap-6 px-4 py-10">
                        {notes.map((item) => (
                            <div key={item.id} ref={refs[item.id]}>
                                {renderItem(item)}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div ref={freeAreaRef} className="relative min-h-full w-full flex-1">
                {freeItems.map((item) => (
                    <Draggable
                        key={item.id}
                        ref={refs[item.id]}
                        containerRef={boardRef}
                        position={positions[item.id]}
                        onPositionChange={(position) => handlePositionChange(item.id, position)}
                    >
                        {renderItem(item)}
                    </Draggable>
                ))}
            </div>

            {notesOpen && CONNECTIONS.map((connection) => (
                <AnimatedBeam
                    key={`${connection.from}->${connection.to}`}
                    containerRef={boardRef}
                    fromRef={refs[connection.from]}
                    toRef={refs[connection.to]}
                />
            ))}

            {dirtyIds.size > 0 && (
                <div className="fixed bottom-4 right-4 z-50 flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-2 shadow-md">
                    {error && <span className="text-0_7 text-destructive">Wrong password</span>}
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="h-7 w-28 text-0_7"
                    />
                    <Button size="sm" onClick={handleSave} isSaving={isSaving} className="w-28">
                        <Save className="size-3 mr-1" /> Save
                    </Button>
                </div>
            )}
        </div>
    )
}
