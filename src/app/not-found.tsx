import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-3xl border border-white/5 bg-surface/70 p-8 text-center backdrop-blur-xl">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-100">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <div className="mt-6 flex justify-center">
          <Button asChild>
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
