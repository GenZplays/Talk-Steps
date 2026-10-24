import { i as __toESM } from "../_runtime.mjs";
import { _ as createFileRoute, b as useRouter, d as Scripts, f as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, q as require_react, v as createRootRoute, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BjEUPgFN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var SEED_WORDS = [
	{
		id: "water",
		word: "water",
		hint: "A drink",
		icon: "GlassWater",
		syllables: ["wa", "ter"],
		category: "Needs"
	},
	{
		id: "help",
		word: "help",
		hint: "When you want support",
		icon: "HandHeart",
		syllables: ["help"],
		category: "Needs"
	},
	{
		id: "happy",
		word: "happy",
		hint: "A good feeling",
		icon: "Smile",
		syllables: ["hap", "py"],
		category: "Feelings"
	},
	{
		id: "sad",
		word: "sad",
		hint: "A hurt feeling",
		icon: "Frown",
		syllables: ["sad"],
		category: "Feelings"
	},
	{
		id: "tired",
		word: "tired",
		hint: "You need rest",
		icon: "Moon",
		syllables: ["ti", "red"],
		category: "Feelings"
	},
	{
		id: "calm",
		word: "calm",
		hint: "A quiet, steady feeling",
		icon: "Leaf",
		syllables: ["calm"],
		category: "Feelings"
	},
	{
		id: "book",
		word: "book",
		hint: "You read it",
		icon: "BookOpen",
		syllables: ["book"],
		category: "School"
	},
	{
		id: "pencil",
		word: "pencil",
		hint: "You write with it",
		icon: "Pencil",
		syllables: ["pen", "cil"],
		category: "School"
	},
	{
		id: "backpack",
		word: "backpack",
		hint: "It holds your things",
		icon: "Backpack",
		syllables: ["back", "pack"],
		category: "School"
	},
	{
		id: "clock",
		word: "clock",
		hint: "It tells the time",
		icon: "Clock",
		syllables: ["clock"],
		category: "School"
	},
	{
		id: "dog",
		word: "dog",
		hint: "A pet that barks",
		icon: "Dog",
		syllables: ["dog"],
		category: "Animals"
	},
	{
		id: "cat",
		word: "cat",
		hint: "A pet that meows",
		icon: "Cat",
		syllables: ["cat"],
		category: "Animals"
	},
	{
		id: "house",
		word: "house",
		hint: "Where you live",
		icon: "House",
		syllables: ["house"],
		category: "Places"
	},
	{
		id: "door",
		word: "door",
		hint: "You walk through it",
		icon: "DoorOpen",
		syllables: ["door"],
		category: "Places"
	},
	{
		id: "sun",
		word: "sun",
		hint: "It shines in the day",
		icon: "Sun",
		syllables: ["sun"],
		category: "Outside"
	},
	{
		id: "tree",
		word: "tree",
		hint: "A tall plant",
		icon: "TreeDeciduous",
		syllables: ["tree"],
		category: "Outside"
	},
	{
		id: "bus",
		word: "bus",
		hint: "A ride to school",
		icon: "Bus",
		syllables: ["bus"],
		category: "Going"
	},
	{
		id: "apple",
		word: "apple",
		hint: "A fruit",
		icon: "Apple",
		syllables: ["ap", "ple"],
		category: "Food"
	},
	{
		id: "food",
		word: "food",
		hint: "Something you eat",
		icon: "Utensils",
		syllables: ["food"],
		category: "Food"
	}
];
var SEED_TURNS = [
	{
		id: "ask-water",
		title: "Ask for water",
		scene: "You are thirsty at lunch.",
		model: "Can I have water, please?",
		icon: "GlassWater",
		choices: [
			{
				text: "Can I have water, please?",
				tone: "clear",
				coach: "That request names what you want and says please."
			},
			{
				text: "Water, please.",
				tone: "ok",
				coach: "People can understand that. You can also say: Can I have water, please?"
			},
			{
				text: "Give me that.",
				tone: "unclear",
				coach: "The other person may not know what you need. Try: Can I have water, please?"
			}
		]
	},
	{
		id: "ask-help",
		title: "Ask for help",
		scene: "The work is hard and you want support.",
		model: "I need help, please.",
		icon: "HandHeart",
		choices: [
			{
				text: "I need help, please.",
				tone: "clear",
				coach: "That tells someone what you need."
			},
			{
				text: "Help, please.",
				tone: "ok",
				coach: "That can work. A full sentence is: I need help, please."
			},
			{
				text: "I can't.",
				tone: "unclear",
				coach: "That shows a feeling. If you want support, try: I need help, please."
			}
		]
	},
	{
		id: "greet",
		title: "Say hello",
		scene: "You meet a classmate.",
		model: "Hi. My name is {name}.",
		icon: "Smile",
		choices: [
			{
				text: "Hi. My name is {name}.",
				tone: "clear",
				coach: "That greeting says hello and your name."
			},
			{
				text: "Hi.",
				tone: "ok",
				coach: "Hello works. You can also say your name."
			},
			{
				text: "What?",
				tone: "unclear",
				coach: "If you want to greet someone, you can say hi and your name."
			}
		]
	},
	{
		id: "feeling",
		title: "Say a feeling",
		scene: "Someone asks how you feel. You need a rest.",
		model: "I feel tired.",
		icon: "Moon",
		choices: [
			{
				text: "I feel tired.",
				tone: "clear",
				coach: "You named the feeling in a full sentence."
			},
			{
				text: "Tired.",
				tone: "ok",
				coach: "That gets the idea across. You can also say: I feel tired."
			},
			{
				text: "I don't know.",
				tone: "ok",
				coach: "That is an honest answer. You can also name a feeling: I feel tired."
			}
		]
	},
	{
		id: "goodbye",
		title: "Say goodbye",
		scene: "It is time to go.",
		model: "Bye. See you later.",
		icon: "DoorOpen",
		choices: [
			{
				text: "Bye. See you later.",
				tone: "clear",
				coach: "That lets the other person know you are leaving."
			},
			{
				text: "Bye.",
				tone: "ok",
				coach: "Short and clear. You can add: See you later."
			},
			{
				text: "Say nothing.",
				tone: "unclear",
				coach: "You can also say bye so the other person knows you are leaving."
			}
		]
	}
];
var CATEGORIES = [
	"Needs",
	"Feelings",
	"School",
	"Animals",
	"Places",
	"Outside",
	"Going",
	"Food",
	"Other"
];
function fillName(text, name) {
	return text.replaceAll("{name}", name || "friend");
}
var initial = {
	students: [{
		id: "alex",
		name: "Alex"
	}],
	activeStudentId: "alex",
	customWords: [],
	wordIds: SEED_WORDS.map((word) => word.id),
	turnIds: SEED_TURNS.map((turn) => turn.id),
	activities: [
		"picture",
		"say",
		"turns"
	],
	modes: [
		"tap",
		"type",
		"speak"
	],
	notes: { alex: "" },
	settings: {
		text: "md",
		rate: .85,
		volume: 1,
		captions: true,
		contrast: false,
		autoHear: true,
		goal: 6
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
		attempt("a12", "turns", "goodbye", "Say goodbye", "type", "clear", "2026-10-22T14:20:00.000Z")
	]
};
function attempt(id, activity, itemId, label, mode, result, at) {
	return {
		id,
		studentId: "alex",
		activity,
		itemId,
		label,
		mode,
		result,
		at
	};
}
function cleanName(name) {
	return name.replace(/\s+/g, " ").trim().slice(0, 24);
}
var useTalk = create()(persist((set, get) => ({
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
			students: [...state.students, {
				id,
				name: clean
			}],
			notes: {
				...state.notes,
				[id]: ""
			},
			activeStudentId: id
		}));
		return null;
	},
	renameStudent: (id, name) => {
		const next = name.slice(0, 24);
		if (!next.trim()) return;
		set((state) => ({ students: state.students.map((student) => student.id === id ? {
			...student,
			name: next
		} : student) }));
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
			activeStudentId: state.activeStudentId === id ? students[0].id : state.activeStudentId
		});
	},
	setNote: (id, note) => set((state) => ({ notes: {
		...state.notes,
		[id]: note.slice(0, 500)
	} })),
	toggleWord: (id) => set((state) => ({ wordIds: state.wordIds.includes(id) ? state.wordIds.filter((item) => item !== id) : [...state.wordIds, id] })),
	toggleTurn: (id) => set((state) => ({ turnIds: state.turnIds.includes(id) ? state.turnIds.filter((item) => item !== id) : [...state.turnIds, id] })),
	toggleActivity: (kind) => set((state) => ({ activities: state.activities.includes(kind) ? state.activities.filter((item) => item !== kind) : [...state.activities, kind] })),
	toggleMode: (mode) => set((state) => {
		const has = state.modes.includes(mode);
		if (has && state.modes.length === 1) return state;
		return { modes: has ? state.modes.filter((item) => item !== mode) : [...state.modes, mode] };
	}),
	addWord: (word) => {
		const clean = word.word.replace(/\s+/g, " ").trim().toLowerCase();
		if (clean.length < 1 || clean.length > 32) return "Enter a word, up to 32 letters.";
		if ([...SEED_WORDS, ...get().customWords].some((item) => item.word.toLowerCase() === clean)) return "That word is already in the list.";
		const syllables = word.syllables.map((part) => part.trim()).filter(Boolean);
		const next = {
			...word,
			id: `c-${Date.now().toString(36)}`,
			word: clean,
			hint: word.hint.replace(/\s+/g, " ").trim().slice(0, 80) || "A practice word",
			syllables: syllables.length ? syllables : [clean]
		};
		set((state) => ({
			customWords: [...state.customWords, next],
			wordIds: [...state.wordIds, next.id]
		}));
		return null;
	},
	removeCustomWord: (id) => set((state) => ({
		customWords: state.customWords.filter((word) => word.id !== id),
		wordIds: state.wordIds.filter((item) => item !== id)
	})),
	logAttempt: (entry) => set((state) => ({ attempts: [...state.attempts, {
		...entry,
		id: `t-${Date.now().toString(36)}-${state.attempts.length}`,
		at: (/* @__PURE__ */ new Date()).toISOString()
	}].slice(-400) })),
	patchSettings: (partial) => set((state) => ({ settings: {
		...state.settings,
		...partial
	} })),
	setPin: (pin) => set({ pin: pin.replace(/\D/g, "").slice(0, 4) }),
	dismissNotice: () => set({ noticeDismissed: true }),
	clearProgress: () => set({ attempts: [] }),
	resetDevice: () => set({
		...initial,
		hydrated: true
	})
}), {
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
		noticeDismissed: state.noticeDismissed
	})
}));
function allWords(custom) {
	return [...SEED_WORDS, ...custom];
}
function rateLabel(rate) {
	if (rate < .78) return "Slow";
	if (rate < .95) return "Easy";
	return "Usual";
}
function volumeLabel(volume) {
	if (volume < .4) return "Quiet";
	if (volume < .8) return "Medium";
	return "Loud";
}
function isToday(iso) {
	const date = new Date(iso);
	const now = /* @__PURE__ */ new Date();
	return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
}
var ACTIVITY_META = {
	picture: {
		title: "Find the picture",
		blurb: "Listen. Then tap the picture you hear.",
		action: "Start pictures"
	},
	say: {
		title: "Say the word",
		blurb: "Look at the picture. Say it, type it, or tap it.",
		action: "Start words"
	},
	turns: {
		title: "Take a turn",
		blurb: "Hear a sentence you can use with people. Then answer your way.",
		action: "Start turns"
	}
};
var MODE_META = {
	tap: {
		label: "Tap",
		hint: "Choose a picture or sentence"
	},
	type: {
		label: "Type",
		hint: "Write the word or sentence"
	},
	speak: {
		label: "Say",
		hint: "Speak, or mark that you said it"
	}
};
var RESULT_LABEL = {
	clear: "Clear",
	close: "Close",
	again: "Try again",
	said: "Said it"
};
function Boot() {
	const text = useTalk((state) => state.settings.text);
	const contrast = useTalk((state) => state.settings.contrast);
	(0, import_react.useEffect)(() => {
		Promise.resolve(useTalk.persist.rehydrate()).finally(() => {
			useTalk.setState({ hydrated: true });
		});
	}, []);
	(0, import_react.useEffect)(() => {
		const root = document.documentElement;
		root.dataset.contrast = contrast ? "high" : "normal";
		root.style.fontSize = text === "xl" ? "125%" : text === "lg" ? "112.5%" : "100%";
	}, [text, contrast]);
	return null;
}
var styles_default = "/assets/styles-CkOgT6Um.css";
var APP_NAME = "Talk Steps";
var Route$3 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Practice words, requests, and conversation turns. Not a diagnosis tool. Records stay on this device."
			},
			{
				name: "theme-color",
				content: "#f3f0e8"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boot, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$2 = () => import("./routes-CUEXiwIf.mjs");
var Route$2 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "Practice · Talk Steps" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./teacher-iFSX-TbZ.mjs");
var Route$1 = createFileRoute("/teacher")({
	head: () => ({ meta: [{ title: "Teacher desk · Talk Steps" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./practice._kind-BBk8vcHC.mjs");
var Route = createFileRoute("/practice/$kind")({
	head: () => ({ meta: [{ title: "Practice set · Talk Steps" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$2.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$3
	}),
	TeacherRoute: Route$1.update({
		id: "/teacher",
		path: "/teacher",
		getParentRoute: () => Route$3
	}),
	PracticeKindRoute: Route.update({
		id: "/practice/$kind",
		path: "/practice/$kind",
		getParentRoute: () => Route$3
	})
};
var routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { RESULT_LABEL as a, rateLabel as c, CATEGORIES as d, SEED_TURNS as f, MODE_META as i, useTalk as l, Route as n, allWords as o, fillName as p, ACTIVITY_META as r, isToday as s, router_exports as t, volumeLabel as u };
