'use client'

import { useEffect, useState, type KeyboardEvent } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { getGithubDirectory, getGithubFileContent } from '@/actions/github'

interface ScriptKiddieDetailDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const OWNER = 'l1n3ar'
const REPO = 'script-kiddie'

function resolvePath(cwd: string, arg?: string): string {
    if (!arg || arg === '.') return cwd
    if (arg === '..') return cwd.split('/').slice(0, -1).join('/')
    return cwd ? `${cwd}/${arg}` : arg
}

interface Line {
    type: 'prompt' | 'output' | 'error'
    text: string
}

const ScriptKiddieDetailDialog = ({ open, onOpenChange }: ScriptKiddieDetailDialogProps) => {
    const [cwd, setCwd] = useState('')
    const [input, setInput] = useState('')
    const [lines, setLines] = useState<Line[]>([])
    const [lastCatted, setLastCatted] = useState<string | null>(null)

    async function run(raw: string) {
        const command = raw.trim()
        if (!command) return

        const [cmd, arg] = command.split(/\s+/)

        if (cmd === 'clear') {
            setLines([])
            return
        }

        let output = ''
        let isError = false

        if (cmd === 'ls') {
            const result = await getGithubDirectory(OWNER, REPO, resolvePath(cwd, arg))
            if (result.ok) output = result.entries.map((e) => (e.type === 'dir' ? `${e.name}/` : e.name)).join('  ')
            else { output = result.error; isError = true }
        } else if (cmd === 'cd') {
            const path = resolvePath(cwd, arg)
            const result = await getGithubDirectory(OWNER, REPO, path)
            if (result.ok) setCwd(path)
            else { output = result.error; isError = true }
        } else if (cmd === 'cat') {
            if (!arg) {
                output = 'usage: cat <file>'
                isError = true
            } else {
                const result = await getGithubFileContent(OWNER, REPO, resolvePath(cwd, arg))
                if (result.ok) { output = result.content; setLastCatted(result.content) }
                else { output = result.error; isError = true }
            }
        } else if (cmd === 'cp') {
            if (!lastCatted) {
                output = 'nothing to copy, cat a file first'
                isError = true
            } else {
                await navigator.clipboard.writeText(lastCatted)
                output = 'copied to clipboard'
            }
        } else {
            output = `command not found: ${cmd}`
            isError = true
        }

        setLines((prev) => [
            ...prev,
            { type: 'prompt', text: `${cwd || '~'} $ ${command}` },
            ...(output ? [{ type: isError ? 'error' : 'output', text: output } as Line] : []),
        ])
    }

    useEffect(() => {
        if (open && lines.length === 0) run('ls')
    }, [open])

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            run(input)
            setInput('')
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='flex h-[32rem] max-w-2xl flex-col overflow-hidden bg-codeBlock p-0 font-mono text-xs text-codeBlock-foreground'>
                <div className='terminal-scroll flex-1 overflow-y-auto whitespace-pre-wrap p-4'>
                    {lines.map((line, i) => (
                        <div
                            key={i}
                            className={
                                line.type === 'prompt'
                                    ? 'text-emerald-400'
                                    : line.type === 'error'
                                        ? 'text-red-400'
                                        : 'text-codeBlock-foreground/80'
                            }
                        >
                            {line.text}
                        </div>
                    ))}
                </div>
                <div className='flex items-center gap-2 border-t border-codeBlock-foreground/10 bg-black/20 px-4 py-3'>
                    <span className='text-emerald-400'>{cwd || '~'} $</span>
                    <input
                        autoFocus
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className='flex-1 bg-transparent text-codeBlock-foreground placeholder:text-codeBlock-foreground/40 outline-none'
                        placeholder='ls, cat <file>, cd <dir>, cp, clear'
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ScriptKiddieDetailDialog
