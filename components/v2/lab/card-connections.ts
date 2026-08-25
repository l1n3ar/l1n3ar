interface LabConnection {
    from: string
    to: string
}

export const CONNECTIONS: LabConnection[] = [
    { from: 'shad-note', to: 'shad' },
    { from: 'script-kiddie-note', to: 'script-kiddie' },
]