"use client";

import { ArrowDownToLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolvePrimaryDownload, useOs } from "@/hooks/use-os";

interface OsDownloadButtonProps {
  /** "primary" = crimson filled, "ghost" = bordered glass */
  variant?: "primary" | "ghost";
  className?: string;
}

/**
 * Smart primary CTA — labels itself with the visitor's own OS
 * ("Download for Windows / macOS / Linux / Android") and links straight
 * to that build. Renders as "Download for Windows" on the server, then
 * upgrades in place once the client resolves the real OS.
 */
export function OsDownloadButton({
  variant = "primary",
  className,
}: OsDownloadButtonProps) {
  const os = useOs();
  const target = resolvePrimaryDownload(os);

  return (
    <a
      href={target.url}
      className={cn(
        "inline-flex items-center gap-2.5 px-7 py-3.5 text-sm",
        variant === "primary" ? "btn-primary" : "btn-ghost",
        className
      )}
    >
      <ArrowDownToLine className="h-4 w-4" aria-hidden />
      {target.label}
    </a>
  );
}
