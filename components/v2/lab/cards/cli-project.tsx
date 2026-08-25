import { Badge } from '@/components/ui/badge'
import { StatusIndicator, type LabItemStatus } from '@/components/v2/lab/status-indicator'
import { LiveDot } from '@/components/v2/live-dot'
import { ICON_STROKE } from '@/components/v2/constants'
import { cn } from '@/lib/utils'
import { LucideIcon, Terminal } from 'lucide-react'
import { BRAND_ICONS } from '../../tech-icons'

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
        <div className={cn('flex w-fit flex-col overflow-hidden rounded-lg border border-border bg-codeBlock text-codeBlock-foreground shadow-md', className)}>

            <div className='flex items-center justify-between gap-4 bg-black/20 px-3 py-2'>
                <div className='flex  items-center gap-1.5'>
                    {WINDOW_DOT_COLORS.map((color) => (
                        <span key={color} className={cn('size-2 rounded-full', color)} />
                    ))}
                </div>
                <span className='flex-1  text-center text-0_6 text-codeBlock-foreground/60'>{title}</span>

                <a href={repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='text-white'>
                    <BRAND_ICONS.github className='size-icon-sm shrink-0' color='currentColor' />
                </a>


            </div>

            <div className='flex flex-col gap-2 p-4'>
                <div className='flex items-center justify-between gap-2'>
                    <div className='flex min-w-0 items-center gap-2'>

                    </div>
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
