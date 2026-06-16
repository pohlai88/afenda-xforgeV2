export {};

// Local env sync points first-party webhooks at localhost — blocked by outbound URL validation.
// Integration tests that need first-party fan-out set WEBHOOK_FIRST_PARTY_* in beforeAll.
const firstPartyUrl = process.env.WEBHOOK_FIRST_PARTY_WEB_URL?.trim() ?? "";
if (!firstPartyUrl || /localhost|127\.0\.0\.1/i.test(firstPartyUrl)) {
  process.env.WEBHOOK_FIRST_PARTY_WEB_URL = undefined;
  process.env.WEBHOOK_FIRST_PARTY_WEB_SECRET = undefined;
}
