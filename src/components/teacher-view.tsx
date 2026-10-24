import { useEffect, useMemo, useRef, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CATEGORIES, SEED_TURNS } from "@/data/catalog";
import { ICON_CHOICES, IconView, type IconName } from "@/data/icons";
import { speak } from "@/lib/speech";
import {
  ACTIVITY_META,
  MODE_META,
  RESULT_LABEL,
  allWords,
  useTalk,
  type ActivityKind,
  type Attempt,
  type Mode,
} from "@/lib/store";

const ACTIVITIES: ActivityKind[] = ["picture", "say", "turns"];
const MODES: Mode[] = ["tap", "type", "speak"];

export function TeacherView() {
  const pin = useTalk((state) => state.pin);
  const hydrated = useTalk((state) => state.hydrated);
  const [unlocked, setUnlocked] = useState(pin.length === 0);
  const [code, setCode] = useState("");
  const [miss, setMiss] = useState(false);
  const setPin = useTalk((state) => state.setPin);

  useEffect(() => {
    if (pin.length === 0) {
      setUnlocked(true);
      return;
    }
    try {
      if (sessionStorage.getItem("talk-steps-desk") === "open") setUnlocked(true);
    } catch {
      /* private mode */
    }
  }, [pin]);

  if (!hydrated) {
    return <p className="text-muted">Opening the desk…</p>;
  }

  if (!unlocked) {
    return (
      <section className="panel mx-auto grid max-w-lg gap-4">
        <h1 className="text-3xl font-bold">Teacher desk</h1>
        <p className="text-muted">
          Enter the 4-digit code. This only hides the desk on this device. It is not an account and
          it does not encrypt student information.
        </p>
        <form
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (code === pin) {
              setUnlocked(true);
              setMiss(false);
              try {
                sessionStorage.setItem("talk-steps-desk", "open");
              } catch {
                /* ignore */
              }
            } else {
              setMiss(true);
            }
          }}
        >
          <label className="grid gap-2">
            <span className="font-bold">Code</span>
            <input
              className="field tabular-nums"
              inputMode="numeric"
              autoComplete="off"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 4))}
            />
          </label>
          {miss && (
            <p className="text-sm text-danger" role="alert">
              That code does not match.
            </p>
          )}
          <button type="submit" className="btn btn-primary btn-lg">
            Open desk
          </button>
        </form>
        <button
          type="button"
          className="btn btn-ghost justify-self-start"
          onClick={() => {
            setPin("");
            setUnlocked(true);
          }}
        >
          Forgot the code? Remove it
        </button>
        <p className="text-sm text-muted">
          Anyone at this device can remove the code. Do not store private or medical details here.
        </p>
      </section>
    );
  }

  return (
    <div className="grid gap-8">
      <div className="grid gap-2">
        <h1 className="text-3xl font-bold">Teacher desk</h1>
        <p className="max-w-2xl text-muted">
          Set practice, switch students, and read progress. Nothing is uploaded. This desk does not
          diagnose and does not replace professional care.
        </p>
        <nav className="flex flex-wrap gap-2" aria-label="Desk sections">
          <a className="btn btn-quiet" href="#plan">
            Plan
          </a>
          <a className="btn btn-quiet" href="#students">
            Students
          </a>
          <a className="btn btn-quiet" href="#progress">
            Progress
          </a>
          <a className="btn btn-quiet" href="#privacy">
            Privacy
          </a>
        </nav>
      </div>
      <Plan />
      <Students />
      <Progress />
      <Privacy />
    </div>
  );
}

