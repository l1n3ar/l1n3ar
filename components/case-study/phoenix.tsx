import {
  CaseHeader, CaseBody, CaseHighlights, CaseSection, CaseCode, CaseImage, CaseTable, CaseScreenshots,
} from './base';

const highlights = [
  {
    label: 'RAG',
    body: 'A full retrieval pipeline built in-house — document ingestion, chunking, embedding, and pgvector storage/retrieval — powering semantic search over enterprise knowledge bases, with three retrieval modes depending on how aggressively a given assistant should ground itself.',
  },
  {
    label: 'HITL',
    body: 'A complete human-in-the-loop system for agentic tool calls — real-time approval workflow, inline parameter inspection and editing, and retry/rejection handling — running as a real pause in the execution path, not a log entry after the fact.',
  },
  {
    label: 'MCP',
    body: 'An internal MCP server platform hosting dozens of governed tool integrations across legal, financial, and regulatory data sources, each gated by the same per-tenant allowlist and the same approval flow as everything else.',
  },
];

const toolTable = [
  { label: 'SEC EDGAR', description: 'filings, financial statements, insider transactions', count: 21 },
  { label: 'USPTO', description: 'patent search, filing retrieval, PDF download', count: 33 },
  { label: 'UniCourt', description: 'case search, court data, litigation analytics', count: 18 },
  { label: 'Congress.gov', description: 'bills, resolutions, statutes, committee reports', count: 17 },
  { label: 'Companies House', description: 'UK company register, directors, filings', count: 10 },
  { label: 'CourtListener', description: 'federal/state case law, opinions, filings', count: 9 },
  { label: 'CanLII', description: 'Canadian case law and legislation', count: 8 },
  { label: 'FRED', description: 'Federal Reserve economic data', count: 8 },
  { label: 'openFDA', description: 'drug/device/food recalls and labeling', count: 6 },
  { label: 'Alpha Vantage', description: 'real-time market data', count: 4 },
];

const screenshots = [
  { caption: 'the in-chat approval card — tool name, a live countdown timer, per-argument editing, and approve / reject / cancel actions.' },
  { caption: 'the admin audit log showing a past approval decision (who approved/rejected, what changed, how long it took).' },
  { caption: 'the model catalog / provider admin page — the "any model behind one gateway" story, visually.' },
];

