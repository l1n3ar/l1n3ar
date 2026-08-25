'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { ReactNode, RefObject } from 'react'

interface DraggableProps {
    children: ReactNode
    className?: string
    containerRef?: RefObject<HTMLElement | null>
}

export function Draggable({ children, className, containerRef }: DraggableProps) {
    return (
        <motion.div
            drag
            dragConstraints={containerRef}
            dragMomentum={false}
            dragElastic={0.05}
            whileDrag={{ scale: 1.2, zIndex: 50 }}
            className={cn('cursor-grab touch-none active:cursor-grabbing', className)}
        >
            {children}
        </motion.div>
    )
}
