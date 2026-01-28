"use client";

import { useCallback } from "react";
import { buildMailtoUrl, parseEmailParts } from "@/utils/buildMailtoUrl";
import { useClipboard } from "./useClipboard";

interface MailtoHook {
  openInOutlook: (emailText: string) => Promise<void>;
  copied: boolean;
}

export function useMailto(): MailtoHook {
  const { copied, copyToClipboard } = useClipboard();

  const openInOutlook = useCallback(
    async (emailText: string) => {
      // Copy email body to clipboard (user pastes above signature)
      const { body } = parseEmailParts(emailText);
      await copyToClipboard(body);

      // Open mailto with subject only — Outlook will add the signature
      const url = buildMailtoUrl(emailText);
      window.location.href = url;
    },
    [copyToClipboard]
  );

  return { openInOutlook, copied };
}
