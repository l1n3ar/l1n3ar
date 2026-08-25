import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import React from 'react'

interface ScriptKiddieDetailDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const ScriptKiddieDetailDialog = ({
    open,
    onOpenChange
}: ScriptKiddieDetailDialogProps) => {
    return (
        <Dialog>
            <DialogContent>
                <DialogHeader>
                    Script Kiddie
                </DialogHeader>
                <div>
                    Hello
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ScriptKiddieDetailDialog