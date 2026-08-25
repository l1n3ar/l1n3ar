import type { ComponentProps } from 'react'
import type { LabPosition } from '@/actions/lab'
import StickyNote from '@/components/v2/lab/cards/sticky-note'
import WebProduct from '@/components/v2/lab/cards/web-product'
import CliProject from '@/components/v2/lab/cards/cli-project'

export const LAB_REGISTRY = {
    'sticky-note': StickyNote,
    'web-product': WebProduct,
    'cli-project': CliProject,
} as const

export type LabComponentType = keyof typeof LAB_REGISTRY

type LabComponentProps<T extends LabComponentType> = Omit<ComponentProps<typeof LAB_REGISTRY[T]>, 'id'>

export type LabItemConfig<T extends LabComponentType = LabComponentType> = T extends T ? {
    id: string
    component: T
    defaultPosition?: LabPosition
    props: LabComponentProps<T>
} : never
