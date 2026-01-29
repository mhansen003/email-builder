export function parseEmailParts(emailText: string): {
  subject: string;
  body: string;
} {
  const lines = emailText.trim().split("\n");
  let subject = "";
  let bodyStartIndex = 0;

  // Extract subject from first line if it starts with "Subject:"
  if (lines[0]?.toLowerCase().startsWith("subject:")) {
    subject = lines[0].replace(/^subject:\s*/i, "").trim();
    bodyStartIndex = 1;
    // Skip blank line after subject
    if (lines[bodyStartIndex]?.trim() === "") {
      bodyStartIndex = 2;
    }
  }

  const body = lines.slice(bodyStartIndex).join("\n").trim();
  return { subject, body };
}

/**
 * Build a mailto: URL with subject AND body.
 * Note: Including body means Outlook won't auto-add signature,
 * but this guarantees the email content actually arrives.
 */
export function buildMailtoUrl(emailText: string): string {
  const { subject, body } = parseEmailParts(emailText);
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
