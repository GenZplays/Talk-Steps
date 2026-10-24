export type ListenHandle = {
  promise: Promise<string>;
  stop: () => void;
};

type RecResult = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type Rec = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((ev: RecResult) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  abort: () => void;
};

type RecCtor = new () => Rec;

function recCtor(): RecCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: RecCtor;
    webkitSpeechRecognition?: RecCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function canListen() {
  return recCtor() !== null;
}

export function canSpeak() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function stopSpeech() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function speak(text: string, opts: { rate: number; volume: number }) {
  stopSpeech();
  if (!canSpeak()) {
    return { done: Promise.resolve(), cancel() {} };
  }
  const synth = window.speechSynthesis;
  synth.resume();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = opts.rate;
  utter.volume = opts.volume;
  utter.lang = "en-US";
  const done = new Promise<void>((resolve) => {
    utter.onend = () => resolve();
    utter.onerror = () => resolve();
  });
  synth.speak(utter);
  return { done, cancel: stopSpeech };
}

export function listenOnce(): ListenHandle {
  const Ctor = recCtor();
  if (!Ctor) {
    return {
      promise: Promise.reject(new Error("unsupported")),
      stop() {},
    };
  }
  const rec = new Ctor();
  rec.lang = "en-US";
  rec.interimResults = false;
  rec.continuous = false;
  let settled = false;
  const promise = new Promise<string>((resolve, reject) => {
    rec.onresult = (ev) => {
      settled = true;
      const text = ev.results[0]?.[0]?.transcript ?? "";
      resolve(text);
    };
    rec.onerror = () => {
      if (!settled) {
        settled = true;
        reject(new Error("error"));
      }
    };
    rec.onend = () => {
      if (!settled) {
        settled = true;
        reject(new Error("empty"));
      }
    };
  });
  try {
    rec.start();
  } catch {
    return {
      promise: Promise.reject(new Error("error")),
      stop() {},
    };
  }
  return {
    promise,
    stop() {
      try {
        rec.abort();
      } catch {
        /* already stopped */
      }
    },
  };
}
