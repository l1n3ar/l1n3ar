---
name: phoenix
org: lega → barbri
year: "2024—26"
role: employee #1 · architect · 0→1
line: enterprise ai governance. any model behind one gateway, every call logged, every agentic tool call approved by a human before it fires.
tech: [next.js, fastapi, litellm, pgvector, mcp, postgres, azure]
github: https://github.com/example/phoenix
demo: https://lega.ai
metrics:
  - key: org
    value: "lega → barbri"
  - key: year
    value: "2024—26"
  - key: role
    value: "employee #1 · architect · 0→1"
order: 1
featured: true
asks:
  - "how does the approval gate work?"
  - "what stopped this from becoming another chatbot wrapper?"
---

Replace this with the real write-up. Two or three short paragraphs — the problem, the decision that mattered, what shipped.

![architecture diagram](/case-media/phoenix-arch.png)

```python
# replace with a real snippet — the piece you're proudest of
async def approve_tool_call(call: ToolCall) -> ToolResult:
    review = await hitl_queue.enqueue(call)
    if review.decision != "approve":
        return ToolResult.rejected(review.reason)
    return await execute(call.with_params(review.edited_params))
```

![product screenshot](/case-media/phoenix-screen.png)

Close with the result: what changed, what you'd do differently.
