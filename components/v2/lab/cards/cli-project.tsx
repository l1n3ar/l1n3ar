import { cn } from '@/lib/utils'
import { Terminal } from 'lucide-react'
import { BRAND_ICONS } from '../../tech-icons'

interface CliProjectProps {
    id: string
    title: string
    repo?: string
    onOpen?: () => void

    className?: string
}

const CliProject = ({
    id,
    title,
    repo,
    onOpen,
    className
}: CliProjectProps) => {
    return (
       
            <div className={cn('flex items-center justify-between gap-4 bg-codeBlock rounded-lg border shadow-md px-3 py-2', className)}>
                <Terminal className='size-4 text-codeBlock-foreground'/>
                <span className='flex-1  text-center text-0_6 text-codeBlock-foreground/60 hover:cursor-pointer hover:underline' onClick={onOpen}>{title}</span>
                <a href={repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='text-white'>
                    <BRAND_ICONS.github className='size-icon-sm shrink-0' color='currentColor' />
                </a>
            </div>
      
    )
}

export default CliProject
