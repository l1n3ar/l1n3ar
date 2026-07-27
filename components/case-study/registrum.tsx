import { CaseHeader, CaseBody, CaseHighlights, CaseSection, CaseCode } from './base';

const highlights = [
  {
    label: 'hash it, never store it',
    body: 'Only a SHA-256 hash and a small canonical-JSON proof ever reach the blockchain — the trademark filing or copyright itself stays off-chain entirely, so proof of ownership doesn’t mean publishing the work.',
  },
  {
    label: 'word marks, not just files',
    body: 'A word mark isn’t a file to hash — it’s a phrase. The same notarization pipeline canonicalizes and hashes the mark’s text itself, so a wordmark gets the identical on-chain proof a logo or document does.',
  },
  {
    label: 'register, verify, transfer',
    body: 'The full lifecycle lives on-chain: register a new filing, verify an existing one’s integrity against its hash, and transfer ownership — all through the same small smart contract.',
  },
];

export function RegistrumCaseStudy() {
  return (
    <div>
      <CaseHeader title="registrum" />

      <CaseBody>
        <CaseHighlights items={highlights} />

        <CaseSection heading="the brief">
          <p>
            Proving you filed a trademark or copyright first has traditionally meant trusting a
            centralized registry&rsquo;s paperwork and timestamps. Registrum&rsquo;s bet was that a
            blockchain could give the same proof — cheaper, faster, and without trusting any single
            registrar&rsquo;s records — by anchoring an immutable, timestamped hash of the filing on-chain
            instead. I was technical lead on it.
          </p>
        </CaseSection>

        <CaseSection heading="what actually gets notarized">
          <p>
            A filing — a logo, a document, a piece of creative work — gets hashed with SHA-256. That
            asset hash is checked against existing filings for an exact match before anything else
            happens, then combined with a small canonicalized metadata envelope (owner, filing type,
            registration date) into a second &ldquo;proof hash.&rdquo; Both hashes get written to a smart
            contract on Polygon, and the original file goes to encrypted object storage — never onto the
            chain itself. A word mark, which isn&rsquo;t a file at all, goes through the same pipeline by
            canonicalizing and hashing the mark&rsquo;s text instead of a document — one notarization
            scheme covers both cases.
          </p>
        </CaseSection>

        <CaseCode>{`assetHash   := sha256(file)                       // or sha256(canonicalize({ phrase }))
proofHash   := sha256(canonicalize({ assetHash, owner, filingType, registeredAt }))
contract.registerDocument(assetHash, proofHash)    // only the hashes ever reach the chain`}</CaseCode>

        <CaseSection heading="why hash-only">
          <p>
            Putting a whole document on a public chain is expensive and, for anything a client doesn&rsquo;t
            want public, a non-starter. A hash gives the same guarantee that actually matters — an
            immutable, timestamped, tamper-evident record that this exact content existed at this exact
            moment — at a fraction of the cost, without exposing the work itself. Verifying later is just
            re-hashing the file and checking it against what&rsquo;s on-chain; if they match, the filing is
            provably untouched since registration.
          </p>
        </CaseSection>

        <CaseSection heading="certificates people can actually check">
          <p>
            Registration produces a downloadable, QR-coded certificate — scan it and you land on a
            verification page that re-derives the hash and confirms it against the chain, so ownership
            isn&rsquo;t just an internal database record, it&rsquo;s independently checkable by anyone with
            the certificate. Ownership transfer is a first-class on-chain operation too, not a database
            update pretending to be one.
          </p>
        </CaseSection>

        <CaseSection heading="what I'd do differently">
          <p>
            The one thing I&rsquo;d genuinely go back and fix: the service that signs on-chain
            transactions had a private key committed directly in the codebase, sitting right next to my
            own &ldquo;TODO: remove private key&rdquo; comment. It&rsquo;s exactly the kind of shortcut
            that&rsquo;s obvious in hindsight and easy to take when you&rsquo;re moving fast early on —
            and it&rsquo;s shaped how I treat secrets in every codebase since: never committed, not even
            for a day, not even as a TODO.
          </p>
        </CaseSection>
      </CaseBody>
    </div>
  );
}
