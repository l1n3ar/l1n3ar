import { Badge } from '@/components/ui/badge'
import { StatusIndicator, type LabItemStatus } from '@/components/v2/lab/status-indicator'
import { LiveDot } from '@/components/v2/live-dot'
import { ICON_STROKE } from '@/components/v2/constants'
import { cn } from '@/lib/utils'
import { LucideIcon, Terminal } from 'lucide-react'

interface CliProjectProps {
    id: string
    title: string
    repo?: string
    description?: string
    type?: LabItemStatus
    icon?: LucideIcon
    techStack?: string[]

    className?: string
}

const WINDOW_DOT_COLORS = ['bg-red-500', 'bg-yellow-500', 'bg-green-500']

const CliProject = ({
    id,
    title,
    repo,
    description,
    type,
    icon: Icon = Terminal,
    techStack,
    className
}: CliProjectProps) => {
    return (
        <div className={cn('flex w-fit max-w-[20rem] flex-col overflow-hidden rounded-lg border border-border bg-codeBlock text-codeBlock-foreground shadow-md', className)}>

            <div className='flex items-center gap-2 bg-black/20 px-3 py-2'>
                <div className='flex flex-1 items-center gap-1.5'>
                    {WINDOW_DOT_COLORS.map((color) => (
                        <span key={color} className={cn('size-2 rounded-full', color)} />
                    ))}
                </div>
                <span className='flex-1 truncate text-center text-0_6 text-codeBlock-foreground/60'>{repo}</span>
                <div className='flex flex-1 justify-end'>
                    <span className='truncate text-0_6 text-codeBlock-foreground/60'>{id}</span>
                </div>
            </div>

            <div className='flex flex-col gap-2 p-4'>
                <div className='flex items-center justify-between gap-2'>
                    <div className='flex min-w-0 items-center gap-2'>
                        <Icon className='size-icon-sm shrink-0' strokeWidth={ICON_STROKE} />
                        <span className='truncate font-semibold'>{title}</span>
                    </div>
                    <StatusIndicator status={type} completeIndicator={<LiveDot />} />
                </div>

                {description && <p className='text-xs font-light text-codeBlock-foreground/70'>{description}</p>}

                {techStack && techStack.length > 0 && (
                    <div className='flex flex-wrap gap-1.5'>
                        {techStack.map((tech) => (
                            <Badge key={tech} variant='outline' className='border-codeBlock-foreground/20 text-codeBlock-foreground/80 text-[0.6rem]'>{tech}</Badge>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CliProject
