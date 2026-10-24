import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { TeacherView } from "@/components/teacher-view";

export const Route = createFileRoute("/teacher")({
  head: () => ({ meta: [{ title: "Teacher desk · Talk Steps" }] }),
  component: TeacherPage,
});

function TeacherPage() {
  return (
    <Shell>
      <TeacherView />
    </Shell>
  );
}
