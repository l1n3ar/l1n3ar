import {
  CaseHeader, CaseBody, CaseHighlights, CaseSection, CaseCode, CaseImage, CaseTable, CaseScreenshots,
} from './base';

const highlights = [
  {
    label: 'RAG',
    body: 'A full retrieval pipeline built in-house: document ingestion, chunking, embedding, and pgvector storage/retrieval, powering semantic search over enterprise knowledge bases, with three retrieval modes depending on how aggressively a given assistant should ground itself.',
  },
  {
    label: 'HITL',
    body: 'A complete human-in-the-loop system for agentic tool calls: real-time approval workflow, inline parameter inspection and editing, and retry/rejection handling, running as a real pause in the execution path, not a log entry after the fact.',
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
  { caption: 'the in-chat approval card: tool name, a live countdown timer, per-argument editing, and approve / reject / cancel actions.' },
  { caption: 'the admin audit log showing a past approval decision (who approved/rejected, what changed, how long it took).' },
  { caption: 'the model catalog / provider admin page, the "any model behind one gateway" story, visually.' },
];

export function PhoenixCaseStudy() {
  return (
    <div>
      <CaseHeader title="phoenix" />

      <CaseBody>
        <CaseHighlights items={highlights} />

        <CaseSection heading="the problem">
          <p>
            Law firms wanted to use generative AI, but couldn&rsquo;t just &ldquo;turn on ChatGPT.&rdquo;
            Every prompt, every document, every model call is a potential privilege or confidentiality
            problem, and the model landscape was (and still is) moving too fast to bet the firm on one
            vendor. What they needed wasn&rsquo;t a chatbot. It was a way to let people across the firm
            actually build and use AI, with a governance layer underneath that a compliance officer could
            sign off on.
          </p>
          <p>
            I joined as employee #1 and owned that layer end to end: the Next.js frontend, the FastAPI
            gateway underneath it, and everything in between: JWT-based auth, session management,
            role-based access control, and the API gateway design itself.
          </p>
        </CaseSection>

        <CaseSection heading="the bet">
          <p>
            Everything the platform does (chat assistants, document review, multi-step agents) flows
            through one gateway. That single decision drives almost everything else:
          </p>
          <p>
            <strong>Bring-your-own model.</strong> Firms connect their own model provider accounts (Azure
            OpenAI, Anthropic, OpenAI, Gemini, and others) and keep the billing relationship, the
            data-processing agreement, and the keys. The platform never becomes the thing standing between
            a firm and its model vendor. It&rsquo;s the routing and governance layer on top.
          </p>
          <p>
            <strong>One audit trail, not N.</strong> Because every call, whether it comes from a simple
            chat app or a multi-step autonomous agent, passes through the same gateway, there&rsquo;s
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
          src="/case-media/phoenix/phoenix-architecture.svg"
          alt="Gateway architecture: apps and orchestrators call a central gateway, which routes to bring-your-own model providers and to a tool/MCP layer; gated tool calls pause for human approval before executing."
        />

        <CaseSection heading="from no-code prototype to a platform we owned">
          <p>
            The first version of the platform was built on a low-code/no-code foundation, the fastest way
            to get something real in front of firms and start learning. It worked, but it had a ceiling:
            every customization was a workaround, performance was someone else&rsquo;s roadmap, and
            &ldquo;enterprise-grade reliability&rdquo; isn&rsquo;t really something you can bolt onto a
            tool that wasn&rsquo;t built for it.
          </p>
          <p>
            I led the migration off that foundation onto a fully in-house platform (the FastAPI gateway,
            the Next.js frontend, the whole request path), trading short-term velocity for the ability to
            actually own the thing we were asking law firms to trust.
          </p>
        </CaseSection>

        <CaseSection heading="the retrieval layer">
          <p>
            RAG here isn&rsquo;t a single &ldquo;upload a PDF&rdquo; button, it&rsquo;s a real pipeline:
            documents get ingested, split into chunks, embedded, and stored in Postgres via pgvector. A
            query gets embedded the same way and matched by cosine distance, with the similarity
            threshold expressed as an actual distance cutoff, since pgvector&rsquo;s cosine distance runs
            0 (identical) to 1 (orthogonal), not the other way around.
          </p>
          <p>
            The same retrieval path serves two different things, not just documents: knowledge-base
            chunks for RAG, and a separate index of past conversation chunks, so an assistant can pull
            relevant history back into context the same way it pulls a relevant paragraph from a filed
            document. Retrieval itself is a per-assistant setting, not a global default: off, always-on
            before every response, or exposed to the model as a callable tool it decides to use. So a
            Creator picks exactly how aggressively a given assistant grounds itself.
          </p>
        </CaseSection>

        <CaseCode>{`query = (
    select(DocumentChunk)
    .where(DocumentChunk.is_deleted == False)
    .order_by(DocumentChunk.embedding.cosine_distance(query_embedding))
    .limit(top_k)
)
if score_threshold:
    max_distance = 1 - score_threshold  # cosine_distance: 0 = identical, 1 = orthogonal
    query = query.where(DocumentChunk.embedding.cosine_distance(query_embedding) <= max_distance)

if rerank_enabled and query_text:
    chunks = await rerank_chunks(query_text, chunks, model="cross-encoder/ms-marco-MiniLM-L-6-v2")`}</CaseCode>

        <CaseSection heading="the part I'm proudest of: the approval gate">
          <p>
            The hardest problem wasn&rsquo;t routing to models. LiteLLM does most of that heavy lifting.
            It was agentic tool calls: once an assistant can call tools (look up a filing, query a
            database, draft a document), a firm needs a real checkpoint before anything happens, not just
            a log entry after the fact.
          </p>
          <p>
            The mechanism: any tool can be flagged as requiring approval, and it&rsquo;s a feature flag
            away from being off entirely, so the data model and admin controls can ship before HITL is
            switched on for any given environment. The gate itself is an async generator that yields
            streaming events on the way to a single final decision: proceed (optionally with
            user-edited arguments), skip, or cancel. The same function drives both the UI update and
            the control flow:
          </p>
        </CaseSection>

        <CaseCode>{`async def gate_tool_call(tool_call, tool, approvals) -> AsyncIterator[StreamingEvent | GateDecision]:
    if not settings.enable_hitl or not tool.requires_approval:
        yield GateDecision(kind="proceed")
        return

    if await approvals.check_auto_approve(tool.id, conversation_id):
        yield StreamingEvent(TOOL_PROGRESS, auto_approved=True)
        yield GateDecision(kind="proceed")
        return

    request, waiter = await approvals.request_approval(tool_call, timeout_seconds=tool.approval_timeout or 300)
    yield StreamingEvent(TOOL_APPROVAL_REQUEST, approval_id=request.id, expires_at=request.expires_at)

    status, modified_args = await approvals.wait_for_approval(request.id, waiter)  # the run blocks here

    if status in (REJECTED, TIMEOUT):
        # a synthetic tool-role reply: the model's next turn still needs a
        # paired tool_use/tool_result even when the call never actually ran
        yield GateDecision(kind="skip", skip_message=synthetic_tool_reply(status))
        return

    yield GateDecision(kind="proceed", modified_args=modified_args)`}</CaseCode>

        <CaseSection heading="the detail that actually matters">
          <p>
            That synthetic reply on rejection or timeout is the part worth calling out: most
            tool-calling LLM APIs require every <code>tool_use</code> to be followed by a matching
            <code>tool_result</code>, or the next turn errors out. A gate that just silently drops a
            rejected call breaks that contract; this one always hands back a reply, so the model knows
            what happened and can keep going instead of the whole run derailing.
          </p>
        </CaseSection>

        <CaseSection heading="orchestration, not just chat">
          <p>
            Any assistant on the platform can be turned into a callable building block for another one. A
            coordinating assistant takes a goal, decides which specialized assistants and tools it needs
            and in what order, and synthesizes their results, instead of a rigid, hand-wired workflow with
            a fixed sequence of steps. Every step still flows through the same gateway, so the audit trail
            and the approval gate apply automatically even to work the platform itself decided to do at
            runtime.
          </p>
        </CaseSection>

        <CaseSection heading="the tool ecosystem">
          <p>
            Beyond the model gateway, the platform hosts a library of tool integrations against real
            legal, regulatory, and financial data sources, running as an internal MCP server platform,
            each tool exposed the same governed way, gated the same way:
          </p>
        </CaseSection>

        <CaseTable rows={toolTable} />

        <CaseSection heading="what shipped">
          <p>
            The platform is SOC 2 Type II audited, runs as a dedicated deployment per customer, and is in
            production use at enterprise law firms today, not a demo, not a pilot that quietly died. It
            survived Lega&rsquo;s acquisition by BARBRI and kept scaling afterward, which is its own kind
            of validation.
          </p>
        </CaseSection>

        <CaseSection heading="what I'd do differently">
          <p>
            Given a second run at it, I&rsquo;d invest earlier in the retrieval layer. The platform
            launched supporting one knowledge source per assistant, and multi-source retrieval had to be
            retrofitted in once real usage showed people wanted to combine collections. I&rsquo;d also push
            for background-job execution as the default sooner rather than later.
          </p>
        </CaseSection>

        {/* <CaseScreenshots items={screenshots} /> */}
      </CaseBody>
    </div>
  );
}
