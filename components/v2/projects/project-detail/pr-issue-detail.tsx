'use client'

import { useEffect, useState } from 'react'
import { GitMerge, GitPullRequest, GitPullRequestClosed, Loader2 } from 'lucide-react'
import { getGithubPullRequests, type GithubPrStatus, type GithubPullRequest } from '@/actions/github'
import { ICON_STROKE } from '@/components/v2/constants'
import { Project } from '@/lib/types'

const STATUS_STYLE: Record<GithubPrStatus, { icon: typeof GitPullRequest; className: string }> = {
    open: { icon: GitPullRequest, className: 'text-emerald-600 bg-emerald-600/10' },
    merged: { icon: GitMerge, className: 'text-violet-600 bg-violet-600/10' },
    closed: { icon: GitPullRequestClosed, className: 'text-red-600 bg-red-600/10' },
}

const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const PrAndIssues = ({ project }: { project: Project }) => {
    const [pullRequests, setPullRequests] = useState<GithubPullRequest[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const repos = project.repos ?? []

    useEffect(() => {
        if (repos.length === 0) {
            setLoading(false)
            return
        }

        let active = true
        setLoading(true)
        setError(null)

        getGithubPullRequests(repos).then((result) => {
            if (!active) return
            if (result.ok) {
                setPullRequests(result.pullRequests)
            } else {
                setError(result.error)
            }
            setLoading(false)
        })

        return () => {
            active = false
        }
    }, [repos])

    if (repos.length === 0) return null

    if (error) return <p className="text-0_7 text-muted-foreground">Couldn&apos;t load pull requests: {error}</p>

    return (
        <div className="border-t border-border pt-4">
            <h2 className="text-0_9 font-semibold mb-3">My PRs</h2>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> :
            (<ul className="flex flex-col gap-2">
                {pullRequests.map((pr) => {
                    const { icon: StatusIcon, className } = STATUS_STYLE[pr.status]
                    return (
                        <li key={`${pr.repoLabel}-${pr.number}`}>
                            <a
                                href={pr.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-2 text-0_7 text-foreground hover:underline"
                            >
                                <span className={`size-icon-lg shrink-0 rounded-md flex items-center justify-center ${className}`}>
                                    <StatusIcon className="size-icon-xs" strokeWidth={ICON_STROKE} />
                                </span>
                                  <span className="flex-1">{pr.title}</span>
                                <span className="text-0_6 shrink-0 px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                    {pr.repoName}
                                </span>
                              
                                {/* <span className="text-muted-foreground">#{pr.number}</span> */}
                                <span className="text-0_6 text-muted-foreground shrink-0">{dateFormatter.format(new Date(pr.createdAt))}</span>
                            </a>
                        </li>
                    )
                })}
            </ul>)}
        </div>
    )
}

export default PrAndIssues
