import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { CircleCheck, Ear, Info, RotateCcw } from "lucide-react";
import { fillName, SEED_TURNS, type Turn, type Word } from "@/data/catalog";
import { IconView } from "@/data/icons";
import { hash, saidWell } from "@/lib/match";
import { canListen, listenOnce, speak, stopSpeech } from "@/lib/speech";
import {
  ACTIVITY_META,
  MODE_META,
  allWords,
  useTalk,
  type ActivityKind,
  type Mode,
  type Result,
} from "@/lib/store";

type Item = { id: string; label: string; spoken: string; icon: Word["icon"]; syllables: string[] };

export function PracticeView({ kind }: { kind: ActivityKind }) {
  const customWords = useTalk((state) => state.customWords);
  const wordIds = useTalk((state) => state.wordIds);
  const turnIds = useTalk((state) => state.turnIds);
  const modes = useTalk((state) => state.modes);
  const settings = useTalk((state) => state.settings);
  const student = useTalk((state) => state.students.find((item) => item.id === state.activeStudentId));
  const logAttempt = useTalk((state) => state.logAttempt);

  const words = useMemo(() => {
    const library = allWords(customWords);
    return wordIds
      .map((id) => library.find((word) => word.id === id))
      .filter((word): word is Word => Boolean(word));
  }, [customWords, wordIds]);

  const turns = useMemo(
    () =>
      turnIds
        .map((id) => SEED_TURNS.find((turn) => turn.id === id))
        .filter((turn): turn is Turn => Boolean(turn)),
    [turnIds],
  );

  const items: Item[] = useMemo(() => {
    const name = student?.name ?? "friend";
    if (kind === "turns") {
      return turns.map((turn) => ({
        id: turn.id,
        label: turn.title,
        spoken: fillName(turn.model, name),
        icon: turn.icon,
        syllables: [],
      }));
    }
    return words.map((word) => ({
      id: word.id,
      label: word.word,
      spoken: word.word,
      icon: word.icon,
      syllables: word.syllables,
    }));
  }, [kind, student?.name, turns, words]);

  if (modes.length === 0) {
    return <Empty title="No way to answer is turned on." />;
  }
  if (kind === "turns" && items.length === 0) {
    return <Empty title="No conversation turns are in the plan." />;
  }
  if (kind !== "turns" && words.length < (kind === "picture" ? 2 : 1)) {
    return (
      <Empty
        title={
          kind === "picture"
            ? "Picture practice needs at least two words."
            : "Add a word to the plan to practice saying it."
        }
      />
    );
  }

  return (
    <Player
      key={`${kind}-${student?.id ?? "none"}`}
      kind={kind}
      items={items}
      words={words}
      turns={turns}
      modes={modes}
      studentId={student?.id ?? "alex"}
      studentName={student?.name ?? "friend"}
      logAttempt={logAttempt}
    />
  );
}

function Empty({ title }: { title: string }) {
  return (
    <section className="panel grid gap-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-muted">A teacher can turn activities and words on from the teacher desk.</p>
      <Link to="/teacher" className="btn btn-primary w-fit">
        Open teacher desk
      </Link>
    </section>
  );
}

