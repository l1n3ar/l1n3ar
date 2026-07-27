import { CaseHeader, CaseBody, CaseHighlights, CaseSection, CaseCode, CaseImage } from './base';

const highlights = [
  {
    label: 'replacing a live system, piece by piece',
    body: 'The new backend ran against an existing legacy ERP’s live database from day one. Project management, quality inspection, and travel claims were re-platformed one module at a time, without a cutover weekend or any downtime.',
  },
  {
    label: 'templates, not one-off checklists',
    body: 'Quality inspections work off a reusable template: define the checklist once, then instantiate it onto any project with one bulk insert. Write the pattern once, reuse it everywhere a checklist is needed.',
  },
  {
    label: 'solo, three weeks',
    body: 'Owned and built the entire backend alone, from schema to shipped API, in about three weeks, including the parts that had to coexist with someone else’s existing system.',
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
            An air-conditioning installation business was running its operations (leads, quotes, bills of
            materials, purchase orders, goods receipts) on an existing ERP. What it didn&rsquo;t have was
            a good way to manage the actual installation projects: assigning field engineers, running
            quality checklists before and after installation, and processing the travel expense claims
            that come with sending technicians to customer sites. I owned building that layer, solo.
          </p>
        </CaseSection>

        <CaseSection heading="building next to a system you don't own">
          <p>
            The existing ERP&rsquo;s database wasn&rsquo;t going anywhere. It already held the business&rsquo;s
            leads, bills of materials, rate contracts, and purchase-order history, and it had to keep
            running while the new functionality got built. So the new service owns a clean, separate set of
            tables for what it&rsquo;s actually responsible for (project records, quality-inspection
            instances, travel claims) rather than trying to rewrite or migrate the legacy data model
            itself. It&rsquo;s the same idea behind a &ldquo;strangler fig&rdquo; migration: replace a
            legacy system&rsquo;s capabilities one real piece at a time, with both old and new running side
            by side, instead of betting everything on a single cutover.
          </p>
        </CaseSection>

        <CaseImage
          src="/case-media/contromoist/strangler-architecture.svg"
          alt="Strangler-fig architecture: the legacy ERP keeps running leads, bills of materials, purchase orders, and GRN, while the new backend owns a separate set of tables for project management, quality inspections, and travel claims, running alongside it with no cutover."
        />

        <CaseSection heading="one templating pattern, two use cases">
          <p>
            Quality inspections needed to be consistent: the same pre- and post-installation checklist,
            run the same way, on every project of a given type. Rather than hand-build each project&rsquo;s
            checklist, a quality template defines the task list once; creating an inspection on a real
            project reads that template and bulk-inserts one row per task, tied to the project:
          </p>
        </CaseSection>

        <CaseCode>{`const templateDatas = await QualityTemplateTask.findAll({
  where: { template_id: qualityTemplateId, is_active: true }
})

const qualityTaskRecords = templateDatas.map((detail) => ({
  project: project_id,
  task: detail.task,
  is_pre: detail.is_pre,
  quality_template_id: qualityTemplateId,
  is_valid: false,
  created_by: resource
}))

await Quality.bulkCreate(qualityTaskRecords, { transaction })`}</CaseCode>

        <CaseSection heading="who gets to see what">
          <p>
            Every project, resource assignment, and task is scoped by who&rsquo;s actually assigned to it.
            A non-admin user only ever sees the projects they&rsquo;re on, enforced in the data-access
            layer rather than left to the frontend to hide things correctly. Travel claims follow their own
            approval lifecycle: editing a submitted claim resets it back to unapproved, so a change after
            the fact can&rsquo;t quietly slip past whoever signed off on the original. The fetch itself
            nests each requisition&rsquo;s claim line-items in one query rather than N+1 round trips:
          </p>
        </CaseSection>

        <CaseCode>{`SELECT t_travel.*,
  JSON_ARRAYAGG(
    JSON_OBJECT('id', t_travel_details.id, 'location', t_travel_details.location,
                'amount', t_travel_details.amount, 'is_approved', t_travel_details.is_approved)
  ) AS details
FROM t_travel
LEFT JOIN t_travel_details ON t_travel_details.travel_id = t_travel.id
WHERE t_travel.is_active = TRUE
GROUP BY t_travel.id`}</CaseCode>

        <CaseSection heading="what I'd tighten up">
          <p>
            Shipping solo on a tight timeline, a couple of things I&rsquo;d clean up first on a second
            pass. A debug-only route for minting test tokens used a hardcoded secret, which made sense for
            fast local testing against the legacy system but isn&rsquo;t something I&rsquo;d want live
            anywhere near production:
          </p>
        </CaseSection>

        <CaseCode>{`server.get("/token", (req, res) => {
  const secretKey = '1@3$5^7*9)qpalzm10'  // fine for local testing, not for anything real
  const token = jwt.sign({ id: "1", name: "user ONE", isAdmin: true }, secretKey)
  return res.status(200).send({ token })
})`}</CaseCode>

        <CaseSection heading="and one more">
          <p>
            And the requisition/claim queries above build their <code>WHERE</code> clause by interpolating
            the resource ID and requisition ID directly into the SQL string rather than binding them as
            parameters. Safe in context at the time, but not a pattern I&rsquo;d repeat on anything
            reachable from outside a trusted internal caller.
          </p>
        </CaseSection>
      </CaseBody>
    </div>
  );
}
