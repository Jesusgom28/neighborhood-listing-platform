
export type SponsorUrlResult =
  | { success: true; url: string }
  | {
      success: false;
      error: {
        code: "INVALID_SPONSOR_URL";
        message: string;
      };
    };

export function validateSponsorUrl(
  input: unknown
): SponsorUrlResult {
  const reject = (message: string): SponsorUrlResult => ({
    success: false,
    error: {
      code: "INVALID_SPONSOR_URL",
      message,
    },
  });

  if (typeof input !== "string" || !input.trim()) {
    return reject("Sponsor URL must be a non-empty string.");
  }

  // Reject whitespace and control characters.
  if (/[\s\x00-\x1F\x7F]/.test(input)) {
    return reject("Sponsor URL contains invalid characters.");
  }

  let url: URL;

  try {
    url = new URL(input);
  } catch {
    return reject("Sponsor URL is malformed.");
  }

  // Require encrypted HTTPS connections.
  if (url.protocol !== "https:") {
    return reject("Sponsor URL must use HTTPS.");
  }

  // Reject credentials embedded in URLs.
  if (url.username || url.password) {
    return reject("Sponsor URL cannot contain credentials.");
  }

  // Reject IP addresses and local network destinations.
  const hostname = url.hostname.toLowerCase();

// Reject IPv4 addresses, IPv6 addresses, and numeric hostnames.
// The URL parser normalizes alternative IP formats.
if (
  hostname.startsWith("[") ||
  /^\d+\.\d+\.\d+\.\d+$/.test(hostname) ||
  /^\d+$/.test(hostname)
) {
  return reject("Sponsor URL must use a public domain name.");
}

  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    /^\d+\.\d+\.\d+\.\d+$/.test(hostname) ||
    hostname.startsWith("[") ||
    !hostname.includes(".")
  ) {
    return reject("Sponsor URL must use a public domain name.");
  }

  return {
    success: true,
    url: url.toString(),
  };
}
