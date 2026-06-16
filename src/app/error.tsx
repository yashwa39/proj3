"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Avoid leaking sensitive info; keep console logs minimal.
    console.error("App error", { digest: error.digest });
  }, [error.digest]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-3xl border border-red-500/20 bg-surface/70 p-8 text-center backdrop-blur-xl">
        <h2 className="text-lg font-bold text-slate-100">Something went wrong</h2>
        <p className="mt-2 text-sm text-slate-400">
          We couldn’t complete that action. Please try again.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reload
          </Button>
          <Button onClick={reset}>Try again</Button>
        </div>
      </div>
    </div>
  );
}
