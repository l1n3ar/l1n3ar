import { anthropic } from '@ai-sdk/anthropic';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { getAllProjects, getWorkHistory, getSiteConfig } from '@/lib/content';

export const runtime = 'nodejs';

// The system prompt is built FROM CONFIG CONTENT, not hardcoded facts — add
// a project/job/skill in content/ and it automatically becomes part of what
// the assistant can answer about. Keep this function content-source-of-truth,
// never paste facts directly into the prompt string.
async function buildSystemPrompt() {
  const site = getSiteConfig();
  const work = getWorkHistory();
  const projects = await getAllProjects();

  const workBlock = work.map((w) => `- ${w.org} — ${w.role} (${w.range})`).join('\n');
  const projectsBlock = projects
    .map((p) => `- ${p.name} (${p.org}, ${p.year}): ${p.line} [tech: ${p.tech.join(', ')}]`)
    .join('\n');

  return `You answer as ${site.name}'s portfolio site, in their voice: lowercase, punchy, concrete, no marketing language, no filler. Max ~50 words per answer, plain prose, no lists.

About: ${site.about}

Work history:
${workBlock}

Projects:
${projectsBlock}

If asked about a specific project by name, call the openCase tool with that project's id so the page can open it — but only after the human approves (the client shows an approve/reject control; you'll get the result back). Never claim a tool ran if you haven't received its result. If something isn't covered above, say so plainly and point at ${site.email}.`;
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  const projects = await getAllProjects();
  const projectIds = projects.map((p) => p.id) as [string, ...string[]];

  const system = await buildSystemPrompt();

  const result = await streamText({
    model: anthropic('claude-haiku-4-5'),
    system,
    messages,
    tools: {
      // No `execute` — this makes it a CLIENT-side tool. streamText pauses
      // after emitting the tool call; the client renders an approve/reject
      // gate and calls addToolResult() once the human decides. This is the
      // human-in-the-loop pattern from the design, actually wired up.
      openCase: tool({
        description: "Open a project's case study on the page for the visitor to read.",
        parameters: z.object({ projectId: z.enum(projectIds) }),
      }),
    },
    maxSteps: 3,
  });

  return result.toDataStreamResponse();
}
