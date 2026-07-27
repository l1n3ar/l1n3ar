import { CaseHeader, CaseBody, CaseHighlights, CaseSection, CaseCode, CaseImage } from './base';

const highlights = [
  {
    label: 'reverse auctions, not marketplaces',
    body: 'Carriers don’t bid up. They undercut. Each new bid has to beat either the current lowest offer or the carrier’s own last bid by a minimum decrement, so price only ever moves in the shipper’s favor.',
  },
  {
    label: 'anti-sniping, built in',
    body: 'A bid placed near the deadline extends the auction window automatically. It’s the same mechanic eBay uses to stop a load from being won by someone racing the clock instead of offering the best price.',
  },
  {
    label: 'multi-tenant from day one',
    body: 'Private carrier pools, blacklisting, and branch/region-scoped bidding rules per shipper: the data model was built for many independent enterprise clients sharing one platform, not one client with extra fields.',
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
            competitive auction (carriers watching a leaderboard and undercutting each other in real
            time) would surface a better price than any of that, for both sides: shippers get
            competitive rates without chasing quotes, and carriers get a fair shot at loads instead of
            being locked out by whoever has the existing relationship.
          </p>
          <p>
            I led the backend for it: the bidding engine, the real-time layer, and the multi-tenant model
            underneath both.
          </p>
        </CaseSection>

        <CaseImage
          src="/case-media/aculead/mockup.png"
          alt="Aculead tracking dashboard: delay analysis chart, tracking success rate donut, and trip counts for consent-pending, in-progress, departure, arrival, and delay."
          border={false}
        />

        <CaseSection heading="how a bid actually works">
          <p>
            A shipper posts a load with a bidding window. A carrier&rsquo;s rate only gets accepted if it
            legally undercuts, either the load&rsquo;s current lowest rate, or (in a stricter,
            per-shipper mode) the carrier&rsquo;s own previous best, by at least a configured decrement,
            which can be a flat amount or a percentage:
          </p>
        </CaseSection>

        <CaseCode>{`if rate + (math.ceil(decrement * lowest_price * 0.01) if is_decrement_in_percentage else decrement) <= lowest_price:
    return {"valid": True}
return {"valid": False}  # doesn't actually improve the auction, rejected before it's ever inserted`}</CaseCode>

        <CaseSection heading="the leaderboard, live">
          <p>
            Every accepted bid gets inserted into an append-only bid log: the current lowest price is
            never a stored field that gets updated in place, it&rsquo;s always recomputed from that log.
            That one decision sidesteps a whole category of lost-update bugs: two bids landing at nearly
            the same instant can&rsquo;t corrupt a shared &ldquo;current winner&rdquo; value, because
            there isn&rsquo;t one to corrupt.
          </p>
          <p>
            The live leaderboard itself is a Redis sorted set, keyed by load, scored by rate. Redis sorted
            sets break ties on the raw score, which would make two carriers bidding the same rate a
            coin flip. So submission order gets folded directly into the number being sorted on:
          </p>
        </CaseSection>

        <CaseCode>{`rate = rate + current_timestamp / (10 ** 10)   # same rate, earlier bid, lower score, ranks first
redis.zadd(sorted_set, {transporter_id: rate})`}</CaseCode>

        <CaseSection heading="pushing it out live">
          <p>
            Every accepted bid gets inserted into Postgres, pushed to the Redis leaderboard, then
            broadcast out over a websocket to everyone watching that load, so a carrier sees exactly
            where they stand the moment someone undercuts them:
          </p>
        </CaseSection>

        <CaseCode>{`bid = await bid.new(bid_id, transporter_id, rate, comment, is_tc_accepted, user_id)
leaderboard = await redis.update(sorted_set=bid_id, transporter_id=transporter_id, rate=rate, ...)
await manager.broadcast(bid_id=bid_id, message=json.dumps(leaderboard))`}</CaseCode>

        <CaseImage
          src="/case-media/aculead/bid-flow.svg"
          alt="Bid flow: carrier submits bid, decrement check, accepted bids go into an append-only bid log and a Redis sorted-set leaderboard, then broadcast over websocket to all watchers, and the shipper reviews the ranked list to award."
        />

        <CaseSection heading="a human still picks the winner">
          <p>
            The system never auto-awards the load to the lowest bidder. The shipper reviews the ranked
            list and assigns it, including splitting a single load across multiple carriers when one
            fleet can&rsquo;t cover it alone. The auction&rsquo;s job is to surface the best options
            quickly and transparently; the decision stays a business decision, not an algorithm&rsquo;s.
          </p>
        </CaseSection>

        <CaseSection heading="one platform, many shippers">
          <p>
            Every shipper gets their own bidding rules (decrement size, retry limits, price-match windows),
            their own private carrier pool with the ability to blacklist specific carriers, and
            bidding scoped by branch and region. The same engine runs private invite-only auctions,
            an open public market, and direct-assign loads side by side, without one shipper&rsquo;s
            configuration leaking into another&rsquo;s.
          </p>
        </CaseSection>

        <CaseSection heading="what I'd tighten up">
          <p>
            Two things I&rsquo;d fix given the chance. First, the auth middleware decoded incoming JWTs
            with signature verification explicitly turned off. It checked the claims (user id, shipper
            vs. transporter role) but never actually verified the token was signed by us:
          </p>
        </CaseSection>

        <CaseCode>{`payload = jwt.decode(token, key=JWT_SECRET, algorithms=[JWT_ALGORITHM],
                     options={"verify_signature": False})  # never actually checked`}</CaseCode>

        <CaseSection heading="and the other thing">
          <p>
            Fine for how it was used internally at the time, but not something I&rsquo;d leave in place
            for anything facing the open internet. Second, the websocket layer that broadcasts the live
            leaderboard keeps its connections in a plain in-process dict. That&rsquo;s correct for a
            single server, but it needs a shared layer like Redis pub/sub behind it before it&rsquo;s
            correct across more than one.
          </p>
        </CaseSection>
      </CaseBody>
    </div>
  );
}
