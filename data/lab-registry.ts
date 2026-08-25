import type { ComponentProps } from 'react'
import type { LabPosition } from '@/actions/lab'
import StickyNote from '@/components/v2/lab/sticky-note'

export const LAB_REGISTRY = {
    'sticky-note': StickyNote,
} as const

export type LabComponentType = keyof typeof LAB_REGISTRY

type LabComponentProps<T extends LabComponentType> = Omit<ComponentProps<typeof LAB_REGISTRY[T]>, 'id'>

export type LabItemConfig = {
    [T in LabComponentType]: {
        id: string
        component: T
        defaultPosition: LabPosition
        props: LabComponentProps<T>
    }
}[LabComponentType]
