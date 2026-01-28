import { MAILTO_CHAR_LIMIT } from "@/lib/constants";

interface MailtoResult {
  url: string;
  wasTruncated: boolean;
}

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

export function buildMailtoUrl(emailText: string): MailtoResult {
  const { subject, body } = parseEmailParts(emailText);

  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  const fullUrl = `mailto:?subject=${encodedSubject}&body=${encodedBody}`;

  if (fullUrl.length <= MAILTO_CHAR_LIMIT) {
    return { url: fullUrl, wasTruncated: false };
  }

  // Truncate body to fit within limit
  const baseUrl = `mailto:?subject=${encodedSubject}&body=`;
  const availableChars = MAILTO_CHAR_LIMIT - baseUrl.length;

  // Work with encoded body and truncate
  let truncatedBody = body;
  while (encodeURIComponent(truncatedBody).length > availableChars) {
    truncatedBody = truncatedBody.slice(0, -50);
  }
  truncatedBody += "\n\n[Full email copied to clipboard]";

  return {
    url: `mailto:?subject=${encodedSubject}&body=${encodeURIComponent(truncatedBody)}`,
    wasTruncated: true,
  };
}
