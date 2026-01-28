"use client";

import { useCallback } from "react";
import { buildMailtoUrl } from "@/utils/buildMailtoUrl";
import { useClipboard } from "./useClipboard";

interface MailtoHook {
  openInOutlook: (emailText: string) => Promise<{ wasTruncated: boolean }>;
  copied: boolean;
}

export function useMailto(): MailtoHook {
  const { copied, copyToClipboard } = useClipboard();

  const openInOutlook = useCallback(
    async (emailText: string) => {
      const { url, wasTruncated } = buildMailtoUrl(emailText);

      if (wasTruncated) {
        // Copy full email to clipboard before opening truncated mailto
        await copyToClipboard(emailText);
      }

      window.location.href = url;
      return { wasTruncated };
    },
    [copyToClipboard]
  );

  return { openInOutlook, copied };
}
