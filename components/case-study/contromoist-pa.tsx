import { CaseHeader, CaseBody, CaseHighlights, CaseSection } from './base';

const highlights = [
  {
    label: 'replacing a live system, piece by piece',
    body: 'The new backend ran against an existing legacy ERP’s live database from day one — project management, quality inspection, and travel claims were re-platformed one module at a time, without a cutover weekend or any downtime.',
  },
  {
    label: 'templates, not one-off checklists',
    body: 'Quality inspections and project setup both work the same way: define a checklist once as a template, then instantiate it onto a project — write the pattern once, reuse it everywhere a checklist is needed.',
  },
  {
    label: 'solo, three weeks',
    body: 'Owned and built the entire backend alone, from schema to shipped API, in about three weeks — including the parts that had to coexist with someone else’s existing system.',
  },
];

export function ContromoistPACaseStudy() {
  return (
    <div>
      <CaseHeader title="contromoist" />

      <CaseBody>
        <CaseHighlights items={highlights} />

        <CaseSection heading="the brief">
          <p>
            An air-conditioning installation business was running its operations — leads, quotes, bills of
            materials, purchase orders, goods receipts — on an existing ERP. What it didn&rsquo;t have was
            a good way to manage the actual installation projects: assigning field engineers, running
            quality checklists before and after installation, and processing the travel expense claims
            that come with sending technicians to customer sites. I owned building that layer, solo.
          </p>
        </CaseSection>

        <CaseSection heading="building next to a system you don't own">
          <p>
            The existing ERP&rsquo;s database wasn&rsquo;t going anywhere — it already held the business&rsquo;s
            leads, bills of materials, rate contracts, and purchase-order history, and it had to keep
            running while the new functionality got built. So the new service was designed to read that
            existing schema where it needed context, while owning a clean, separate set of tables for the
            functionality it was actually responsible for — project records, quality-inspection instances,
            and travel claims — rather than trying to rewrite or migrate the legacy data model itself. It's
            the same idea behind a &ldquo;strangler fig&rdquo; migration: replace a legacy system's
            capabilities one real piece at a time, with both old and new running side by side, instead of
            betting everything on a single cutover.
          </p>
        </CaseSection>

        <CaseSection heading="one templating pattern, two use cases">
          <p>
            Quality inspections needed to be consistent — the same pre-installation and post-installation
            checklist, run the same way, on every project of a given type. Rather than hand-build each
            project&rsquo;s checklist, a quality template defines the task list once; creating an
            inspection on a real project instantiates that template into a concrete, trackable set of
            tasks tied to that project. Project setup follows the same shape: a project template seeds a
            new project&rsquo;s default task list the same way. One pattern, reused instead of
            re-invented, for both.
          </p>
        </CaseSection>

        <CaseSection heading="who gets to see what">
          <p>
            Every project, resource assignment, and task is scoped by who&rsquo;s actually assigned to it —
            a non-admin user only ever sees the projects they&rsquo;re on, enforced consistently in the
            data-access layer rather than left to the frontend to hide things correctly. Travel claims
            follow their own approval lifecycle too: editing a submitted claim resets it back to
            unapproved, so a change after the fact can&rsquo;t quietly slip past whoever signed off on the
            original.
          </p>
        </CaseSection>

        <CaseSection heading="what I'd tighten up">
          <p>
            Shipping solo on a tight timeline, a couple of things I&rsquo;d clean up first on a second
            pass: a debug-only token route that used a hardcoded secret made sense for fast local testing
            against the legacy system, but it&rsquo;s not something I&rsquo;d want live anywhere near
            production, and one of the raw SQL queries in the travel-claims service built its query string
            by interpolation rather than parameter binding — safe in context at the time, but not a pattern
            I&rsquo;d repeat.
          </p>
        </CaseSection>
      </CaseBody>
    </div>
  );
}
