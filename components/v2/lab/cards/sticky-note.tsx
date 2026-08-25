import { Badge } from '@/components/ui/badge'
import { StatusIndicator, type LabItemStatus } from '@/components/v2/lab/status-indicator'
import { ICON_STROKE } from '@/components/v2/constants'
import { cn } from '@/lib/utils'
import { CheckCircle2 } from 'lucide-react'

interface StickyNoteProps {
    id: string
    displayId? : string
    type?: LabItemStatus
    title?: string
    content?: string

    className?: string
    cellotapeRotateAngle?: string
    showId?: boolean
}

const StickyNote = ({
    id,
    displayId,
    type,
    title,
    content,

    className,
    cellotapeRotateAngle = '5',
    showId = false
}: StickyNoteProps) => {
    return (
        <div className={cn('w-fit max-w-[20rem]  p-4 flex flex-col gap-2 relative text-black shadow-md rounded-lg border', className)}>

            {showId && (
                <Badge
                    className="absolute bg-card/95 text-foreground border border-border/90 -top-5 p-4 left-1/2 font-semibold text-[0.7rem]"
                    style={{ transform: `translateX(-50%) rotate(${cellotapeRotateAngle}deg)` }}
                >{`${displayId}`}</Badge>
            )}

            <div className='flex items-center justify-between gap-2'>
                {title && <span className='font-semibold flex-1 line-clamp-1'>{title}</span>}
                <StatusIndicator
                    status={type}
                    completeIndicator={<CheckCircle2 className='size-icon-sm text-green-600' strokeWidth={ICON_STROKE} />}
                />
            </div>
            {content && <span className='text-xs font-light'>{content}</span>}

        </div>
    )
}

export default StickyNote
