import type { ComponentProps } from 'react'
import StickyNote from '@/components/v2/lab/sticky-note'
import WebProduct from '@/components/v2/lab/web-product'
import CliProject from '@/components/v2/lab/cli-project'

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
    props: LabComponentProps<T>
} : never
