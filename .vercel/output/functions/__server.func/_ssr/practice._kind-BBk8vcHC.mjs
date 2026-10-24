import { i as __toESM } from "../_runtime.mjs";
import { q as require_react, x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as CircleCheck, p as Info, s as RotateCcw, x as Ear } from "../_libs/lucide-react.mjs";
import { f as SEED_TURNS, i as MODE_META, l as useTalk, n as Route, o as allWords, p as fillName, r as ACTIVITY_META } from "./router-BjEUPgFN.mjs";
import { t as LookAndSound } from "./controls-DmDK_EQi.mjs";
import { t as Shell } from "./shell-3zve1ly1.mjs";
import { a as speak, i as listenOnce, n as IconView, o as stopSpeech, r as canListen } from "./speech-BHAvKA2Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/practice._kind-BBk8vcHC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function norm(value) {
	return value.toLowerCase().replace(/[^a-z0-9'\s]/g, "").replace(/\s+/g, " ").trim();
}
function saidWell(heard, target) {
	const h = norm(heard);
	const t = norm(target);
	if (!h || !t) return "again";
	if (h === t || h.includes(t)) return "clear";
	const words = t.split(" ").filter((word) => word.length > 2);
	if (words.length === 0) return "again";
	const hit = words.filter((word) => h.includes(word)).length;
	if (hit === words.length) return "clear";
	if (hit >= Math.ceil(words.length / 2)) return "close";
	return "again";
}
function hash(value) {
	let h = 0;
	for (const char of value) h = h * 31 + char.charCodeAt(0) >>> 0;
	return h;
}
function PracticeView({ kind }) {
	const customWords = useTalk((state) => state.customWords);
	const wordIds = useTalk((state) => state.wordIds);
	const turnIds = useTalk((state) => state.turnIds);
	const modes = useTalk((state) => state.modes);
	useTalk((state) => state.settings);
	const student = useTalk((state) => state.students.find((item) => item.id === state.activeStudentId));
	const logAttempt = useTalk((state) => state.logAttempt);
	const words = (0, import_react.useMemo)(() => {
		const library = allWords(customWords);
		return wordIds.map((id) => library.find((word) => word.id === id)).filter((word) => Boolean(word));
	}, [customWords, wordIds]);
	const turns = (0, import_react.useMemo)(() => turnIds.map((id) => SEED_TURNS.find((turn) => turn.id === id)).filter((turn) => Boolean(turn)), [turnIds]);
	const items = (0, import_react.useMemo)(() => {
		const name = student?.name ?? "friend";
		if (kind === "turns") return turns.map((turn) => ({
			id: turn.id,
			label: turn.title,
			spoken: fillName(turn.model, name),
			icon: turn.icon,
			syllables: []
		}));
		return words.map((word) => ({
			id: word.id,
			label: word.word,
			spoken: word.word,
			icon: word.icon,
			syllables: word.syllables
		}));
	}, [
		kind,
		student?.name,
		turns,
		words
	]);
	if (modes.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { title: "No way to answer is turned on." });
	if (kind === "turns" && items.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { title: "No conversation turns are in the plan." });
	if (kind !== "turns" && words.length < (kind === "picture" ? 2 : 1)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { title: kind === "picture" ? "Picture practice needs at least two words." : "Add a word to the plan to practice saying it." });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, {
		kind,
		items,
		words,
		turns,
		modes,
		studentId: student?.id ?? "alex",
		studentName: student?.name ?? "friend",
		logAttempt
	}, `${kind}-${student?.id ?? "none"}`);
}
function Empty({ title }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "panel grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: "A teacher can turn activities and words on from the teacher desk."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/teacher",
				className: "btn btn-primary w-fit",
				children: "Open teacher desk"
			})
		]
	});
}
function Player({ kind, items, words, turns, modes, studentId, studentName, logAttempt }) {
	const settings = useTalk((state) => state.settings);
	const [index, setIndex] = (0, import_react.useState)(0);
	const [mode, setMode] = (0, import_react.useState)(modes.includes("tap") ? "tap" : modes[0]);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const [typed, setTyped] = (0, import_react.useState)("");
	const [listening, setListening] = (0, import_react.useState)(false);
	const [listenNote, setListenNote] = (0, import_react.useState)("");
	const [done, setDone] = (0, import_react.useState)(false);
	const [pulse, setPulse] = (0, import_react.useState)(-1);
	const [tally, setTally] = (0, import_react.useState)({
		clear: 0,
		close: 0,
		again: 0,
		said: 0
	});
	const stopListen = (0, import_react.useRef)(() => {});
	const pulseTimer = (0, import_react.useRef)(null);
	const safeIndex = Math.min(index, Math.max(items.length - 1, 0));
	const item = items[safeIndex];
	const turn = turns.find((entry) => entry.id === item?.id);
	const meta = ACTIVITY_META[kind];
	(0, import_react.useEffect)(() => {
		if (!modes.includes(mode)) setMode(modes[0]);
	}, [mode, modes]);
	(0, import_react.useEffect)(() => {
		return () => {
			stopListen.current();
			stopSpeech();
			if (pulseTimer.current) window.clearInterval(pulseTimer.current);
		};
	}, []);
	function play(text, syllables) {
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
		speak(text, {
			rate: settings.rate,
			volume: settings.volume
		});
	}
	function resetCard() {
		setFeedback(null);
		setTyped("");
		setListenNote("");
		setListening(false);
		stopListen.current();
	}
	function finish(result, text, used) {
		if (!item) return;
		setFeedback({
			result,
			text
		});
		setTally((current) => ({
			...current,
			[result]: current[result] + 1
		}));
		logAttempt({
			studentId,
			activity: kind,
			itemId: item.id,
			label: item.label,
			mode: used,
			result
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
	if (!item) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { title: "Nothing is ready to practice." });
	if (done) {
		const tries = tally.clear + tally.close + tally.again + tally.said;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "panel grid gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold",
					children: "You finished this set."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-muted",
					children: [
						tries,
						" ",
						tries === 1 ? "try" : "tries",
						" in ",
						meta.title.toLowerCase(),
						". Clear:",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums font-bold text-ink",
							children: tally.clear
						}),
						". Close:",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums font-bold text-ink",
							children: tally.close
						}),
						". This is practice, not a test of speech."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-primary btn-lg",
						onClick: () => {
							setDone(false);
							setIndex(0);
							setTally({
								clear: 0,
								close: 0,
								again: 0,
								said: 0
							});
							resetCard();
						},
						children: "Practice again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "btn btn-quiet btn-lg",
						children: "Back home"
					})]
				})
			]
		});
	}
	const choices = choiceSet(kind, item, words, turns, studentName);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "grid gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-bold text-muted",
						children: [
							meta.title,
							" · ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: safeIndex + 1
							}),
							" of",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: items.length
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2 overflow-hidden rounded-full bg-line",
						role: "progressbar",
						"aria-valuemin": 1,
						"aria-valuemax": items.length,
						"aria-valuenow": safeIndex + 1,
						"aria-label": "Place in this set",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-accent",
							style: { width: `${(safeIndex + 1) / items.length * 100}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold",
						children: kind === "turns" ? item.label : meta.title
					}),
					turn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted",
						children: turn.scene
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel grid justify-items-center gap-4 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-36 place-items-center rounded-xl bg-accent-soft text-accent sm:size-44",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconView, {
							name: kind === "picture" ? "Ear" : item.icon,
							className: "size-20"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "sr-only",
						children: kind === "picture" ? "Listen for the word." : item.spoken
					}),
					settings.captions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-3xl font-bold",
						"aria-hidden": kind !== "picture",
						children: kind === "picture" ? "Listen" : item.spoken
					}),
					settings.captions && kind === "picture" && !feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "The word stays hidden until you answer. Turn captions off to hide choice labels too."
					}),
					settings.captions && item.syllables.length > 1 && kind === "say" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap justify-center gap-2",
						"aria-hidden": true,
						children: item.syllables.map((part, partIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: pulse === partIndex ? "rounded-md bg-accent px-3 py-1 font-bold text-accent-fg" : "rounded-md bg-bg px-3 py-1 font-bold text-ink",
							children: part
						}, `${part}-${partIndex}`))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "btn btn-primary btn-lg w-full sm:w-auto",
						onClick: () => play(item.spoken, item.syllables),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ear, {
							className: "size-5",
							"aria-hidden": true
						}), "Hear it"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "seg",
				role: "radiogroup",
				"aria-label": "How to answer",
				children: modes.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					role: "radio",
					"aria-checked": mode === entry,
					onClick: () => {
						setMode(entry);
						setListenNote("");
					},
					children: MODE_META[entry].label
				}, entry))
			}),
			mode === "tap" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: choices.map((choice) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "panel grid min-h-28 content-center justify-items-center gap-2 text-center",
					onClick: () => answerChoice(choice),
					children: [choice.icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconView, {
						name: choice.icon,
						className: "size-10 text-accent"
					}), settings.captions || kind === "turns" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold",
						children: choice.text
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sr-only",
						children: choice.text
					})]
				}, choice.id))
			}),
			mode === "type" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-3",
				onSubmit: (event) => {
					event.preventDefault();
					const result = saidWell(typed, item.spoken);
					finish(result, typeFeedback(result, item.spoken), "type");
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold",
						children: kind === "turns" ? "Type a sentence" : "Type the word"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field text-lg",
						value: typed,
						spellCheck: false,
						autoCapitalize: "none",
						autoComplete: "off",
						onChange: (event) => setTyped(event.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "btn btn-primary btn-lg",
					children: "Check"
				})]
			}),
			mode === "speak" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Your voice is checked in the moment and is not saved."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-primary btn-lg",
						onClick: () => {
							if (!canListen()) {
								setListenNote("This browser cannot hear speech. Use I said it, tap, or type.");
								return;
							}
							setListenNote("Listening…");
							setListening(true);
							const handle = listenOnce();
							stopListen.current = handle.stop;
							handle.promise.then((heard) => {
								const result = saidWell(heard, item.spoken);
								setListenNote(heard ? `Heard: ${heard}` : "No speech heard.");
								finish(result, typeFeedback(result, item.spoken), "speak");
							}).catch(() => {
								setListenNote("Could not hear that. Try again, or mark I said it.");
							}).finally(() => setListening(false));
						},
						children: listening ? "Listening…" : "Listen to me"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-quiet btn-lg",
						onClick: () => finish("said", "Marked as said. Nothing was recorded. A teacher only sees that you practiced aloud.", "speak"),
						children: "I said it"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						"aria-live": "assertive",
						children: listenNote
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-live": "polite",
				children: feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: feedback.result === "again" ? "rise grid gap-3 rounded-xl bg-try-soft p-5 text-try" : feedback.result === "clear" ? "rise grid gap-3 rounded-xl bg-good-soft p-5 text-good" : "rise grid gap-3 rounded-xl bg-accent-soft p-5 text-ink",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-2 font-bold",
							children: [feedback.result === "again" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {
								className: "size-5",
								"aria-hidden": true
							}) : feedback.result === "clear" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
								className: "size-5",
								"aria-hidden": true
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								className: "size-5",
								"aria-hidden": true
							}), feedback.result === "clear" ? "Clear" : feedback.result === "again" ? "Try once more" : feedback.result === "close" ? "Close" : "Practiced"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: feedback.text }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn btn-quiet w-fit",
							onClick: () => play(feedback.text, []),
							children: "Hear feedback"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [
					!feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "w-full text-sm text-muted",
						children: "Answer first. Then press Next."
					}),
					feedback?.result === "again" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-quiet btn-lg",
						onClick: resetCard,
						children: "Try again"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-primary btn-lg",
						onClick: goNext,
						disabled: !feedback,
						children: safeIndex + 1 >= items.length ? "Finish" : "Next"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "btn btn-ghost btn-lg",
						children: "Stop"
					})
				]
			})
		]
	});
	function answerChoice(choice) {
		if (kind === "turns") {
			const tone = choice.tone ?? "ok";
			finish(tone === "clear" ? "clear" : tone === "unclear" ? "again" : "close", choice.coach ?? "You took a turn.", "tap");
			return;
		}
		const result = choice.id === item.id ? "clear" : "again";
		finish(result, result === "clear" ? `Yes. That is ${item.spoken}.` : `Not that one. The word is ${item.spoken}.`, "tap");
	}
}
function choiceSet(kind, item, words, turns, name) {
	if (kind === "turns") return (turns.find((entry) => entry.id === item.id)?.choices ?? []).map((choice, index) => ({
		id: `${item.id}-${index}`,
		text: fillName(choice.text, name),
		tone: choice.tone,
		coach: fillName(choice.coach, name)
	}));
	const ranked = [...words.filter((word) => word.id !== item.id)].sort((a, b) => hash(item.id + a.id) - hash(item.id + b.id));
	return [words.find((word) => word.id === item.id), ...ranked.slice(0, 2)].filter((word) => Boolean(word)).sort((a, b) => hash(`o${item.id}${a.id}`) - hash(`o${item.id}${b.id}`)).map((word) => ({
		id: word.id,
		text: word.word,
		icon: word.icon
	}));
}
function typeFeedback(result, spoken) {
	if (result === "clear") return `Yes. That matches “${spoken}”.`;
	if (result === "close") return `Close. The model is “${spoken}”.`;
	return `Not yet. Listen, then try “${spoken}”.`;
}
function isKind(value) {
	return value === "picture" || value === "say" || value === "turns";
}
function PracticePage() {
	const { kind } = Route.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [isKind(kind) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PracticeView, { kind }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "panel grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold",
				children: "That practice is not here."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "btn btn-primary w-fit",
				children: "Back to practice"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LookAndSound, { compact: true })]
	}) });
}
//#endregion
export { PracticePage as component };
