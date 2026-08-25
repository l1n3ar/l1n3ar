'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { ReactNode, RefObject } from 'react'
import type { LabPosition } from '@/actions/lab'

interface DraggableProps {
    children: ReactNode
    className?: string
    containerRef?: RefObject<HTMLElement | null>
    position: LabPosition
    onPositionChange?: (position: LabPosition) => void
}

export function Draggable({ children, className, containerRef, position, onPositionChange }: DraggableProps) {
    return (
        <motion.div
            drag
            dragConstraints={containerRef}
            dragMomentum={false}
            dragElastic={0.05}
            whileDrag={{ scale: 1.2, zIndex: 50 }}
            style={{ x: position.x, y: position.y }}
            onDragEnd={(_, info) => {
                onPositionChange?.({ x: position.x + info.offset.x, y: position.y + info.offset.y })
            }}
            className={cn('absolute top-0 left-0 cursor-grab touch-none active:cursor-grabbing', className)}
        >
            {children}
        </motion.div>
    )
}
