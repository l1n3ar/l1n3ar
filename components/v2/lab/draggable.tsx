'use client'

import { motion, useMotionValue } from 'motion/react'
import { cn } from '@/lib/utils'
import { ReactNode, RefObject, forwardRef, useEffect } from 'react'
import type { LabPosition } from '@/actions/lab'

interface DraggableProps {
    children: ReactNode
    className?: string
    containerRef?: RefObject<HTMLElement | null>
    position: LabPosition
    onPositionChange?: (position: LabPosition) => void
}

export const Draggable = forwardRef<HTMLDivElement, DraggableProps>(function Draggable(
    { children, className, containerRef, position, onPositionChange },
    ref
) {
    const x = useMotionValue(position.x)
    const y = useMotionValue(position.y)

    useEffect(() => {
        x.set(position.x)
        y.set(position.y)
    }, [position.x, position.y, x, y])

    return (
        <motion.div
            ref={ref}
            drag
            dragConstraints={containerRef}
            dragMomentum={false}
            dragElastic={0}
            whileDrag={{ scale: 1.05, zIndex: 50 }}
            style={{ x, y }}
            onDragEnd={() => {
                onPositionChange?.({ x: x.get(), y: y.get() })
            }}
            className={cn('absolute top-0 left-0 cursor-grab touch-none active:cursor-grabbing', className)}
        >
            {children}
        </motion.div>
    )
})
