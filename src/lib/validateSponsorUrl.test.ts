
import assert from "node:assert/strict";
import { test } from "node:test";
import { validateSponsorUrl } from "./validateSponsorUrl";

test("valid HTTPS sponsor URL is accepted", () => {
  assert.deepEqual(
    validateSponsorUrl("https://example.com/sponsor"),
    {
      success: true,
      url: "https://example.com/sponsor",
    }
  );
});

test("JavaScript URL is rejected", () => {
  assert.deepEqual(
    validateSponsorUrl("javascript:alert(1)"),
    {
      success: false,
      error: {
        code: "INVALID_SPONSOR_URL",
        message: "Sponsor URL must use HTTPS.",
      },
    }
  );
});

test("HTTP URL is rejected", () => {
  const result = validateSponsorUrl("http://example.com");

  assert.equal(result.success, false);
});

test("malformed URL is rejected", () => {
  assert.deepEqual(validateSponsorUrl("http://"), {
    success: false,
    error: {
      code: "INVALID_SPONSOR_URL",
      message: "Sponsor URL is malformed.",
    },
  });
});

test("IPv4 address is rejected", () => {
  const result = validateSponsorUrl("https://192.168.1.1");

  assert.equal(result.success, false);
});

test("IPv6 address is rejected", () => {
  const result = validateSponsorUrl("https://[::1]");

  assert.equal(result.success, false);
});

test("localhost is rejected", () => {
  const result = validateSponsorUrl("https://localhost");

  assert.equal(result.success, false);
});

test("embedded credentials are rejected", () => {
  const result = validateSponsorUrl(
    "https://admin:password@example.com"
  );

  assert.equal(result.success, false);
});

test("empty URL is rejected", () => {
  const result = validateSponsorUrl("");

  assert.equal(result.success, false);
});

test("whitespace in URL is rejected", () => {
  const result = validateSponsorUrl(
    "https://example.com/unsafe path"
  );

  assert.equal(result.success, false);
});
