"use client";

import { useState } from "react";
import { HistoryItem, PublishedItem } from "@/lib/share";
import { useClipboard } from "@/hooks/useClipboard";

type TabId = "history" | "published";

interface EmailHistoryProps {
  history: HistoryItem[];
  activeId: string | null;
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  isOpen: boolean;
  onToggle: () => void;
  published: PublishedItem[];
  onPublishedDelete: (id: string) => void;
  onPublishedClear: () => void;
}

export default function EmailHistory({
  history,
  activeId,
  onSelect,
  onDelete,
  onClear,
  isOpen,
  onToggle,
  published,
  onPublishedDelete,
  onPublishedClear,
}: EmailHistoryProps) {
  const [confirmClear, setConfirmClear] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("history");
  const { copyToClipboard } = useClipboard();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const truncate = (text: string, length: number) => {
    if (text.length <= length) return text;
    return text.slice(0, length).trim() + "...";
  };

  const handleClearClick = () => {
    if (confirmClear) {
      if (activeTab === "history") onClear();
      else onPublishedClear();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  const switchTab = (tab: TabId) => {
    setActiveTab(tab);
    setConfirmClear(false);
  };

  const handleCopyUrl = async (id: string, url: string) => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const activeList = activeTab === "history" ? history : published;

  return (
    <>
      {/* Toggle Button (visible when sidebar is closed) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-xl bg-bg-card border-2 border-border-subtle hover:border-accent-blue/50 text-text-secondary hover:text-accent-blue transition-all shadow-lg group cursor-pointer"
          title="Open email history"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="absolute -top-2 -right-2 flex flex-col gap-0.5 items-end">
            {history.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-accent-blue text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {history.length > 99 ? "99+" : history.length}
              </span>
            )}
            {published.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-accent-teal text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {published.length > 99 ? "99+" : published.length}
              </span>
            )}
          </div>
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed left-0 top-0 h-full z-50 transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Backdrop on mobile */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 md:bg-black/30"
            onClick={onToggle}
          />
        )}

        {/* Sidebar content */}
        <div className="relative h-full w-80 bg-bg-secondary border-r-2 border-border-subtle shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-gradient-to-r from-accent-blue/10 to-transparent">
            <h2 className="text-base font-bold text-text-primary">Email Library</h2>
            <div className="flex items-center gap-1">
              {activeList.length > 0 && (
                <button
                  onClick={handleClearClick}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    confirmClear
                      ? "bg-accent-rose text-white"
                      : "text-text-muted hover:text-accent-rose hover:bg-accent-rose/10"
                  }`}
                  title={confirmClear ? "Click again to confirm" : `Clear all ${activeTab}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              <button
                onClick={onToggle}
                className="p-2 rounded-lg hover:bg-bg-card text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border-subtle">
            <button
              onClick={() => switchTab("history")}
              className={`flex-1 py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "history"
                  ? "text-accent-blue border-b-2 border-accent-blue bg-accent-blue/5"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              History
              {history.length > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === "history"
                    ? "bg-accent-blue/20 text-accent-blue"
                    : "bg-bg-card text-text-muted"
                }`}>
                  {history.length}
                </span>
              )}
            </button>
            <button
              onClick={() => switchTab("published")}
              className={`flex-1 py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "published"
                  ? "text-accent-teal border-b-2 border-accent-teal bg-accent-teal/5"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Shared
              {published.length > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === "published"
                    ? "bg-accent-teal/20 text-accent-teal"
                    : "bg-bg-card text-text-muted"
                }`}>
                  {published.length}
                </span>
              )}
            </button>
          </div>

          {/* Content List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {/* ===== HISTORY TAB ===== */}
            {activeTab === "history" && (
              <>
                {history.length === 0 ? (
                  <div className="text-center py-12 text-text-muted">
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">No emails yet</p>
                    <p className="text-xs mt-1">Generated emails will appear here</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelect(item)}
                      className={`
                        relative p-3 rounded-xl cursor-pointer transition-all duration-200 group border-2
                        ${
                          activeId === item.id
                            ? "bg-accent-blue/10 border-accent-blue"
                            : "bg-bg-card border-border-subtle hover:border-accent-blue/30"
                        }
                      `}
                    >
                      {/* Tone badge + time */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`
                          px-2 py-0.5 rounded-full text-xs font-semibold capitalize
                          ${activeId === item.id ? "bg-accent-blue text-white" : "bg-bg-secondary text-text-secondary"}
                        `}>
                          {item.tones.join(" + ")}
                        </span>
                        <span className="text-xs text-text-muted">
                          {formatTime(item.timestamp)}
                        </span>
                      </div>

                      {/* Transcript preview */}
                      <p className={`text-sm mb-1 ${activeId === item.id ? "text-text-primary" : "text-text-secondary"}`}>
                        {truncate(item.transcript, 60)}
                      </p>

                      {/* Email preview */}
                      <p className="text-xs text-text-muted line-clamp-2">
                        {truncate(item.email.replace(/^subject:.*\n?\n?/i, ""), 80)}
                      </p>

                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item.id);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-bg-secondary/80 text-text-muted opacity-0 group-hover:opacity-100 hover:text-accent-rose hover:bg-accent-rose/10 transition-all cursor-pointer"
                        title="Delete"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>

                      {/* Active indicator bar */}
                      {activeId === item.id && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent-blue rounded-r-full" />
                      )}
                    </div>
                  ))
                )}
              </>
            )}

            {/* ===== PUBLISHED TAB ===== */}
            {activeTab === "published" && (
              <>
                {published.length === 0 ? (
                  <div className="text-center py-12 text-text-muted">
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <p className="text-sm">No shared emails</p>
                    <p className="text-xs mt-1">Use the Share button to publish emails</p>
                  </div>
                ) : (
                  published.map((item) => (
                    <div
                      key={item.id}
                      className="relative p-3 rounded-xl bg-bg-card border-2 border-border-subtle hover:border-accent-teal/30 transition-all duration-200 group"
                    >
                      {/* Tone badge + time */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-accent-teal/20 text-accent-teal text-xs font-semibold capitalize">
                          {item.tones.split(",").join(" + ")}
                        </span>
                        <span className="text-xs text-text-muted">
                          {formatTime(item.timestamp)}
                        </span>
                      </div>

                      {/* Transcript preview */}
                      <p className="text-sm text-text-secondary mb-2">
                        {truncate(item.transcript, 60)}
                      </p>

                      {/* Action buttons */}
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleCopyUrl(item.id, item.url)}
                          className={`flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            copiedId === item.id
                              ? "bg-accent-teal text-white"
                              : "bg-bg-secondary text-text-secondary hover:text-accent-teal hover:bg-accent-teal/10"
                          }`}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          {copiedId === item.id ? "Copied!" : "Copy Link"}
                        </button>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-bg-secondary text-text-secondary hover:text-accent-blue hover:bg-accent-blue/10 transition-all"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          View
                        </a>
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={() => onPublishedDelete(item.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-bg-secondary/80 text-text-muted opacity-0 group-hover:opacity-100 hover:text-accent-rose hover:bg-accent-rose/10 transition-all cursor-pointer"
                        title="Delete"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {activeList.length > 0 && (
            <div className="p-3 border-t border-border-subtle">
              <button
                onClick={handleClearClick}
                className={`
                  w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer
                  ${
                    confirmClear
                      ? "bg-accent-rose text-white"
                      : "bg-bg-card border border-border-subtle text-text-secondary hover:border-accent-rose/40 hover:text-accent-rose"
                  }
                `}
              >
                {confirmClear ? "Click again to confirm" : `Clear All ${activeTab === "history" ? "History" : "Shared"}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
