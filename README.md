<div align="center">

full stack ai systems engineer.

tech @ BARBRI · previously employee #1 @ lega, acquired by BARBRI

[mehulchattopadhyaywork@gmail.com](mailto-mehulchattopadhyaywork@gmail.com) · [linkedin](https-//www.linkedin.com/in/mehulchattopadhyay/)

</div>

<br>

## systems

**phoenix** · lega → barbri, 2024–26 — enterprise ai governance platform, built solo from zero to production
<details><summary>more</summary><br>

every model call from every team routes through one gateway over litellm, gets logged, and any agentic tool call needs human approval before it fires. rag pipeline- document ingestion → chunking → openai embeddings → pgvector storage/retrieval for semantic search over enterprise knowledge bases. externally-reachable mcp server exposing tool connections + knowledge sources. full human-in-the-loop system on agentic tool calls, real-time approval workflows, parameter inspection/editing, retry/rejection before execution. jwt auth, session management, rbac, secure api gateway design. i migrated the entire platform off a low-code/no-code foundation to fully in-house, built to survive an acquisition and keep scaling afterward.
`next.js` `fastapi` `litellm` `pgvector` `openai-embeddings` `mcp` `postgresql` `jwt` `azure`
</details>

**eiger wallet** · tuteck, 2023 — world's first decentralized, quantum-safe cbdc ios wallet, piloted with a swiss central bank
<details><summary>more</summary><br>

a government-backed digital payment system spanning a consumer ios app, a merchant onboarding web app, and a merchant mobile app, designed and piloted with real users rather than launched cold. i built the ios apps and worked with ibm to debug and stabilize the go backend.
`go` `swiftui` `post-quantum-crypto` `docker` `aws`
</details>

**aculead** · tuteck, 2023–24 · [code](https://github.com/l1n3ar/Reverse-Bidding-API) — real-time reverse-bidding marketplace for freight
<details><summary>more</summary><br>

shippers post a load, carriers compete in a live, descending-price auction to win it, running private invite-only pools, an open public market, and direct-assign, all through the same bidding engine, with per-shipper multi-tenant rules underneath.
`fastapi` `python` `postgresql` `redis` `websockets`
</details>

**grocernest** · tuteck, 2022–23 · [code](https://github.com/l1n3ar/Grocernest) — led a team of four building a full-scale grocery e-commerce platform
<details><summary>more</summary><br>

checkout, in-store pos, inventory and grn, delivery-staff operations, and a subscription model, all wired to an automated cashback/referral engine and whatsapp for otps, order updates, and invoices.
`node.js` `express` `sequelize` `mariadb` `aws`
</details>

**contromoist** · tuteck, 2024 · [code](https://github.com/l1n3ar/Contromoist-PA) — owned the backend for an ac installation business, re-platformed off a live legacy erp
<details><summary>more</summary><br>

project management, template-driven quality inspections, and travel expense claims, re-platformed piece by piece without taking the legacy erp's live database offline.
`node.js` `express` `sequelize` `mysql` `jwt`
</details>

**registrum** · conxult innovations, 2022 · [code](https://github.com/l1n3ar/Registrum-API) — blockchain notarization for trademarks and copyrights, on polygon
<details><summary>more</summary><br>

gives a filing an immutable, timestamped proof of ownership by hashing the asset (or the mark's text, for word marks), anchoring that hash on-chain, and issuing a verifiable certificate, without ever putting the underlying document on a public ledger.
`node.js` `express` `web3.js` `polygon` `mongodb` `redis`
</details>

## side projects

[l1n3ar-digest](https://github.com/l1n3ar/l1n3ar-digest) — a news feed that researches and drafts its own entries
[n-way-switch](https://github.com/l1n3ar/shadcn-nway) ([demo](https://shadcn-nway-switch.vercel.app/)) — exclusive-select toggle switch for shadcn
[rota-lms](https://github.com/l1n3ar/rota-lms) — fork, open-source lms (next.js + django)
[trulytrue-web](https://github.com/l1n3ar/trulytrue-web) — fork, community-driven scam-detection db