function Player({
  kind,
  items,
  words,
  turns,
  modes,
  studentId,
  studentName,
  logAttempt,
}: {
  kind: ActivityKind;
  items: Item[];
  words: Word[];
  turns: Turn[];
  modes: Mode[];
  studentId: string;
  studentName: string;
  logAttempt: ReturnType<typeof useTalk.getState>["logAttempt"];
}) {
  const settings = useTalk((state) => state.settings);
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<Mode>(modes.includes("tap") ? "tap" : modes[0]);
  const [feedback, setFeedback] = useState<{ result: Result; text: string } | null>(null);
  const [typed, setTyped] = useState("");
  const [listening, setListening] = useState(false);
  const [listenNote, setListenNote] = useState("");
  const [done, setDone] = useState(false);
  const [pulse, setPulse] = useState(-1);
  const [tally, setTally] = useState({ clear: 0, close: 0, again: 0, said: 0 });
  const stopListen = useRef<() => void>(() => {});
  const pulseTimer = useRef<number | null>(null);

  const safeIndex = Math.min(index, Math.max(items.length - 1, 0));
  const item = items[safeIndex];
  const turn = turns.find((entry) => entry.id === item?.id);
  const meta = ACTIVITY_META[kind];

  useEffect(() => {
    if (!modes.includes(mode)) setMode(modes[0]);
  }, [mode, modes]);

  useEffect(() => {
    return () => {
      stopListen.current();
      stopSpeech();
      if (pulseTimer.current) window.clearInterval(pulseTimer.current);
    };
  }, []);

  function play(text: string, syllables: string[]) {
    stopSpeech();
    if (pulseTimer.current) window.clearInterval(pulseTimer.current);
    setPulse(syllables.length > 1 ? 0 : -1);
    if (syllables.length > 1) {
      let step = 0;
      const wait = Math.max(280, Math.round(520 / settings.rate));
      pulseTimer.current = window.setInterval(() => {
        step += 1;
        if (step >= syllables.length) {
          setPulse(-1);
          if (pulseTimer.current) window.clearInterval(pulseTimer.current);
          return;
        }
        setPulse(step);
      }, wait);
    }
    speak(text, { rate: settings.rate, volume: settings.volume });
  }

  function resetCard() {
    setFeedback(null);
    setTyped("");
    setListenNote("");
    setListening(false);
    stopListen.current();
  }

  function finish(result: Result, text: string, used: Mode) {
    if (!item) return;
    setFeedback({ result, text });
    setTally((current) => ({ ...current, [result]: current[result] + 1 }));
    logAttempt({
      studentId,
      activity: kind,
      itemId: item.id,
      label: item.label,
      mode: used,
      result,
    });
  }

  function goNext() {
    resetCard();
    if (safeIndex + 1 >= items.length) {
      setDone(true);
      stopSpeech();
      return;
    }
    const next = items[safeIndex + 1];
    setIndex(safeIndex + 1);
    if (settings.autoHear && next) play(next.spoken, next.syllables);
  }

  if (!item) return <Empty title="Nothing is ready to practice." />;

  if (done) {
    const tries = tally.clear + tally.close + tally.again + tally.said;
    return (
      <section className="panel grid gap-4">
        <h1 className="text-3xl font-bold">You finished this set.</h1>
        <p className="text-muted">
          {tries} {tries === 1 ? "try" : "tries"} in {meta.title.toLowerCase()}. Clear:{" "}
          <span className="tabular-nums font-bold text-ink">{tally.clear}</span>. Close:{" "}
          <span className="tabular-nums font-bold text-ink">{tally.close}</span>. This is practice,
          not a test of speech.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => {
              setDone(false);
              setIndex(0);
              setTally({ clear: 0, close: 0, again: 0, said: 0 });
              resetCard();
            }}
          >
            Practice again
          </button>
          <Link to="/" className="btn btn-quiet btn-lg">
            Back home
          </Link>
        </div>
      </section>
    );
  }

  const choices = choiceSet(kind, item, words, turns, studentName);

  return (
    <section className="grid gap-5">
      <div className="grid gap-2">
        <p className="text-sm font-bold text-muted">
          {meta.title} · <span className="tabular-nums">{safeIndex + 1}</span> of{" "}
          <span className="tabular-nums">{items.length}</span>
        </p>
        <div
          className="h-2 overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={items.length}
          aria-valuenow={safeIndex + 1}
          aria-label="Place in this set"
        >
          <div
            className="h-full bg-accent"
            style={{ width: `${((safeIndex + 1) / items.length) * 100}%` }}
          />
        </div>
        <h1 className="text-3xl font-bold">{kind === "turns" ? item.label : meta.title}</h1>
        {turn && <p className="text-muted">{turn.scene}</p>}
      </div>

      <div className="panel grid justify-items-center gap-4 text-center">
        <div className="grid size-36 place-items-center rounded-xl bg-accent-soft text-accent sm:size-44">
          <IconView name={kind === "picture" ? "Ear" : item.icon} className="size-20" />
        </div>
        <p className="sr-only">{kind === "picture" ? "Listen for the word." : item.spoken}</p>
        {settings.captions && (
          <p className="text-3xl font-bold" aria-hidden={kind !== "picture"}>
            {kind === "picture" ? "Listen" : item.spoken}
          </p>
        )}
        {settings.captions && kind === "picture" && !feedback && (
          <p className="text-sm text-muted">The word stays hidden until you answer. Turn captions off to hide choice labels too.</p>
        )}
        {settings.captions && item.syllables.length > 1 && kind === "say" && (
          <div className="flex flex-wrap justify-center gap-2" aria-hidden>
            {item.syllables.map((part, partIndex) => (
              <span
                key={`${part}-${partIndex}`}
                className={
                  pulse === partIndex
                    ? "rounded-md bg-accent px-3 py-1 font-bold text-accent-fg"
                    : "rounded-md bg-bg px-3 py-1 font-bold text-ink"
                }
              >
                {part}
              </span>
            ))}
          </div>
        )}
        <button type="button" className="btn btn-primary btn-lg w-full sm:w-auto" onClick={() => play(item.spoken, item.syllables)}>
          <Ear className="size-5" aria-hidden />
          Hear it
        </button>
      </div>

      <div className="seg" role="radiogroup" aria-label="How to answer">
        {modes.map((entry) => (
          <button
            key={entry}
            type="button"
            role="radio"
            aria-checked={mode === entry}
            onClick={() => {
              setMode(entry);
              setListenNote("");
            }}
          >
            {MODE_META[entry].label}
          </button>
        ))}
      </div>

      {mode === "tap" && (
        <div className="grid gap-3 sm:grid-cols-3">
          {choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              className="panel grid min-h-28 content-center justify-items-center gap-2 text-center"
              onClick={() => answerChoice(choice)}
            >
              {choice.icon && <IconView name={choice.icon} className="size-10 text-accent" />}
              {(settings.captions || kind === "turns") ? (
                <span className="font-bold">{choice.text}</span>
              ) : (
                <span className="sr-only">{choice.text}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {mode === "type" && (
        <form
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            const result = saidWell(typed, item.spoken);
            finish(result, typeFeedback(result, item.spoken), "type");
          }}
        >
          <label className="grid gap-2">
            <span className="font-bold">{kind === "turns" ? "Type a sentence" : "Type the word"}</span>
            <input
              className="field text-lg"
              value={typed}
              spellCheck={false}
              autoCapitalize="none"
              autoComplete="off"
              onChange={(event) => setTyped(event.target.value)}
            />
          </label>
          <button type="submit" className="btn btn-primary btn-lg">
            Check
          </button>
        </form>
      )}

      {mode === "speak" && (
        <div className="grid gap-3">
          <p className="text-sm text-muted">Your voice is checked in the moment and is not saved.</p>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => {
              if (!canListen()) {
                setListenNote("This browser cannot hear speech. Use I said it, tap, or type.");
                return;
              }
              setListenNote("Listening…");
              setListening(true);
              const handle = listenOnce();
              stopListen.current = handle.stop;
              handle.promise
                .then((heard) => {
                  const result = saidWell(heard, item.spoken);
                  setListenNote(heard ? `Heard: ${heard}` : "No speech heard.");
                  finish(result, typeFeedback(result, item.spoken), "speak");
                })
                .catch(() => {
                  setListenNote("Could not hear that. Try again, or mark I said it.");
                })
                .finally(() => setListening(false));
            }}
          >
            {listening ? "Listening…" : "Listen to me"}
          </button>
          <button
            type="button"
            className="btn btn-quiet btn-lg"
            onClick={() =>
              finish(
                "said",
                "Marked as said. Nothing was recorded. A teacher only sees that you practiced aloud.",
                "speak",
              )
            }
          >
            I said it
          </button>
          <p className="text-sm text-muted" aria-live="assertive">
            {listenNote}
          </p>
        </div>
      )}

      <div aria-live="polite">
        {feedback && (
          <div
            className={
              feedback.result === "again"
                ? "rise grid gap-3 rounded-xl bg-try-soft p-5 text-try"
                : feedback.result === "clear"
                  ? "rise grid gap-3 rounded-xl bg-good-soft p-5 text-good"
                  : "rise grid gap-3 rounded-xl bg-accent-soft p-5 text-ink"
            }
          >
            <p className="flex items-center gap-2 font-bold">
              {feedback.result === "again" ? (
                <RotateCcw className="size-5" aria-hidden />
              ) : feedback.result === "clear" ? (
                <CircleCheck className="size-5" aria-hidden />
              ) : (
                <Info className="size-5" aria-hidden />
              )}
              {feedback.result === "clear"
                ? "Clear"
                : feedback.result === "again"
                  ? "Try once more"
                  : feedback.result === "close"
                    ? "Close"
                    : "Practiced"}
            </p>
            <p>{feedback.text}</p>
            <button type="button" className="btn btn-quiet w-fit" onClick={() => play(feedback.text, [])}>
              Hear feedback
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {!feedback && <p className="w-full text-sm text-muted">Answer first. Then press Next.</p>}
        {feedback?.result === "again" && (
          <button type="button" className="btn btn-quiet btn-lg" onClick={resetCard}>
            Try again
          </button>
        )}
        <button type="button" className="btn btn-primary btn-lg" onClick={goNext} disabled={!feedback}>
          {safeIndex + 1 >= items.length ? "Finish" : "Next"}
        </button>
        <Link to="/" className="btn btn-ghost btn-lg">
          Stop
        </Link>
      </div>
    </section>
  );

  function answerChoice(choice: Choice) {
    if (kind === "turns") {
      const tone = choice.tone ?? "ok";
      const result: Result = tone === "clear" ? "clear" : tone === "unclear" ? "again" : "close";
      finish(result, choice.coach ?? "You took a turn.", "tap");
      return;
    }
    const result: Result = choice.id === item.id ? "clear" : "again";
    finish(
      result,
      result === "clear" ? `Yes. That is ${item.spoken}.` : `Not that one. The word is ${item.spoken}.`,
      "tap",
    );
  }
}

type Choice = {
  id: string;
  text: string;
  icon?: Word["icon"];
  tone?: Turn["choices"][number]["tone"];
  coach?: string;
};

function choiceSet(kind: ActivityKind, item: Item, words: Word[], turns: Turn[], name: string): Choice[] {
  if (kind === "turns") {
    const turn = turns.find((entry) => entry.id === item.id);
    return (turn?.choices ?? []).map((choice, index) => ({
      id: `${item.id}-${index}`,
      text: fillName(choice.text, name),
      tone: choice.tone,
      coach: fillName(choice.coach, name),
    }));
  }
  const pool = words.filter((word) => word.id !== item.id);
  const ranked = [...pool].sort((a, b) => hash(item.id + a.id) - hash(item.id + b.id));
  const target = words.find((word) => word.id === item.id);
  const picks = [target, ...ranked.slice(0, 2)].filter((word): word is Word => Boolean(word));
  return picks
    .sort((a, b) => hash(`o${item.id}${a.id}`) - hash(`o${item.id}${b.id}`))
    .map((word) => ({ id: word.id, text: word.word, icon: word.icon }));
}

function typeFeedback(result: Result, spoken: string) {
  if (result === "clear") return `Yes. That matches “${spoken}”.`;
  if (result === "close") return `Close. The model is “${spoken}”.`;
  return `Not yet. Listen, then try “${spoken}”.`;
}
