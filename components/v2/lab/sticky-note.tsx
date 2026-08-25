import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ICON_STROKE } from '@/components/v2/constants'
import { cn } from '@/lib/utils'
import { Circle, Clock, CheckCircle2 } from 'lucide-react'
import React from 'react'

const TYPE_META = {
    'To-Do': { icon: Circle, className: 'text-muted-foreground' },
    'In Progress': { icon: Clock, className: 'text-amber-500' },
    'Complete': { icon: CheckCircle2, className: 'text-green-600' },
} as const

interface StickyNoteProps {
    id: string
    type?: 'To-Do' | 'In Progress' | 'Complete'
    title?: string
    content?: string

    className?: string
    cellotapeRotateAngle?: string
}

const StickyNote = ({
    id,
    type,
    title,
    content,

    className,
    cellotapeRotateAngle = '5'
}: StickyNoteProps) => {
    const statusMeta = type ? TYPE_META[type] : undefined
    const StatusIcon = statusMeta?.icon

    return (
        <div className={cn('w-fit max-w-[20rem]  p-4 flex flex-col gap-2 relative text-black shadow-md rounded-lg border', className)}>

            <Badge
                className="absolute bg-card/95 text-foreground border border-border/90 -top-5 p-4 left-1/2 font-semibold"
                style={{ transform: `translateX(-50%) rotate(${cellotapeRotateAngle}deg)` }}
            >{`${id}`}</Badge>

            <div className='flex items-center justify-between gap-2'>
                {title && <span className='font-semibold flex-1 line-clamp-1'>{title}</span>}
                {StatusIcon && statusMeta && (
                    <Tooltip>
                        <TooltipTrigger render={<span className="inline-flex shrink-0" />}>
                            <StatusIcon className={cn('size-icon-sm', statusMeta.className)} strokeWidth={ICON_STROKE} />
                        </TooltipTrigger>
                        <TooltipContent>{type}</TooltipContent>
                    </Tooltip>
                )}
            </div>
            {content && <span className='text-xs font-light'>{content}</span>}

        </div>
    )
}

export default StickyNote