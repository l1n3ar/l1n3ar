import { type ComponentType } from 'react'
import { LAB_REGISTRY, type LabItemConfig } from '@/data/lab/registry'
import { labSections } from '@/data/lab/items'

function renderItem(item: LabItemConfig) {
    const Component = LAB_REGISTRY[item.component] as ComponentType<any>
    return <Component key={item.id} id={item.id} {...item.props} />
}

export function LabBoard() {
    const notes = labSections.find((section) => section.title === 'Notes')?.items ?? []
    const freeItems = labSections
        .filter((section) => section.title !== 'Notes')
        .flatMap((section) => section.items)

    return (
        <div className="grid grid-cols-1 gap-6 py-4 md:grid-cols-[1fr_2fr]">
            <div className="grid grid-cols-2 content-start gap-6 rounded-xl border border-border bg-card/50 p-4">
                {notes.map(renderItem)}
            </div>

            <div className="columns-1 gap-6 sm:columns-2">
                {freeItems.map((item) => (
                    <div key={item.id} className="mb-6 break-inside-avoid">
                        {renderItem(item)}
                    </div>
                ))}
            </div>
        </div>
    )
}
