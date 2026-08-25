import type { ReactNode } from 'react'
import { Circle, Clock } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ICON_STROKE } from '@/components/v2/constants'
import { cn } from '@/lib/utils'

export type LabItemStatus = 'To-Do' | 'In Progress' | 'Complete'

const STATUS_ICONS = {
    'To-Do': { icon: Circle, className: 'text-muted-foreground' },
    'In Progress': { icon: Clock, className: 'text-amber-500' },
} as const

interface StatusIndicatorProps {
    status?: LabItemStatus
    completeIndicator: ReactNode
}

export function StatusIndicator({ status, completeIndicator }: StatusIndicatorProps) {
    if (!status) return null

    return (
        <Tooltip>
            <TooltipTrigger render={<span className="inline-flex shrink-0" />}>
                {status === 'Complete' ? completeIndicator : <StatusIcon status={status} />}
            </TooltipTrigger>
            <TooltipContent>{status}</TooltipContent>
        </Tooltip>
    )
}

function StatusIcon({ status }: { status: Exclude<LabItemStatus, 'Complete'> }) {
    const { icon: Icon, className } = STATUS_ICONS[status]
    return <Icon className={cn('size-icon-sm', className)} strokeWidth={ICON_STROKE} />
}
