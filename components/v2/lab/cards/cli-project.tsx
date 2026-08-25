import { cn } from '@/lib/utils'
import { Terminal } from 'lucide-react'
import { BRAND_ICONS } from '../../tech-icons'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import ScriptKiddieDetailDialog from '../cli-projects/script-kiddie-detail-dialog'
import { useState } from 'react'

interface CliProjectProps {
    id: string
    displayId?: string
    title: string
    repo?: string
    className?: string
}

const CliProject = ({
    id,
    title,
    displayId,
    repo,
    className
}: CliProjectProps) => {

    const [scriptKiddieDialogOpen, setScriptKiddieDialogOpen] = useState(false)

    const handleClick = () => {
        switch (id) {
            case 'script-kiddie':
                setScriptKiddieDialogOpen(true)
        }
    }


    return (
        <>
            <div className={cn('flex items-center justify-between gap-4 bg-codeBlock rounded-lg border shadow-md px-3 py-2', className)}>
                <Terminal className='size-4 text-codeBlock-foreground' />
                <span className='flex-1  text-center text-0_6 text-codeBlock-foreground/60 hover:cursor-pointer hover:underline' onClick={handleClick}>{title}</span>
                <Tooltip>
                    <TooltipTrigger
                        render={
                            <a href={repo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className='text-white' />
                        }
                    >
                        <BRAND_ICONS.github className='size-icon-sm shrink-0' color='currentColor' />
                    </TooltipTrigger>
                    <TooltipContent>Code</TooltipContent>
                </Tooltip>
            </div>

            <ScriptKiddieDetailDialog open={scriptKiddieDialogOpen} onOpenChange={setScriptKiddieDialogOpen} />
        </>

    )
}

export default CliProject
