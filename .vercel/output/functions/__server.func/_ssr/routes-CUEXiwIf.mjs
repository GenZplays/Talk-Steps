import { x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as MessageCircle, u as Mic, x as Ear } from "../_libs/lucide-react.mjs";
import { i as MODE_META, l as useTalk, r as ACTIVITY_META, s as isToday } from "./router-BjEUPgFN.mjs";
import { t as LookAndSound } from "./controls-DmDK_EQi.mjs";
import { t as Shell } from "./shell-3zve1ly1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CUEXiwIf.js
var import_jsx_runtime = require_jsx_runtime();
var ICONS = {
	picture: Ear,
	say: Mic,
	turns: MessageCircle
};
function Home() {
	const activities = useTalk((state) => state.activities);
	const modes = useTalk((state) => state.modes);
	const student = useTalk((state) => state.students.find((item) => item.id === state.activeStudentId));
	const attempts = useTalk((state) => state.attempts);
	const goal = useTalk((state) => state.settings.goal);
	const noticeDismissed = useTalk((state) => state.noticeDismissed);
	const dismissNotice = useTalk((state) => state.dismissNotice);
	const open = [
		"picture",
		"say",
		"turns"
	].filter((kind) => activities.includes(kind));
	const tries = attempts.filter((item) => item.studentId === student?.id && isToday(item.at)).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-3xl font-bold",
						children: [
							"Hi, ",
							student?.name ?? "there",
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-2xl text-muted",
						children: "Pick a way to practice. You can look, listen, tap, type, or say it."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-bold tabular-nums",
						children: [
							tries,
							" ",
							tries === 1 ? "try" : "tries",
							" today. Goal is ",
							goal,
							".",
							tries >= goal ? " You met today’s goal." : ""
						]
					})
				]
			}),
			!noticeDismissed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "panel grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-bold",
						children: "What this is"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Talk Steps helps you practice words, requests, and turns in a conversation. It does not test or diagnose speech. A teacher or speech-language pathologist can set the plan. Scores stay on this device." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-primary w-fit",
						onClick: dismissNotice,
						children: "Got it"
					})
				]
			}),
			open.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "panel grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-bold",
						children: "No practice is turned on"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted",
						children: "Open the teacher desk to choose activities."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/teacher",
						className: "btn btn-primary w-fit",
						children: "Teacher desk"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-3",
				children: open.map((kind) => {
					const meta = ACTIVITY_META[kind];
					const Glyph = ICONS[kind];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "panel grid content-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid size-14 place-items-center rounded-lg bg-accent-soft text-accent",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Glyph, {
										className: "size-7",
										"aria-hidden": true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold",
									children: meta.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted",
									children: meta.blurb
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted",
									children: [
										"Answer by ",
										modes.map((mode) => MODE_META[mode].label.toLowerCase()).join(", "),
										"."
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/practice/$kind",
							params: { kind },
							className: "btn btn-primary btn-lg",
							children: meta.action
						})]
					}, kind);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LookAndSound, {})
		]
	}) });
}
//#endregion
export { Home as component };
