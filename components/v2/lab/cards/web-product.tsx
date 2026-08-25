import { cn } from '@/lib/utils'
import { BRAND_ICONS } from '../../tech-icons'
import { Globe } from 'lucide-react'

interface WebProductProps {
    id: string
    displayId? : string
    url?: string
    repo?: string

    className?: string
}

const WebProduct = ({
    id,
    displayId,
    url,
    repo,

    className
}: WebProductProps) => {
    return (
        <div className='flex items-center justify-between gap-4 bg-muted px-3 py-2 rounded-lg border border-border text-card-foreground shadow-md'>
            <Globe className='size-4 text-muted-foreground'/>
            <a href={url} className='text-muted-foreground hover:text-foreground flex-1 text-center text-0_6 line-clamp-1 hover:underline'>
                {url}
            </a>

            <a href={repo}
                target="_blank"
                rel="noopener noreferrer"
                className='text-black dark:text-white'>
                <BRAND_ICONS.github className='size-icon-sm shrink-0' color='currentColor' />
            </a>


        </div>


    )
}

export default WebProduct
