import { Link, createFileRoute } from "@tanstack/react-router";
import { Ear, MessageCircle, Mic } from "lucide-react";
import { LookAndSound } from "@/components/controls";
import { Shell } from "@/components/shell";
import { ACTIVITY_META, MODE_META, isToday, useTalk, type ActivityKind } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Practice · Talk Steps" }] }),
  component: Home,
});

const ICONS: Record<ActivityKind, typeof Ear> = {
  picture: Ear,
  say: Mic,
  turns: MessageCircle,
};

function Home() {
  const activities = useTalk((state) => state.activities);
  const modes = useTalk((state) => state.modes);
  const student = useTalk((state) => state.students.find((item) => item.id === state.activeStudentId));
  const attempts = useTalk((state) => state.attempts);
  const goal = useTalk((state) => state.settings.goal);
  const noticeDismissed = useTalk((state) => state.noticeDismissed);
  const dismissNotice = useTalk((state) => state.dismissNotice);
  const order: ActivityKind[] = ["picture", "say", "turns"];
  const open = order.filter((kind) => activities.includes(kind));
  const tries = attempts.filter((item) => item.studentId === student?.id && isToday(item.at)).length;

  return (
    <Shell>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <h1 className="text-3xl font-bold">Hi, {student?.name ?? "there"}.</h1>
          <p className="max-w-2xl text-muted">
            Pick a way to practice. You can look, listen, tap, type, or say it.
          </p>
          <p className="text-sm font-bold tabular-nums">
            {tries} {tries === 1 ? "try" : "tries"} today. Goal is {goal}.
            {tries >= goal ? " You met today’s goal." : ""}
          </p>
        </div>

        {!noticeDismissed && (
          <section className="panel grid gap-3">
            <h2 className="text-lg font-bold">What this is</h2>
            <p>
              Talk Steps helps you practice words, requests, and turns in a conversation. It does not
              test or diagnose speech. A teacher or speech-language pathologist can set the plan.
              Scores stay on this device.
            </p>
            <button type="button" className="btn btn-primary w-fit" onClick={dismissNotice}>
              Got it
            </button>
          </section>
        )}

        {open.length === 0 ? (
          <section className="panel grid gap-3">
            <h2 className="text-lg font-bold">No practice is turned on</h2>
            <p className="text-muted">Open the teacher desk to choose activities.</p>
            <Link to="/teacher" className="btn btn-primary w-fit">
              Teacher desk
            </Link>
          </section>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {open.map((kind) => {
              const meta = ACTIVITY_META[kind];
              const Glyph = ICONS[kind];
              return (
                <article key={kind} className="panel grid content-between gap-4">
                  <div className="grid gap-3">
                    <div className="grid size-14 place-items-center rounded-lg bg-accent-soft text-accent">
                      <Glyph className="size-7" aria-hidden />
                    </div>
                    <h2 className="text-lg font-bold">{meta.title}</h2>
                    <p className="text-muted">{meta.blurb}</p>
                    <p className="text-sm text-muted">
                      Answer by {modes.map((mode) => MODE_META[mode].label.toLowerCase()).join(", ")}.
                    </p>
                  </div>
                  <Link to="/practice/$kind" params={{ kind }} className="btn btn-primary btn-lg">
                    {meta.action}
                  </Link>
                </article>
              );
            })}
          </div>
        )}

        <LookAndSound />
      </div>
    </Shell>
  );
}
