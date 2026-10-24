import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SEED_TURNS, SEED_WORDS, type Word } from "@/data/catalog";
import type { IconName } from "@/data/icons";

export type Mode = "tap" | "type" | "speak";
export type ActivityKind = "picture" | "say" | "turns";
export type Result = "clear" | "close" | "again" | "said";
export type TextSize = "md" | "lg" | "xl";

export type Student = { id: string; name: string };

export type CustomWord = Word;

export type Attempt = {
  id: string;
  studentId: string;
  activity: ActivityKind;
  itemId: string;
  label: string;
  mode: Mode;
  result: Result;
  at: string;
};

export type Settings = {
  text: TextSize;
  rate: number;
  volume: number;
  captions: boolean;
  contrast: boolean;
  autoHear: boolean;
  goal: number;
};

type Data = {
  students: Student[];
  activeStudentId: string;
  customWords: CustomWord[];
  wordIds: string[];
  turnIds: string[];
  activities: ActivityKind[];
  modes: Mode[];
  attempts: Attempt[];
  notes: Record<string, string>;
  settings: Settings;
  pin: string;
  noticeDismissed: boolean;
};

type Store = Data & {
  hydrated: boolean;
  setHydrated: () => void;
  setActiveStudent: (id: string) => void;
  addStudent: (name: string) => string | null;
  renameStudent: (id: string, name: string) => void;
  removeStudent: (id: string) => void;
  setNote: (id: string, note: string) => void;
  toggleWord: (id: string) => void;
  toggleTurn: (id: string) => void;
  toggleActivity: (kind: ActivityKind) => void;
  toggleMode: (mode: Mode) => void;
  addWord: (word: CustomWord) => string | null;
  removeCustomWord: (id: string) => void;
  logAttempt: (attempt: Omit<Attempt, "id" | "at">) => void;
  patchSettings: (partial: Partial<Settings>) => void;
  setPin: (pin: string) => void;
  dismissNotice: () => void;
  clearProgress: () => void;
  resetDevice: () => void;
};

const initial: Data = {
  students: [{ id: "alex", name: "Alex" }],
  activeStudentId: "alex",
  customWords: [],
  wordIds: SEED_WORDS.map((word) => word.id),
  turnIds: SEED_TURNS.map((turn) => turn.id),
  activities: ["picture", "say", "turns"],
  modes: ["tap", "type", "speak"],
  notes: { alex: "" },
  settings: {
    text: "md",
    rate: 0.85,
    volume: 1,
    captions: true,
    contrast: false,
    autoHear: true,
    goal: 6,
  },
  pin: "",
  noticeDismissed: false,
  attempts: [
    attempt("a1", "picture", "water", "water", "tap", "clear", "2026-10-24T10:05:00.000Z"),
    attempt("a2", "picture", "book", "book", "tap", "again", "2026-10-24T10:06:00.000Z"),
    attempt("a3", "picture", "book", "book", "tap", "clear", "2026-10-24T10:07:00.000Z"),
    attempt("a4", "say", "apple", "apple", "speak", "said", "2026-10-24T10:12:00.000Z"),
    attempt("a5", "say", "help", "help", "type", "clear", "2026-10-23T15:10:00.000Z"),
    attempt("a6", "say", "backpack", "backpack", "type", "close", "2026-10-23T15:12:00.000Z"),
    attempt("a7", "turns", "ask-water", "Ask for water", "tap", "clear", "2026-10-23T15:20:00.000Z"),
    attempt("a8", "turns", "greet", "Say hello", "speak", "close", "2026-10-22T14:02:00.000Z"),
    attempt("a9", "turns", "ask-help", "Ask for help", "tap", "again", "2026-10-22T14:06:00.000Z"),
    attempt("a10", "picture", "dog", "dog", "tap", "clear", "2026-10-22T14:10:00.000Z"),
    attempt("a11", "say", "tired", "tired", "speak", "clear", "2026-10-22T14:16:00.000Z"),
    attempt("a12", "turns", "goodbye", "Say goodbye", "type", "clear", "2026-10-22T14:20:00.000Z"),
  ],
};

function attempt(
  id: string,
  activity: ActivityKind,
  itemId: string,
  label: string,
  mode: Mode,
  result: Result,
  at: string,
): Attempt {
  return { id, studentId: "alex", activity, itemId, label, mode, result, at };
}

function cleanName(name: string) {
  return name.replace(/\s+/g, " ").trim().slice(0, 24);
}

