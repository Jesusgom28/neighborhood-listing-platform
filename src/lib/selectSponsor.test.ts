
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  selectSponsor,
  type SponsorCandidate,
  type SponsorContext,
} from "./selectSponsor";

const context: SponsorContext = {
  zipCode: "90032",
  placement: "PROPERTY_DETAIL",
  today: "2026-10-22",
};

const base: SponsorCandidate = {
  sponsor_id: 1,
  business_name: "Test Sponsor",
  tier: "SILVER",
  priority: 1,
  status: "APPROVED",
  is_active: true,
  placement: "PROPERTY_DETAIL",
  target_zip: "90032",
  start_date: "2026-10-01",
  end_date: "2026-10-31",
  website_url: "https://example.com",
};

function sponsor(
  changes: Partial<SponsorCandidate>
): SponsorCandidate {
  return { ...base, ...changes };
}

test("exact ZIP match selects sponsor", () => {
  assert.equal(selectSponsor(context, [base])?.sponsor_id, 1);
});

test("different ZIP is rejected", () => {
  assert.equal(
    selectSponsor(context, [
      sponsor({ target_zip: "90001" }),
    ]),
    null
  );
});

test("inactive sponsor is rejected", () => {
  assert.equal(
    selectSponsor(context, [
      sponsor({ is_active: false }),
    ]),
    null
  );
});

test("pending sponsor is rejected", () => {
  assert.equal(
    selectSponsor(context, [
      sponsor({ status: "PENDING" }),
    ]),
    null
  );
});

test("expired campaign is rejected", () => {
  assert.equal(
    selectSponsor(context, [
      sponsor({ end_date: "2026-10-21" }),
    ]),
    null
  );
});

test("campaign is eligible on start and end dates", () => {
  assert.equal(
    selectSponsor(
      { ...context, today: "2026-10-01" },
      [base]
    )?.sponsor_id,
    1
  );

  assert.equal(
    selectSponsor(
      { ...context, today: "2026-10-31" },
      [base]
    )?.sponsor_id,
    1
  );
});

test("wrong placement is rejected", () => {
  assert.equal(
    selectSponsor(context, [
      sponsor({ placement: "SEARCH_RESULTS" }),
    ]),
    null
  );
});

test("higher tier wins over lower tier", () => {
  const winner = selectSponsor(context, [
    sponsor({ sponsor_id: 1, tier: "SILVER" }),
    sponsor({ sponsor_id: 2, tier: "GOLD" }),
    sponsor({
      sponsor_id: 3,
      tier: "PLATINUM",
      status: "PENDING",
    }),
  ]);

  assert.equal(winner?.sponsor_id, 2);
});

test("higher priority wins within same tier", () => {
  const winner = selectSponsor(context, [
    sponsor({ sponsor_id: 1, tier: "GOLD", priority: 1 }),
    sponsor({ sponsor_id: 2, tier: "GOLD", priority: 5 }),
  ]);

  assert.equal(winner?.sponsor_id, 2);
});

test("lower sponsor ID breaks exact ties", () => {
  const winner = selectSponsor(context, [
    sponsor({ sponsor_id: 8, tier: "GOLD" }),
    sponsor({ sponsor_id: 3, tier: "GOLD" }),
  ]);

  assert.equal(winner?.sponsor_id, 3);
});

test("no eligible sponsor returns null", () => {
  assert.equal(selectSponsor(context, []), null);
});
