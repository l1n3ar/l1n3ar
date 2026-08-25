import { type ComponentType } from 'react'
import { LAB_REGISTRY } from '@/data/lab/registry'
import { labSections } from '@/data/lab/items'

export function LabBento() {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            {labSections.map((section, i) => (
                <div
                    key={section.title}
                    className={i === labSections.length - 1 ? 'md:col-span-12 flex flex-col gap-3 rounded-xl border border-border bg-card/50 p-4' : 'md:col-span-6 flex flex-col gap-3 rounded-xl border border-border bg-card/50 p-4'}
                >
                    {/* <span className="text-0_6 font-semibold uppercase tracking-wide text-muted-foreground">{section.title}</span> */}
                    <div className="flex flex-wrap gap-3">
                        {section.items.map((item) => {
                            const Component = LAB_REGISTRY[item.component] as ComponentType<any>
                            return <Component key={item.id} id={item.id} {...item.props} />
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}