export const useTalk = create<Store>()(
  persist(
    (set, get) => ({
      ...initial,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      setActiveStudent: (id) => {
        if (get().students.some((student) => student.id === id)) set({ activeStudentId: id });
      },
      addStudent: (name) => {
        const clean = cleanName(name);
        if (clean.length < 1) return "Enter a first name or nickname.";
        const id = `s-${Date.now().toString(36)}`;
        set((state) => ({
          students: [...state.students, { id, name: clean }],
          notes: { ...state.notes, [id]: "" },
          activeStudentId: id,
        }));
        return null;
      },
      renameStudent: (id, name) => {
        const next = name.slice(0, 24);
        if (!next.trim()) return;
        set((state) => ({
          students: state.students.map((student) => (student.id === id ? { ...student, name: next } : student)),
        }));
      },
      removeStudent: (id) => {
        const state = get();
        if (state.students.length < 2) return;
        const students = state.students.filter((student) => student.id !== id);
        const notes = { ...state.notes };
        delete notes[id];
        set({
          students,
          notes,
          attempts: state.attempts.filter((item) => item.studentId !== id),
          activeStudentId: state.activeStudentId === id ? students[0].id : state.activeStudentId,
        });
      },
      setNote: (id, note) =>
        set((state) => ({ notes: { ...state.notes, [id]: note.slice(0, 500) } })),
      toggleWord: (id) =>
        set((state) => ({
          wordIds: state.wordIds.includes(id)
            ? state.wordIds.filter((item) => item !== id)
            : [...state.wordIds, id],
        })),
      toggleTurn: (id) =>
        set((state) => ({
          turnIds: state.turnIds.includes(id)
            ? state.turnIds.filter((item) => item !== id)
            : [...state.turnIds, id],
        })),
      toggleActivity: (kind) =>
        set((state) => ({
          activities: state.activities.includes(kind)
            ? state.activities.filter((item) => item !== kind)
            : [...state.activities, kind],
        })),
      toggleMode: (mode) =>
        set((state) => {
          const has = state.modes.includes(mode);
          if (has && state.modes.length === 1) return state;
          return {
            modes: has ? state.modes.filter((item) => item !== mode) : [...state.modes, mode],
          };
        }),
      addWord: (word) => {
        const clean = word.word.replace(/\s+/g, " ").trim().toLowerCase();
        if (clean.length < 1 || clean.length > 32) return "Enter a word, up to 32 letters.";
        const all = [...SEED_WORDS, ...get().customWords];
        if (all.some((item) => item.word.toLowerCase() === clean)) return "That word is already in the list.";
        const syllables = word.syllables.map((part) => part.trim()).filter(Boolean);
        const next: CustomWord = {
          ...word,
          id: `c-${Date.now().toString(36)}`,
          word: clean,
          hint: word.hint.replace(/\s+/g, " ").trim().slice(0, 80) || "A practice word",
          syllables: syllables.length ? syllables : [clean],
        };
        set((state) => ({
          customWords: [...state.customWords, next],
          wordIds: [...state.wordIds, next.id],
        }));
        return null;
      },
      removeCustomWord: (id) =>
        set((state) => ({
          customWords: state.customWords.filter((word) => word.id !== id),
          wordIds: state.wordIds.filter((item) => item !== id),
        })),
      logAttempt: (entry) =>
        set((state) => ({
          attempts: [
            ...state.attempts,
            { ...entry, id: `t-${Date.now().toString(36)}-${state.attempts.length}`, at: new Date().toISOString() },
          ].slice(-400),
        })),
      patchSettings: (partial) =>
        set((state) => ({ settings: { ...state.settings, ...partial } })),
      setPin: (pin) => set({ pin: pin.replace(/\D/g, "").slice(0, 4) }),
      dismissNotice: () => set({ noticeDismissed: true }),
      clearProgress: () => set({ attempts: [] }),
      resetDevice: () => set({ ...initial, hydrated: true }),
    }),
    {
      name: "talk-steps",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      version: 1,
      partialize: (state) => ({
        students: state.students,
        activeStudentId: state.activeStudentId,
        customWords: state.customWords,
        wordIds: state.wordIds,
        turnIds: state.turnIds,
        activities: state.activities,
        modes: state.modes,
        attempts: state.attempts,
        notes: state.notes,
        settings: state.settings,
        pin: state.pin,
        noticeDismissed: state.noticeDismissed,
      }),
    },
  ),
);

export function allWords(custom: CustomWord[]) {
  return [...SEED_WORDS, ...custom];
}

export function isIconName(value: string): value is IconName {
  return [
    "Apple", "Backpack", "Bed", "Bike", "BookOpen", "Bus", "Car", "Cat", "Clock", "Cloud",
    "Cookie", "Dog", "DoorOpen", "Ear", "Fish", "Flower2", "Frown", "GlassWater", "HandHeart",
    "Heart", "House", "Leaf", "Moon", "Pencil", "Shirt", "Smile", "Sun", "TreeDeciduous", "Utensils",
  ].includes(value);
}

export function rateLabel(rate: number) {
  if (rate < 0.78) return "Slow";
  if (rate < 0.95) return "Easy";
  return "Usual";
}

export function volumeLabel(volume: number) {
  if (volume < 0.4) return "Quiet";
  if (volume < 0.8) return "Medium";
  return "Loud";
}

export function isToday(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export const ACTIVITY_META: Record<
  ActivityKind,
  { title: string; blurb: string; action: string }
> = {
  picture: {
    title: "Find the picture",
    blurb: "Listen. Then tap the picture you hear.",
    action: "Start pictures",
  },
  say: {
    title: "Say the word",
    blurb: "Look at the picture. Say it, type it, or tap it.",
    action: "Start words",
  },
  turns: {
    title: "Take a turn",
    blurb: "Hear a sentence you can use with people. Then answer your way.",
    action: "Start turns",
  },
};

export const MODE_META: Record<Mode, { label: string; hint: string }> = {
  tap: { label: "Tap", hint: "Choose a picture or sentence" },
  type: { label: "Type", hint: "Write the word or sentence" },
  speak: { label: "Say", hint: "Speak, or mark that you said it" },
};

export const RESULT_LABEL: Record<Result, string> = {
  clear: "Clear",
  close: "Close",
  again: "Try again",
  said: "Said it",
};
