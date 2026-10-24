import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { MessageCircle } from "lucide-react";
import { useTalk } from "@/lib/store";

export function Shell({ children }: { children: ReactNode }) {
  const student = useTalk((state) =>
    state.students.find((item) => item.id === state.activeStudentId),
  );

  return (
    <div className="min-h-dvh bg-bg text-ink">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
          <Link to="/" className="inline-flex min-h-12 items-center gap-2 font-bold text-ink no-underline">
            <MessageCircle className="size-6 text-accent" aria-hidden />
            Talk Steps
          </Link>
          <nav className="flex items-center gap-2" aria-label="Main">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              className="btn btn-ghost"
              activeProps={{ className: "btn btn-quiet" }}
            >
              Practice
            </Link>
            <Link
              to="/teacher"
              className="btn btn-ghost"
              activeProps={{ className: "btn btn-quiet" }}
            >
              Teacher desk
            </Link>
          </nav>
          <p className="ml-auto text-sm text-muted">
            Practicing: <span className="font-bold text-ink">{student?.name ?? "Student"}</span>
          </p>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-5xl px-4 py-6 outline-none">
        {children}
      </main>
      <footer className="mx-auto max-w-5xl px-4 pb-10">
        <p className="text-sm text-muted">
          Talk Steps is a practice tool. It does not diagnose, treat, or score a speech or language
          disorder, and it does not replace a speech-language pathologist, teacher, or other
          professional care. Names, notes, and progress stay in this browser. Your voice is not
          recorded or saved.
        </p>
      </footer>
    </div>
  );
}
