import { CaseHeader, CaseBody, CaseHighlights, CaseSection, CaseCode, CaseImage } from './base';

const highlights = [
  {
    label: 'whatsapp as a real channel',
    body: 'OTP login, order-status updates, delivery-assignment pings, and invoice links all go out over WhatsApp, the channel customers already check, not an app notification they’ve muted.',
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
            same time. The same backend had to run online checkout, in-store point-of-sale, inventory and
            goods-receipt tracking, delivery-staff scheduling, and a milk-style subscription line, all
            talking to the same product catalog and the same customer wallet. I led a backend team of four
            building it.
          </p>
        </CaseSection>

        <CaseImage
          src="/case-media/grocernest/mockup.png"
          alt="Grocernest storefront homepage: category navigation, a quality-focused hero banner, and a fresh-veggies promotional callout."
          border = {false}
        />

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
            Retention ran on four scheduled jobs, each solving a different version of the same problem:
            paying customers back automatically instead of manually. The most involved of the four
            evaluates a table of promotional strategies against every item in every recently-delivered
            order, and specifically checks whether this is genuinely the customer&rsquo;s first purchase
            of that item before paying out a first-buy incentive, not just their first order overall:
          </p>
        </CaseSection>

        <CaseCode>{`if (isItemAvailable >= 0) {
  if (!currentStrategy.first_buy) {
    wallet_amt = current_item.quantity *
      ((current_item.sale_price / 100) * currentStrategy.amount_of_discount)
  }
  // first_buy strategies additionally check order history before crediting
}`}</CaseCode>

        <CaseSection heading="one catalog, four operating modes">
          <p>
            Online checkout, POS sales, inventory movement, and goods-receipt from suppliers all draw down
            and top up the same inventory records, so a sale on the storefront and a sale at the counter
            can&rsquo;t both oversell the same stock. Coupons, referral codes, and promotional offers are
            centralized in one rules engine rather than re-implemented per sales channel. A discount
            works the same way whether it was applied online or at checkout in-store.
          </p>

          <CaseImage
            src="/case-media/grocernest/one-catalog.svg"
            alt="One catalog and customer wallet shared across four operating modes: online checkout and subscriptions, in-store POS, inventory/GRN, and delivery operations, with WhatsApp handling OTPs, order updates, and invoices."
          />
        </CaseSection>

        <CaseSection heading="what I'd tighten up">
          <p>
            The parts of the system built earliest, checkout and wallet crediting, update balances with
            a read-then-write rather than an atomic, transaction-wrapped operation. Wallet credits also
            build their SQL by string interpolation instead of parameter binding:
          </p>
        </CaseSection>

        <CaseCode>{`await sequelize.query(\`
  UPDATE t_wallet
  SET balance = (SELECT balance FROM t_wallet WHERE cust_no="\${cust_no}") + \${amount}
  WHERE cust_no = "\${cust_no}"
\`)`}</CaseCode>

        <CaseSection heading="and the other thing">
          <p>
            Safe as long as every caller upstream already validated <code>cust_no</code> and{' '}
            <code>amount</code>, which was true everywhere it was actually called, but it&rsquo;s not a
            pattern I&rsquo;d repeat, and it&rsquo;s exactly the kind of thing that&rsquo;s fine right up
            until it isn&rsquo;t. The inventory and goods-receipt side, built later, already does this more
            carefully with real database sequences and foreign keys, a good example of the second version
            of a system being visibly more careful than the first.
          </p>
        </CaseSection>
      </CaseBody>
    </div>
  );
}
