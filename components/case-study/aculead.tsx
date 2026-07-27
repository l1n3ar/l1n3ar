import { CaseHeader, CaseBody, CaseHighlights, CaseSection, CaseCode } from './base';

const highlights = [
  {
    label: 'reverse auctions, not marketplaces',
    body: 'Carriers don’t bid up — they undercut. Each new bid has to beat either the current lowest offer or the carrier’s own last bid by a minimum decrement, so price only ever moves in the shipper’s favor.',
  },
  {
    label: 'anti-sniping, built in',
    body: 'A bid placed near the deadline extends the auction window automatically — the same mechanic eBay uses to stop a load from being won by someone racing the clock instead of offering the best price.',
  },
  {
    label: 'multi-tenant from day one',
    body: 'Private carrier pools, blacklisting, and branch/region-scoped bidding rules per shipper — the data model was built for many independent enterprise clients sharing one platform, not one client with extra fields.',
  },
];

export function AculeadCaseStudy() {
  return (
    <div>
      <CaseHeader title="aculead" />

      <CaseBody>
        <CaseHighlights items={highlights} />

        <CaseSection heading="the brief">
          <p>
            Freight pricing between shippers and carriers is usually a phone call, an email thread, or a
            rate card nobody&rsquo;s renegotiated in a year. Aculead&rsquo;s bet was that a live,
            competitive auction — carriers watching a leaderboard and undercutting each other in real
            time — would surface a better price than any of that, for both sides: shippers get
            competitive rates without chasing quotes, and carriers get a fair shot at loads instead of
            being locked out by whoever has the existing relationship.
          </p>
          <p>
            I led the backend for it: the bidding engine, the real-time layer, and the multi-tenant model
            underneath both.
          </p>
        </CaseSection>

        <CaseSection heading="how a bid actually works">
          <p>
            A shipper posts a load with a bidding window. Carriers place rate offers against it, but a new
            offer only gets accepted if it legally undercuts — either the current lowest rate on the load,
            or (in a stricter mode) the carrier&rsquo;s own previous best, by at least a configured
            decrement, absolute or percentage:
          </p>
        </CaseSection>

        <CaseCode>{`if rate + (ceil(decrement * lowest_price * 0.01) if is_percentage else decrement) <= lowest_price:
    accept_bid(rate)  # otherwise: reject, it doesn't actually improve the auction`}</CaseCode>

        <CaseSection heading="the leaderboard, live">
          <p>
            Every accepted bid gets inserted into an append-only bid log — the current lowest price is
            never a stored field that gets updated in place, it&rsquo;s always recomputed from that log.
            That one decision sidesteps a whole category of lost-update bugs: two bids landing at nearly
            the same instant can&rsquo;t corrupt a shared &ldquo;current winner&rdquo; value, because
            there isn&rsquo;t one to corrupt.
          </p>
          <p>
            The live leaderboard itself is a Redis sorted set, keyed by load, scored by rate — with a
            fractional timestamp folded into the score so ties break by submission order instead of being
            arbitrary. Every accepted bid pushes the updated leaderboard out over a websocket connection to
            everyone watching that load, so a carrier sees exactly where they stand the moment someone
            undercuts them.
          </p>
        </CaseSection>

        <CaseSection heading="a human still picks the winner">
          <p>
            The system never auto-awards the load to the lowest bidder. The shipper reviews the ranked
            list and assigns it — including splitting a single load across multiple carriers when one
            fleet can&rsquo;t cover it alone. The auction&rsquo;s job is to surface the best options
            quickly and transparently; the decision stays a business decision, not an algorithm&rsquo;s.
          </p>
        </CaseSection>

        <CaseSection heading="one platform, many shippers">
          <p>
            Every shipper gets their own bidding rules (decrement size, retry limits, price-match windows),
            their own private carrier pool with the ability to blacklist specific carriers, and
            bidding scoped by branch and region — so the same engine runs private invite-only auctions,
            an open public market, and direct-assign loads side by side, without one shipper&rsquo;s
            configuration leaking into another&rsquo;s.
          </p>
        </CaseSection>

        <CaseSection heading="what I'd tighten up">
          <p>
            Two things I&rsquo;d fix given the chance. First, auth verification on incoming tokens was
            structural-only — checked for the right shape and claims, not cryptographically verified
            against a signature — fine for how it was used internally at the time, but not something
            I&rsquo;d leave in place for anything facing the open internet. Second, the websocket layer
            that broadcasts the live leaderboard keeps its connections in an in-process list — correct for
            a single server, but it needs a shared layer like Redis pub/sub behind it before it&rsquo;s
            correct across more than one.
          </p>
        </CaseSection>
      </CaseBody>
    </div>
  );
}