function Plan() {
  const activities = useTalk((state) => state.activities);
  const modes = useTalk((state) => state.modes);
  const wordIds = useTalk((state) => state.wordIds);
  const turnIds = useTalk((state) => state.turnIds);
  const customWords = useTalk((state) => state.customWords);
  const goal = useTalk((state) => state.settings.goal);
  const rate = useTalk((state) => state.settings.rate);
  const volume = useTalk((state) => state.settings.volume);
  const toggleActivity = useTalk((state) => state.toggleActivity);
  const toggleMode = useTalk((state) => state.toggleMode);
  const toggleWord = useTalk((state) => state.toggleWord);
  const toggleTurn = useTalk((state) => state.toggleTurn);
  const addWord = useTalk((state) => state.addWord);
  const removeCustomWord = useTalk((state) => state.removeCustomWord);
  const patchSettings = useTalk((state) => state.patchSettings);
  const library = allWords(customWords);

  const [word, setWord] = useState("");
  const [hint, setHint] = useState("");
  const [parts, setParts] = useState("");
  const [category, setCategory] = useState("Other");
  const [icon, setIcon] = useState<IconName>("Apple");
  const [error, setError] = useState("");

  return (
    <section id="plan" className="grid gap-4">
      <h2 className="text-lg font-bold">Practice plan</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <fieldset className="panel grid gap-3">
          <legend className="text-lg font-bold">Activities</legend>
          {ACTIVITIES.map((kind) => (
            <label key={kind} className="flex items-start gap-3">
              <input
                className="mt-1"
                type="checkbox"
                checked={activities.includes(kind)}
                onChange={() => toggleActivity(kind)}
              />
              <span>
                <span className="block font-bold">{ACTIVITY_META[kind].title}</span>
                <span className="block text-sm text-muted">{ACTIVITY_META[kind].blurb}</span>
              </span>
            </label>
          ))}
        </fieldset>
        <fieldset className="panel grid gap-3">
          <legend className="text-lg font-bold">Ways to answer</legend>
          <p className="text-sm text-muted">At least one stays on.</p>
          {MODES.map((mode) => (
            <label key={mode} className="flex items-start gap-3">
              <input
                className="mt-1"
                type="checkbox"
                checked={modes.includes(mode)}
                onChange={() => toggleMode(mode)}
              />
              <span>
                <span className="block font-bold">{MODE_META[mode].label}</span>
                <span className="block text-sm text-muted">{MODE_META[mode].hint}</span>
              </span>
            </label>
          ))}
          <label className="grid gap-1">
            <span className="font-bold">Daily try goal</span>
            <input
              className="field tabular-nums"
              type="number"
              min={1}
              max={30}
              value={goal}
              onChange={(event) => patchSettings({ goal: clamp(Number(event.target.value), 1, 30) })}
            />
          </label>
        </fieldset>
      </div>

      <div className="panel grid gap-4">
        <h3 className="text-lg font-bold">Words</h3>
        {CATEGORIES.map((categoryName) => {
          const group = library.filter((item) => item.category === categoryName);
          if (group.length === 0) return null;
          return (
            <fieldset key={categoryName} className="grid gap-2">
              <legend className="font-bold">{categoryName}</legend>
              <ul className="grid gap-2">
                {group.map((item) => (
                  <li key={item.id} className="flex flex-wrap items-center gap-3">
                    <label className="flex min-h-12 flex-1 items-center gap-3">
                      <input
                        type="checkbox"
                        checked={wordIds.includes(item.id)}
                        onChange={() => toggleWord(item.id)}
                      />
                      <IconView name={item.icon} className="size-6 text-accent" />
                      <span>
                        <span className="font-bold">{item.word}</span>
                        <span className="ml-2 text-sm text-muted">{item.hint}</span>
                      </span>
                    </label>
                    <button
                      type="button"
                      className="btn btn-quiet"
                      onClick={() => speak(item.word, { rate, volume })}
                    >
                      Hear
                    </button>
                    {item.id.startsWith("c-") && (
                      <button type="button" className="btn btn-danger" onClick={() => removeCustomWord(item.id)}>
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </fieldset>
          );
        })}

        <form
          className="grid gap-3 border-t border-line pt-4"
          onSubmit={(event) => {
            event.preventDefault();
            const message = addWord({
              id: "new",
              word,
              hint,
              icon,
              category,
              syllables: parts.split("-").map((part) => part.trim()).filter(Boolean),
            });
            if (message) {
              setError(message);
              return;
            }
            setError("");
            setWord("");
            setHint("");
            setParts("");
          }}
        >
          <h3 className="text-lg font-bold">Add a word</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="font-bold">Word</span>
              <input className="field" value={word} onChange={(event) => setWord(event.target.value)} />
            </label>
            <label className="grid gap-1">
              <span className="font-bold">Hint</span>
              <input className="field" value={hint} onChange={(event) => setHint(event.target.value)} />
            </label>
            <label className="grid gap-1">
              <span className="font-bold">Syllables</span>
              <input
                className="field"
                value={parts}
                placeholder="wa-ter"
                onChange={(event) => setParts(event.target.value)}
              />
            </label>
            <label className="grid gap-1">
              <span className="font-bold">Category</span>
              <select className="field" value={category} onChange={(event) => setCategory(event.target.value)}>
                {CATEGORIES.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>
          </div>
          <fieldset className="grid gap-2">
            <legend className="font-bold">Picture</legend>
            <div className="flex flex-wrap gap-2">
              {ICON_CHOICES.map((name) => (
                <button
                  key={name}
                  type="button"
                  className={
                    icon === name
                      ? "grid size-12 place-items-center rounded-md bg-accent text-accent-fg"
                      : "grid size-12 place-items-center rounded-md border border-line-strong bg-surface text-ink"
                  }
                  aria-pressed={icon === name}
                  aria-label={name.replace(/([a-z])([A-Z])/g, "$1 $2")}
                  onClick={() => setIcon(name)}
                >
                  <IconView name={name} className="size-6" />
                </button>
              ))}
            </div>
          </fieldset>
          {error && (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="btn btn-primary w-fit">
            Add word
          </button>
        </form>
      </div>

      <fieldset className="panel grid gap-3">
        <legend className="text-lg font-bold">Conversation turns</legend>
        <ul className="grid gap-3">
          {SEED_TURNS.map((turn) => (
            <li key={turn.id} className="flex flex-wrap items-center gap-3">
              <label className="flex min-h-12 flex-1 items-start gap-3">
                <input
                  className="mt-1"
                  type="checkbox"
                  checked={turnIds.includes(turn.id)}
                  onChange={() => toggleTurn(turn.id)}
                />
                <span>
                  <span className="block font-bold">{turn.title}</span>
                  <span className="block text-sm text-muted">{turn.model}</span>
                </span>
              </label>
              <button
                type="button"
                className="btn btn-quiet"
                onClick={() => speak(turn.model.replaceAll("{name}", "Alex"), { rate, volume })}
              >
                Hear
              </button>
            </li>
          ))}
        </ul>
      </fieldset>
    </section>
  );
}

function Students() {
  const students = useTalk((state) => state.students);
  const activeStudentId = useTalk((state) => state.activeStudentId);
  const notes = useTalk((state) => state.notes);
  const setActiveStudent = useTalk((state) => state.setActiveStudent);
  const addStudent = useTalk((state) => state.addStudent);
  const renameStudent = useTalk((state) => state.renameStudent);
  const removeStudent = useTalk((state) => state.removeStudent);
  const setNote = useTalk((state) => state.setNote);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  return (
    <section id="students" className="panel grid gap-4">
      <h2 className="text-lg font-bold">Students</h2>
      <p className="text-sm text-muted">
        Use a first name or nickname. Do not write diagnoses, full names, or medical details in notes.
        Notes never leave this browser.
      </p>
      <ul className="grid gap-4">
        {students.map((student) => (
          <li key={student.id} className="grid gap-3 border-b border-line pb-4">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex min-h-12 items-center gap-2 font-bold">
                <input
                  type="radio"
                  name="active-student"
                  checked={student.id === activeStudentId}
                  onChange={() => setActiveStudent(student.id)}
                />
                Practicing
              </label>
              <label className="grid min-w-48 flex-1 gap-1">
                <span className="sr-only">Name</span>
                <input
                  className="field"
                  value={student.name}
                  onChange={(event) => renameStudent(student.id, event.target.value)}
                />
              </label>
              <button
                type="button"
                className="btn btn-danger"
                disabled={students.length < 2}
                onClick={() => removeStudent(student.id)}
              >
                Remove
              </button>
            </div>
            <label className="grid gap-1">
              <span className="text-sm font-bold">Practice note</span>
              <textarea
                className="field area"
                value={notes[student.id] ?? ""}
                onChange={(event) => setNote(student.id, event.target.value)}
              />
            </label>
          </li>
        ))}
      </ul>
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          const message = addStudent(name);
          if (message) {
            setError(message);
            return;
          }
          setError("");
          setName("");
        }}
      >
        <label className="grid min-w-48 flex-1 gap-1">
          <span className="font-bold">Add a student</span>
          <input
            className="field"
            value={name}
            placeholder="First name"
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </form>
      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}

function Progress() {
  const students = useTalk((state) => state.students);
  const activeStudentId = useTalk((state) => state.activeStudentId);
  const attempts = useTalk((state) => state.attempts);
  const [filter, setFilter] = useState(activeStudentId);

  const shown = attempts.filter((item) => filter === "all" || item.studentId === filter);
  const clear = shown.filter((item) => item.result === "clear").length;
  const again = shown.filter((item) => item.result === "again").length;
  const recent = [...shown].reverse().slice(0, 12);

  return (
    <section id="progress" className="panel grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Progress</h2>
          <p className="text-sm text-muted">
            Sample tries for Alex are included so this view is not empty. Clear them under Privacy.
          </p>
        </div>
        <label className="grid gap-1">
          <span className="text-sm font-bold">Show</span>
          <select className="field" value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="all">All students</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Tries" value={shown.length} />
        <Stat label="Clear" value={clear} />
        <Stat label="Try again" value={again} />
      </div>
      <p className="sr-only">
        {shown.length} tries. {clear} clear. {again} marked try again. Bars group tries by activity.
      </p>
      {shown.length === 0 ? (
        <p>No practice yet. When a student finishes a card, it shows up here.</p>
      ) : (
        <ProgressChart attempts={shown} />
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
          <caption className="mb-2 text-left font-bold">Recent tries</caption>
          <thead>
            <tr className="border-b border-line">
              <th className="py-2 pr-3 font-bold">When</th>
              <th className="py-2 pr-3 font-bold">Student</th>
              <th className="py-2 pr-3 font-bold">Activity</th>
              <th className="py-2 pr-3 font-bold">Item</th>
              <th className="py-2 pr-3 font-bold">How</th>
              <th className="py-2 font-bold">Result</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((item) => (
              <tr key={item.id} className="border-b border-line">
                <td className="py-2 pr-3 tabular-nums">{formatWhen(item.at)}</td>
                <td className="py-2 pr-3">{students.find((student) => student.id === item.studentId)?.name ?? "Student"}</td>
                <td className="py-2 pr-3">{ACTIVITY_META[item.activity].title}</td>
                <td className="py-2 pr-3">{item.label}</td>
                <td className="py-2 pr-3">{MODE_META[item.mode].label}</td>
                <td className="py-2">{RESULT_LABEL[item.result]}</td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr>
                <td className="py-3" colSpan={6}>
                  No tries for this view yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-line bg-bg p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="text-3xl font-bold tabular-nums">{value}</p>
    </div>
  );
}

function ProgressChart({ attempts }: { attempts: Attempt[] }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const data = useMemo(
    () =>
      ACTIVITIES.map((activity) => ({
        name: ACTIVITY_META[activity].title.replace(" the ", " ").replace(" a ", " "),
        clear: attempts.filter((item) => item.activity === activity && item.result === "clear").length,
        close: attempts.filter((item) => item.activity === activity && (item.result === "close" || item.result === "said")).length,
        again: attempts.filter((item) => item.activity === activity && item.result === "again").length,
      })),
    [attempts],
  );
  if (!ready) return <div className="h-60 rounded-lg bg-bg" aria-hidden />;
  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="var(--color-line)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "var(--color-muted)", fontSize: 12 }} />
          <YAxis allowDecimals={false} width={32} tick={{ fill: "var(--color-muted)", fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="clear" stackId="tries" fill="var(--color-accent)" name="Clear" />
          <Bar dataKey="close" stackId="tries" fill="var(--color-line-strong)" name="Close or said" />
          <Bar dataKey="again" stackId="tries" fill="var(--color-try)" name="Try again" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function Privacy() {
  const pin = useTalk((state) => state.pin);
  const setPin = useTalk((state) => state.setPin);
  const clearProgress = useTalk((state) => state.clearProgress);
  const resetDevice = useTalk((state) => state.resetDevice);

  return (
    <section id="privacy" className="panel grid gap-4">
      <h2 className="text-lg font-bold">Privacy</h2>
      <p>
        Practice stays in this browser. Talk Steps does not claim to diagnose a speech or language
        disorder and is not a medical record. Export a copy if you need it, then store that file
        somewhere you control.
      </p>
      <label className="grid max-w-xs gap-1">
        <span className="font-bold">Teacher code</span>
        <input
          className="field tabular-nums"
          inputMode="numeric"
          autoComplete="off"
          value={pin}
          placeholder="Optional, 4 digits"
          onChange={(event) => setPin(event.target.value)}
        />
        <span className="text-sm text-muted">Leave blank to keep the desk open. This is not encryption.</span>
      </label>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="btn btn-quiet"
          onClick={() => {
            const state = useTalk.getState();
            const snapshot = {
              students: state.students,
              attempts: state.attempts,
              notes: state.notes,
              customWords: state.customWords,
              wordIds: state.wordIds,
              turnIds: state.turnIds,
              activities: state.activities,
              modes: state.modes,
              settings: state.settings,
            };
            const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "talk-steps-progress.json";
            link.click();
            URL.revokeObjectURL(url);
          }}
        >
          Download progress
        </button>
        <Confirm
          label="Clear progress"
          title="Clear progress on this device?"
          body="Tries are removed. Students, notes, and the plan stay."
          confirm="Clear progress"
          onConfirm={clearProgress}
        />
        <Confirm
          label="Reset this device"
          title="Reset Talk Steps on this device?"
          body="Students, notes, the plan, the code, and progress return to the starter example."
          confirm="Reset"
          onConfirm={resetDevice}
        />
      </div>
    </section>
  );
}

function Confirm({
  label,
  title,
  body,
  confirm,
  onConfirm,
}: {
  label: string;
  title: string;
  body: string;
  confirm: string;
  onConfirm: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" className="btn btn-danger" onClick={() => ref.current?.showModal()}>
        {label}
      </button>
      <dialog ref={ref} className="sheet">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-2">{body}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className="btn btn-quiet" onClick={() => ref.current?.close()}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              onConfirm();
              ref.current?.close();
            }}
          >
            {confirm}
          </button>
        </div>
      </dialog>
    </>
  );
}

function clamp(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function formatWhen(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
