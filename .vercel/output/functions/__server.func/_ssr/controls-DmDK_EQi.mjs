import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as rateLabel, l as useTalk, u as volumeLabel } from "./router-BjEUPgFN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/controls-DmDK_EQi.js
var import_jsx_runtime = require_jsx_runtime();
var SIZES = [
	{
		id: "md",
		label: "A"
	},
	{
		id: "lg",
		label: "A"
	},
	{
		id: "xl",
		label: "A"
	}
];
function LookAndSound({ compact = false }) {
	const settings = useTalk((state) => state.settings);
	const patch = useTalk((state) => state.patchSettings);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: compact ? "grid gap-4" : "panel grid gap-5",
		children: [
			!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-bold",
				children: "Look and sound"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "These stay on this device. Captions can be on while you listen."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
				className: "grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
					className: "text-sm font-bold",
					children: "Text size"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "seg",
					role: "radiogroup",
					"aria-label": "Text size",
					children: SIZES.map((size) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "radio",
						"aria-checked": settings.text === size.id,
						"aria-label": size.id === "md" ? "Comfortable text" : size.id === "lg" ? "Large text" : "Larger text",
						className: size.id === "lg" ? "text-lg" : size.id === "xl" ? "text-2xl" : "text-sm",
						onClick: () => patch({ text: size.id }),
						children: size.label
					}, size.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "grid gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-baseline justify-between gap-3 text-sm font-bold",
					children: ["Speed", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-normal text-muted",
						children: rateLabel(settings.rate)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: .7,
					max: 1,
					step: .15,
					value: settings.rate,
					"aria-valuetext": rateLabel(settings.rate),
					onChange: (event) => patch({ rate: Number(event.target.value) })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "grid gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-baseline justify-between gap-3 text-sm font-bold",
					children: ["Volume", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-normal text-muted",
						children: volumeLabel(settings.volume)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: .3,
					max: 1,
					step: .35,
					value: settings.volume,
					"aria-valuetext": volumeLabel(settings.volume),
					onChange: (event) => patch({ volume: Number(event.target.value) })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
						checked: settings.captions,
						onChange: (captions) => patch({ captions }),
						label: "Captions",
						hint: "Show the words on screen. Screen readers still hear button names if this is off."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
						checked: settings.contrast,
						onChange: (contrast) => patch({ contrast }),
						label: "High contrast",
						hint: "Stronger borders and darker text."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
						checked: settings.autoHear,
						onChange: (autoHear) => patch({ autoHear }),
						label: "Play the next sound",
						hint: "After you press Next, the new word plays. The first word waits for Hear it."
					})
				]
			})
		]
	});
}
function Check({ checked, onChange, label, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex items-start gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: "mt-1",
			type: "checkbox",
			checked,
			onChange: (event) => onChange(event.target.checked)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block font-bold",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-sm text-muted",
			children: hint
		})] })]
	});
}
//#endregion
export { LookAndSound as t };
