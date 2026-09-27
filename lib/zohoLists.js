// One entry per Zoho Campaigns list used by the lead-funnel landing pages.
//
// HOW TO FILL THIS IN (once you've created the 5 lists + embedded signup
// forms in Zoho Campaigns):
//   1. In Zoho Campaigns, go to each list's embedded signup form and grab
//      the "HTML" embed code it gives you.
//   2. Copy the <form> tag's `action="..."` URL into `actionUrl` below.
//   3. Copy EVERY <input type="hidden" name="..." value="..."> from that
//      embed code into `hiddenFields` for that list, exactly as given —
//      these are account/list-specific tokens (things like `zx`, `zc_trackCode`)
//      and submissions will be silently dropped by Zoho if they're missing
//      or altered.
//   4. Check the visible <input> names for email/first name/etc. in the
//      embed code and adjust `fieldNames` below if Zoho named them
//      differently than the defaults (Zoho's own field names are usually
//      CONTACT_EMAIL / FIRSTNAME; custom fields follow whatever internal
//      name Zoho assigns when you create them — see the custom field
//      names we asked you to use in the Zoho setup checklist).
//
// Nothing here is a secret — these are public form-target values (the same
// ones that would sit in Zoho's own embed <form> HTML), safe to commit.

const PLACEHOLDER_ACTION_URL = "https://REPLACE-ME.maillist-manage.com/weblink/subscribe";

const DEFAULT_FIELD_NAMES = {
  firstName: "FIRSTNAME",
  email: "CONTACT_EMAIL",
  whatsapp: "CONTACT_CF_WHATSAPP",
  need: "CONTACT_CF_NEED",
  utmSource: "CONTACT_CF_UTM_SOURCE",
  utmMedium: "CONTACT_CF_UTM_MEDIUM",
  utmCampaign: "CONTACT_CF_UTM_CAMPAIGN",
  utmContent: "CONTACT_CF_UTM_CONTENT",
  // Optional 5th custom field, only used on the "call" list's form. Skip
  // creating it in Zoho if you don't want it — LeadForm falls back to a
  // plain (non-Zoho-mapped) field name and the value just won't be captured.
  preferredTime: "CONTACT_CF_PREFERRED_TIME",
};

export const ZOHO_LISTS = {
  audit: {
    label: "Audit Requests",
    actionUrl: PLACEHOLDER_ACTION_URL,
    fieldNames: DEFAULT_FIELD_NAMES,
    hiddenFields: [
      // { name: "zx", value: "REPLACE_ME" },
    ],
  },
  scorecard: {
    label: "Scorecard",
    actionUrl: PLACEHOLDER_ACTION_URL,
    fieldNames: DEFAULT_FIELD_NAMES,
    hiddenFields: [],
  },
  pricingGuide: {
    label: "Price Guide",
    actionUrl: PLACEHOLDER_ACTION_URL,
    fieldNames: DEFAULT_FIELD_NAMES,
    hiddenFields: [],
  },
  checklist: {
    label: "Checklist",
    actionUrl: PLACEHOLDER_ACTION_URL,
    fieldNames: DEFAULT_FIELD_NAMES,
    hiddenFields: [],
  },
  call: {
    label: "Strategy Call",
    actionUrl: PLACEHOLDER_ACTION_URL,
    fieldNames: DEFAULT_FIELD_NAMES,
    hiddenFields: [],
  },
};

export const isZohoConfigured = (listKey) =>
  Boolean(ZOHO_LISTS[listKey]?.actionUrl && !ZOHO_LISTS[listKey].actionUrl.includes("REPLACE-ME"));