export function PhoenixCaseStudy() {
  return (
    <div>
      <CaseHeader org="lega → barbri" year="2024—26" title="phoenix" role="employee #1 · architect · 0→1" />

      <CaseBody>
        <CaseHighlights items={highlights} />

        <CaseSection heading="the problem">
          <p>
            Law firms wanted to use generative AI, but couldn&rsquo;t just &ldquo;turn on ChatGPT&rdquo; —
            every prompt, every document, every model call is a potential privilege or confidentiality
            problem, and the model landscape was (and still is) moving too fast to bet the firm on one
            vendor. What they needed wasn&rsquo;t a chatbot. It was a way to let people across the firm
            actually build and use AI, with a governance layer underneath that a compliance officer could
            sign off on.
          </p>
          <p>
            I joined as employee #1 and owned that layer end to end — the Next.js frontend, the FastAPI
            gateway underneath it, and everything in between: JWT-based auth, session management,
            role-based access control, and the API gateway design itself.
          </p>
        </CaseSection>

        <CaseSection heading="the bet">
          <p>
            Everything the platform does — chat assistants, document review, multi-step agents — flows
            through one gateway. That single decision drives almost everything else:
          </p>
          <p>
            <strong>Bring-your-own model.</strong> Firms connect their own model provider accounts (Azure
            OpenAI, Anthropic, OpenAI, Gemini, and others) and keep the billing relationship, the
            data-processing agreement, and the keys. The platform never becomes the thing standing between
            a firm and its model vendor — it&rsquo;s the routing and governance layer on top.
          </p>
          <p>
            <strong>One audit trail, not N.</strong> Because every call — whether it comes from a simple
            chat app or a multi-step autonomous agent — passes through the same gateway, there&rsquo;s
            exactly one place that logs prompts, responses, token/cost accounting, and (for agent runs) the
            full reasoning-and-tool-call chain.
          </p>
          <p>
            <strong>Governance as a property of the request, not a bolt-on.</strong> Policy scanning,
            role-based access, and tool approval are enforced <em>in</em> the gateway path, not as a
            separate audit step run after the fact.
          </p>
        </CaseSection>

        <CaseImage
          src="/case-media/phoenix-architecture.svg"
          alt="Gateway architecture: apps and orchestrators call a central gateway, which routes to bring-your-own model providers and to a tool/MCP layer; gated tool calls pause for human approval before executing."
        />

        <CaseSection heading="from no-code prototype to a platform we owned">
          <p>
            The first version of the platform was built on a low-code/no-code foundation — the fastest way
            to get something real in front of firms and start learning. It worked, but it had a ceiling:
            every customization was a workaround, performance was someone else&rsquo;s roadmap, and
            &ldquo;enterprise-grade reliability&rdquo; isn&rsquo;t really something you can bolt onto a
            tool that wasn&rsquo;t built for it.
          </p>
          <p>
            I led the migration off that foundation onto a fully in-house platform — the FastAPI gateway,
            the Next.js frontend, the whole request path — trading short-term velocity for the ability to
            actually own the thing we were asking law firms to trust.
          </p>
        </CaseSection>

        <CaseSection heading="the retrieval layer">
          <p>
            RAG here isn&rsquo;t a single &ldquo;upload a PDF&rdquo; button — it&rsquo;s a real pipeline:
            documents get ingested, split into chunks, embedded, and stored in Postgres via pgvector; a
            query gets embedded the same way and matched by cosine distance, with an optional
            cross-encoder reranking pass before anything reaches the model. Retrieval runs in one of three
            modes depending on the assistant — off, always-on before every response, or exposed to the
            model as a callable tool it decides to use.
          </p>
        </CaseSection>

        <CaseSection heading="the part I'm proudest of: the approval gate">
          <p>
            The hardest problem wasn&rsquo;t routing to models — LiteLLM does most of that heavy lifting.
            It was agentic tool calls: once an assistant can call tools (look up a filing, query a
            database, draft a document), a firm needs a real checkpoint before anything happens, not just
            a log entry after the fact.
          </p>
          <p>
            The mechanism, generically: any tool can be flagged as requiring approval. When a gated tool
            call is about to fire, the run pauses, an approval request is created with a timeout, and the
            client is notified in real time over the same streaming connection the response is already
            using. The person in the loop sees the tool name and its arguments, can edit them inline, and
            can approve, reject, or cancel the whole run.
          </p>
        </CaseSection>

        <CaseCode>{`async def dispatch_tool_call(call, policy):
    if not policy.requires_approval(call.tool):
        return await execute(call)

    request = await approvals.create(call, timeout_seconds=300)
    await stream_to_client(ToolApprovalRequested(request))

    decision = await approvals.wait_for(request.id)  # the agent run blocks here
    if decision.action == "reject":
        return ToolResult.rejected(decision.reason)
    if decision.action == "modify":
        call = call.with_args(decision.edited_args)

    return await execute(call)`}</CaseCode>

        <CaseSection heading="orchestration, not just chat">
          <p>
            Any assistant on the platform can be turned into a callable building block for another one. A
            coordinating assistant takes a goal, decides which specialized assistants and tools it needs
            and in what order, and synthesizes their results — instead of a rigid, hand-wired workflow with
            a fixed sequence of steps. Every step still flows through the same gateway, so the audit trail
            and the approval gate apply automatically even to work the platform itself decided to do at
            runtime.
          </p>
        </CaseSection>

        <CaseSection heading="the tool ecosystem">
          <p>
            Beyond the model gateway, the platform hosts a library of tool integrations against real
            legal, regulatory, and financial data sources, running as an internal MCP server platform —
            each tool exposed the same governed way, gated the same way:
          </p>
        </CaseSection>

        <CaseTable rows={toolTable} />

        <CaseSection heading="what shipped">
          <p>
            The platform is SOC 2 Type II audited, runs as a dedicated deployment per customer, and is in
            production use at enterprise law firms today — not a demo, not a pilot that quietly died. It
            survived Lega&rsquo;s acquisition by BARBRI and kept scaling afterward, which is its own kind
            of validation.
          </p>
        </CaseSection>

        <CaseSection heading="what I'd do differently">
          <p>
            Given a second run at it, I&rsquo;d invest earlier in the retrieval layer — the platform
            launched supporting one knowledge source per assistant, and multi-source retrieval had to be
            retrofitted in once real usage showed people wanted to combine collections. I&rsquo;d also push
            for background-job execution as the default sooner rather than later.
          </p>
        </CaseSection>

        <CaseScreenshots items={screenshots} />
      </CaseBody>
    </div>
  );
}
