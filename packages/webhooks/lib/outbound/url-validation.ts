const BLOCKED_HOSTNAMES = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);

const isPrivateIpv4 = (hostname: string): boolean => {
  const parts = hostname.split(".").map(Number);

  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
    return false;
  }

  const [a, b] = parts;

  if (a === 10) {
    return true;
  }

  if (a === 127) {
    return true;
  }

  if (a === 192 && b === 168) {
    return true;
  }

  if (a === 172 && b !== undefined && b >= 16 && b <= 31) {
    return true;
  }

  return false;
};

export const validateWebhookUrl = (rawUrl: string): URL => {
  let parsed: URL;

  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error("Invalid webhook URL");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Webhook URL must use HTTP or HTTPS");
  }

  if (process.env.NODE_ENV === "production" && parsed.protocol !== "https:") {
    throw new Error("Webhook URL must use HTTPS in production");
  }

  const hostname = parsed.hostname.toLowerCase();

  if (BLOCKED_HOSTNAMES.has(hostname) || isPrivateIpv4(hostname)) {
    throw new Error(
      "Webhook URL must not target localhost or private networks"
    );
  }

  return parsed;
};
