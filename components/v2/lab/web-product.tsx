import { Badge } from '@/components/ui/badge'
import { StatusIndicator, type LabItemStatus } from '@/components/v2/lab/status-indicator'
import { LiveDot } from '@/components/v2/live-dot'
import { ICON_STROKE } from '@/components/v2/constants'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface WebProductProps {
    id: string
    title: string
    url?: string
    description?: string
    type?: LabItemStatus
    icon?: LucideIcon
    techStack?: string[]

    className?: string
}

const WINDOW_DOT_COLORS = ['bg-red-500', 'bg-yellow-500', 'bg-green-500']

const WebProduct = ({
    id,
    title,
    url,
    description,
    type,
    icon: Icon,
    techStack,
    className
}: WebProductProps) => {
    return (
        <div className={cn('flex w-fit  flex-col overflow-hidden rounded-lg border border-border shadow-md', className)}>

            <div className='flex items-center justify-between gap-4  bg-muted px-3 py-2'>
                <div className='flex  items-center gap-1.5'>
                    {WINDOW_DOT_COLORS.map((color) => (
                        <span key={color} className={cn('size-2 rounded-full', color)} />
                    ))}
                </div>
                <span className='flex-1 text-center text-0_6  hover:underline hover:cursor-pointer'><a href={url} className='text-muted-foreground hover:text-foreground'>{url}</a></span>
                <span className='truncate text-0_6 text-muted-foreground'>{id}</span>
            </div>

            <div className='flex flex-col gap-2 p-4'>
                <div className='flex items-center justify-between gap-2'>
                    <div className='flex min-w-0 items-center gap-2'>
                        {Icon && <Icon className='size-icon-sm shrink-0' strokeWidth={ICON_STROKE} />}
                        <span className='truncate font-semibold'>{title}</span>
                    </div>
                    <StatusIndicator status={type} completeIndicator={<LiveDot />} />
                </div>

                {description && <p className='text-xs max-w-[20rem] line-clamp-2 font-light text-muted-foreground'>{description}</p>}

                {techStack && techStack.length > 0 && (
                    <div className='flex flex-wrap gap-1.5 mt-2'>
                        {techStack.map((tech) => (
                            <Badge key={tech} variant='secondary' className='text-[0.6rem] border'>{tech}</Badge>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default WebProduct
