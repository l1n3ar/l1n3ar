import { CaseHeader, CaseBody, CaseHighlights, CaseSection, CaseImage, CaseCode } from './base';

const highlights = [
  {
    label: 'blind signatures & digital cash',
    body: 'Built the client-side protocol around a post-quantum blind-signature scheme — generating and hashing coin serial numbers, blinding and unblinding tokens, and reconciling signed coins against local storage — on top of a cryptographic primitive a specialist team built.',
  },
  {
    label: '0-1 in 6 months',
    body: 'Three coordinated apps — a consumer wallet, a merchant onboarding portal, and a merchant point-of-sale app — designed and built as one system, from nothing, in six months.',
  },
  {
    label: 'a real pilot, not a demo',
    body: 'Tested with real users and real transactions before any wider rollout was even considered — the goal was to find what broke, not to look good in a slide deck.',
  },
];

export function EigerWalletCaseStudy() {
  return (
    <div>
      <CaseHeader title="eiger wallet" />

      <CaseBody>
        <CaseHighlights items={highlights} />

        <CaseSection heading="the brief">
          <p>
            A central bank wanted to find out whether government-issued digital money could work in the
            real world — internally, the project ran under the name <em>Project Tourbillon</em>.
            People were already comfortable with digital payments, but this was different: not a bank, not
            a private app, but government-issued currency. That raises real questions about trust,
            privacy, and usability before a single transaction happens.
          </p>
          <p>
            Rather than launching at scale, the plan was to pilot with real users first — in
            Switzerland — and learn how people actually behave, what they trust, where the experience
            breaks, and what has to change before any wider rollout.
          </p>

           <CaseImage src="/case-media/eiger/1.webp" alt="Consumer wallet app: balance card, add-money screen, biometric authentication prompt, and a payment-successful confirmation with recent transaction history." />
        </CaseSection>

        <CaseSection heading="what got built">
          <p>
            The pilot needed a working payment ecosystem, not a prototype: a consumer mobile app to send
            payments, a merchant onboarding web app to verify businesses, and a merchant mobile app to
            receive payments and track transactions. The three only worked as a system — consumer
            payments, merchant verification, and merchant operations were designed together, not bolted on
            to each other afterward.
          </p>
        </CaseSection>

        <div className="relative w-full aspect-video mb-6 border-[0.375rem] border-cream outline outline-[0.06rem] outline-g/20">
          <iframe
            src="https://www.youtube.com/embed/dCtKZIPE1so"
            title="Debugging the payment signing failure"
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

       

        <CaseSection heading="the consumer flow">
          <p>
            The consumer experience was built for clarity over speed — a quick signup, then a payment
            in a few clear steps. Processing time (about 10 seconds) was shown rather than hidden, and a
            few steps were deliberately kept slightly longer than they needed to be, so a first-time user
            of a currency that didn&rsquo;t exist a year earlier felt informed and in control rather than
            rushed.
          </p>
        </CaseSection>

        <CaseImage src="/case-media/eiger/3.webp" alt="Consumer user flow diagram: download app and create account, link bank account, choose make payment, enter amount or scan QR, review details, confirm, wait for processing, see success confirmation." />
        <CaseImage src="/case-media/eiger/4.webp" alt="Full consumer mobile app screen set: splash, onboarding, mobile verification, card scanning, home screen variations, QR payment, transfer review, processing/authorizing/approved states, and transaction history." />

        <CaseSection heading="the merchant flow">
          <p>
            Merchants don&rsquo;t operate the way consumers do, so the flow was split to match: setup on
            web, daily payments on mobile. Onboarding traded speed for thorough verification — a
            government-backed currency doesn&rsquo;t get to skip knowing who&rsquo;s accepting it — but
            once a merchant was verified, day-to-day use stayed fast: generate a QR code, collect payment,
            see settlement and staff activity without friction.
          </p>
        </CaseSection>

        <CaseImage src="/case-media/eiger/5.webp" alt="Merchant user flow diagram: sign up via web onboarding, submit business details, wait for verification, download and log into merchant app, show QR or enter amount, customer pays, track transactions, receive settlement." />
        <CaseImage src="/case-media/eiger/6.webp" alt="Merchant web onboarding screens: multi-step sign-up with business logo upload, review screen, and approved-account confirmation." />
        <CaseImage src="/case-media/eiger/7.webp" alt="Merchant mobile app screens: onboarding illustrations, sign-in, a merchant home screen (Burger King example), withdraw-money and QR collection flows, and payment processing." />

        <CaseSection heading="what the design had to prioritize">
          <p>
            Because this was a financial product for a currency nobody had used before, usability
            wasn&rsquo;t a nice-to-have. The team designed for low technical comfort and a wide range of
            ages and familiarity levels by default, and treated friction in onboarding and payments as a
            defect to remove, not a detail to polish later.
          </p>
        </CaseSection>

        <CaseSection heading="what I actually built">
          <p>
            The product design and flows above were led by our design team. I owned the consumer and
            merchant iOS apps in SwiftUI, worked alongside IBM to debug and stabilize the Go backend the
            apps ran on, and wrote the token-handling logic that turns &ldquo;pay 12&rdquo; into actual
            digital cash.
          </p>
          <p>
            The wallet doesn&rsquo;t hold a single balance number — it holds a set of individual coins in
            fixed denominations, each backed by a central-bank signature. The scheme has three roles: the
            wallet is the <em>holder</em>, the central bank is the <em>issuer</em>, and a merchant checking
            a payment is the <em>verifier</em> — talking to each other through a post-quantum cryptographic
            library a specialist team built and exposed as a small set of primitives (blind/unblind on the
            holder side, sign on the issuer side, verify on the verifier side).
          </p>
          <p>
            My end of it was the client-side protocol built on top of that library: generating serial
            numbers for new coins and mapping each one to its token, blinding a coin before it ever leaves
            the device, assembling the hashed-coin and blinded-coin arrays a withdrawal request actually
            needs, and — once the issuer signs and returns them — unblinding the result and persisting each
            denomination&rsquo;s certificate and hash to local storage. Spending a coin later means pulling
            that same certificate back out of storage to rebuild a verifier and re-hash the serial number,
            so a merchant can confirm a coin is genuine without ever talking to the central bank directly.
          </p>
          <p>
            Withdrawal worked end to end in the pilot — blind, request, get signed, unblind, store, all
            correct. Payment didn&rsquo;t fully get there: the signing step on the issuer side kept
            returning a server error we never fully root-caused in the pilot window, even after isolating
            it down to a single backend call outside the app entirely. It&rsquo;s the kind of bug that
            makes the case for logging and observability on cryptographic services specifically, not just
            the app around them — that&rsquo;s the debugging session in the recording near the top of this
            page.
          </p>
          <p>
            Separately from that backend bug, there was a genuinely fun algorithms problem on the client:
            because the denomination set was chosen as powers of two, greedy selection is provably optimal
            for it — no need for a heavier knapsack-style solver. I used that to write the greedy
            algorithms behind three operations: <strong>payment</strong> (pick the smallest set of held
            coins that covers an amount), <strong>withdrawal</strong> (decide which denominations to
            request when adding money), and <strong>rebalancing</strong> (periodically trade an unbalanced
            mix of coins — too many small denominations, not enough large ones — for a better spread, the
            same problem a cash register solves when it&rsquo;s running low on fives).
          </p>
        </CaseSection>

        <CaseCode>{`func breakdown(amount int, denominations []int) []int {
    sort.Sort(sort.Reverse(sort.IntSlice(denominations)))

    var tokens []int
    for _, d := range denominations {
        for amount >= d {
            tokens = append(tokens, d)
            amount -= d
        }
    }
    return tokens // greedy is optimal here: denominations are powers of two
}`}</CaseCode>

        <CaseSection heading="key learnings">
          <p>
            <strong>Systems over features.</strong> The product worked because everything — consumer
            app, merchant onboarding, merchant app — was designed as one system, not three separate
            deliverables.
          </p>
          <p>
            <strong>Real testing matters.</strong> Real users exposed gaps a spec review never would have
            — and shaped the product more than any internal review cycle did.
          </p>
          <p>
            <strong>Simplicity drives adoption.</strong> People adopt what feels easy from the very first
            interaction. If it takes effort to understand, they drop off before they trust it.
          </p>
        </CaseSection>

        <CaseSection heading="what shipped">
          <p>
            Project Tourbillon wasn&rsquo;t just another payment app — it was an attempt to design
            trust into a form of money that didn&rsquo;t exist yet. A government-backed digital currency
            only works if people believe in it, and that belief comes from how the product behaves in
            everyday moments, not from a whitepaper. The pilot shipped as a real three-app system, tested
            with real users and real transactions in Switzerland.
          </p>
        </CaseSection>

        <CaseSection heading="what I'd do differently">
          <p>
            With hindsight, I&rsquo;d push for sharper decisions earlier: separating the consumer and
            merchant experiences from day one instead of discovering the split mid-project, validating
            constraints like payment processing delays much sooner, and getting a shared design system in
            place before screens started multiplying instead of after. Same goal — build trust —
            but with less rework along the way.
          </p>
        </CaseSection>
      </CaseBody>
    </div>
  );
}
