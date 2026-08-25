import { useId } from 'react'

export function LabDotPattern() {
    const id = useId()

    return (
        <svg className="pointer-events-none absolute inset-0 -z-10 h-full w-full [mask-image:linear-gradient(to_top_left,white,transparent)]">
            <defs>
                <pattern id={id} width={24} height={24} patternUnits="userSpaceOnUse">
                    <circle cx={1} cy={1} r={1} className="fill-muted-foreground/20" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${id})`} />
        </svg>
    )
}
