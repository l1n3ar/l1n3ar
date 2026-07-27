import { CaseHeader, CaseBody, CaseHighlights, CaseSection } from './base';

const highlights = [
  {
    label: 'whatsapp as a real channel',
    body: 'OTP login, order-status updates, delivery-assignment pings, and invoice links all go out over WhatsApp — the channel customers already check, not an app notification they’ve muted.',
  },
  {
    label: 'rewards that run themselves',
    body: 'A set of scheduled jobs settles referral bonuses, delivered-order cashback, in-store POS cashback, and first-purchase-only promotions every night, with results reported back automatically.',
  },
  {
    label: 'one platform, four businesses',
    body: 'Online storefront, in-store POS, inventory/GRN, delivery-staff operations, and a recurring subscription model all share one backend instead of four bolted-together systems.',
  },
];

export function GrocernestCaseStudy() {
  return (
    <div>
      <CaseHeader title="grocernest" />

      <CaseBody>
        <CaseHighlights items={highlights} />

        <CaseSection heading="the brief">
          <p>
            Grocernest needed to be a grocery e-commerce storefront and a real retail operation at the
            same time — the same backend had to run online checkout, in-store point-of-sale, inventory and
            goods-receipt tracking, delivery-staff scheduling, and a milk-style subscription line, all
            talking to the same product catalog and the same customer wallet. I led a backend team of four
            building it.
          </p>
        </CaseSection>

        <CaseSection heading="whatsapp, not just an app">
          <p>
            A lot of the customer-facing plumbing runs over WhatsApp instead of push notifications or
            email: OTP verification at signup, order-placed/shipped/cancelled/returned updates, a ping to
            the assigned delivery rider, and a direct link to download an invoice. For a grocery customer
            who already has WhatsApp open, that&rsquo;s a materially higher-reach channel than anything
            requiring the app itself to be installed and its notifications left on.
          </p>
        </CaseSection>

        <CaseSection heading="the rewards engine">
          <p>
            Retention ran on four scheduled jobs, each solving a different version of the same problem —
            paying customers back automatically instead of manually: a nightly referral job that credits
            both sides of a referral once the referred customer completes their first delivered order; a
            cashback job that settles per-item cashback on orders delivered in the trailing window; a
            parallel job doing the same for in-store POS purchases; and a promotional &ldquo;special
            wallet&rdquo; job that evaluates per-item strategies — including checking whether this is
            genuinely a customer&rsquo;s first purchase of that item before paying out a first-buy
            incentive. Every run reports its own success or failure back over WhatsApp, so a broken job
            doesn&rsquo;t fail silently overnight.
          </p>
        </CaseSection>

        <CaseSection heading="one catalog, four operating modes">
          <p>
            Online checkout, POS sales, inventory movement, and goods-receipt from suppliers all draw down
            and top up the same inventory records, so a sale on the storefront and a sale at the counter
            can&rsquo;t both oversell the same stock. Coupons, referral codes, and promotional offers are
            centralized in one rules engine rather than re-implemented per sales channel — a discount
            works the same way whether it was applied online or at checkout in-store.
          </p>
        </CaseSection>

        <CaseSection heading="what I'd tighten up">
          <p>
            The parts of the system built earliest — checkout and wallet crediting — update balances with
            a read-then-write rather than an atomic, transaction-wrapped operation, which is fine at
            moderate concurrency but is exactly the kind of thing I&rsquo;d harden before pushing volume
            much higher. The inventory and goods-receipt side, built later, already does this properly with
            real database sequences and foreign keys — it&rsquo;s a good example of the second version of a
            system being visibly more careful than the first.
          </p>
        </CaseSection>
      </CaseBody>
    </div>
  );
}
