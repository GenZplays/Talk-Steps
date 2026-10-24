import { x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as MessageCircle } from "../_libs/lucide-react.mjs";
import { l as useTalk } from "./router-BjEUPgFN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-3zve1ly1.js
var import_jsx_runtime = require_jsx_runtime();
function Shell({ children }) {
	const student = useTalk((state) => state.students.find((item) => item.id === state.activeStudentId));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				className: "skip",
				href: "#main",
				children: "Skip to content"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-line bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "inline-flex min-h-12 items-center gap-2 font-bold text-ink no-underline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
								className: "size-6 text-accent",
								"aria-hidden": true
							}), "Talk Steps"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "flex items-center gap-2",
							"aria-label": "Main",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								activeOptions: { exact: true },
								className: "btn btn-ghost",
								activeProps: { className: "btn btn-quiet" },
								children: "Practice"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/teacher",
								className: "btn btn-ghost",
								activeProps: { className: "btn btn-quiet" },
								children: "Teacher desk"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "ml-auto text-sm text-muted",
							children: ["Practicing: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-ink",
								children: student?.name ?? "Student"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				id: "main",
				tabIndex: -1,
				className: "mx-auto w-full max-w-5xl px-4 py-6 outline-none",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "mx-auto max-w-5xl px-4 pb-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Talk Steps is a practice tool. It does not diagnose, treat, or score a speech or language disorder, and it does not replace a speech-language pathologist, teacher, or other professional care. Names, notes, and progress stay in this browser. Your voice is not recorded or saved."
				})
			})
		]
	});
}
//#endregion
export { Shell as t };
