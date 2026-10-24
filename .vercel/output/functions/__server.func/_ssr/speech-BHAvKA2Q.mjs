import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Bus, C as Dog, E as Clock, F as Apple, M as Bike, N as Bed, O as Cat, P as Backpack, S as DoorOpen, T as Cloud, _ as GlassWater, a as Smile, b as Fish, c as Pencil, f as Leaf, g as HandHeart, h as Heart, i as Sun, j as BookOpen, k as Car, l as Moon, m as House, o as Shirt, r as TreeDeciduous, t as Utensils, v as Frown, w as Cookie, x as Ear, y as Flower2 } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/speech-BHAvKA2Q.js
var import_jsx_runtime = require_jsx_runtime();
var ICONS = {
	Apple,
	Backpack,
	Bed,
	Bike,
	BookOpen,
	Bus,
	Car,
	Cat,
	Clock,
	Cloud,
	Cookie,
	Dog,
	DoorOpen,
	Ear,
	Fish,
	Flower2,
	Frown,
	GlassWater,
	HandHeart,
	Heart,
	House,
	Leaf,
	Moon,
	Pencil,
	Shirt,
	Smile,
	Sun,
	TreeDeciduous,
	Utensils
};
var ICON_CHOICES = Object.keys(ICONS);
function IconView({ name, className }) {
	const Glyph = ICONS[name] ?? Ear;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Glyph, {
		className,
		"aria-hidden": true,
		strokeWidth: 1.75
	});
}
function recCtor() {
	if (typeof window === "undefined") return null;
	const w = window;
	return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}
function canListen() {
	return recCtor() !== null;
}
function canSpeak() {
	return typeof window !== "undefined" && "speechSynthesis" in window;
}
function stopSpeech() {
	if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
}
function speak(text, opts) {
	stopSpeech();
	if (!canSpeak()) return {
		done: Promise.resolve(),
		cancel() {}
	};
	const synth = window.speechSynthesis;
	synth.resume();
	const utter = new SpeechSynthesisUtterance(text);
	utter.rate = opts.rate;
	utter.volume = opts.volume;
	utter.lang = "en-US";
	const done = new Promise((resolve) => {
		utter.onend = () => resolve();
		utter.onerror = () => resolve();
	});
	synth.speak(utter);
	return {
		done,
		cancel: stopSpeech
	};
}
function listenOnce() {
	const Ctor = recCtor();
	if (!Ctor) return {
		promise: Promise.reject(/* @__PURE__ */ new Error("unsupported")),
		stop() {}
	};
	const rec = new Ctor();
	rec.lang = "en-US";
	rec.interimResults = false;
	rec.continuous = false;
	let settled = false;
	const promise = new Promise((resolve, reject) => {
		rec.onresult = (ev) => {
			settled = true;
			resolve(ev.results[0]?.[0]?.transcript ?? "");
		};
		rec.onerror = () => {
			if (!settled) {
				settled = true;
				reject(/* @__PURE__ */ new Error("error"));
			}
		};
		rec.onend = () => {
			if (!settled) {
				settled = true;
				reject(/* @__PURE__ */ new Error("empty"));
			}
		};
	});
	try {
		rec.start();
	} catch {
		return {
			promise: Promise.reject(/* @__PURE__ */ new Error("error")),
			stop() {}
		};
	}
	return {
		promise,
		stop() {
			try {
				rec.abort();
			} catch {}
		}
	};
}
//#endregion
export { speak as a, listenOnce as i, IconView as n, stopSpeech as o, canListen as r, ICON_CHOICES as t };
