import { Link, createFileRoute } from "@tanstack/react-router";
import { LookAndSound } from "@/components/controls";
import { PracticeView } from "@/components/practice-view";
import { Shell } from "@/components/shell";
import type { ActivityKind } from "@/lib/store";

export const Route = createFileRoute("/practice/$kind")({
  head: () => ({ meta: [{ title: "Practice set · Talk Steps" }] }),
  component: PracticePage,
});

function isKind(value: string): value is ActivityKind {
  return value === "picture" || value === "say" || value === "turns";
}

function PracticePage() {
  const { kind } = Route.useParams();
  return (
    <Shell>
      <div className="grid gap-6">
        {isKind(kind) ? (
          <PracticeView kind={kind} />
        ) : (
          <section className="panel grid gap-3">
            <h1 className="text-3xl font-bold">That practice is not here.</h1>
            <Link to="/" className="btn btn-primary w-fit">
              Back to practice
            </Link>
          </section>
        )}
        <LookAndSound compact />
      </div>
    </Shell>
  );
}
