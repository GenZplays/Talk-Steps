import { i as __toESM } from "../_runtime.mjs";
import { q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as RESULT_LABEL, d as CATEGORIES, f as SEED_TURNS, i as MODE_META, l as useTalk, o as allWords, r as ACTIVITY_META } from "./router-BjEUPgFN.mjs";
import { t as Shell } from "./shell-3zve1ly1.mjs";
import { a as speak, n as IconView, t as ICON_CHOICES } from "./speech-BHAvKA2Q.mjs";
import { a as Bar, i as CartesianGrid, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/teacher-iFSX-TbZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ACTIVITIES = [
	"picture",
	"say",
	"turns"
];
var MODES = [
	"tap",
	"type",
	"speak"
];
function TeacherView() {
	const pin = useTalk((state) => state.pin);
	const hydrated = useTalk((state) => state.hydrated);
	const [unlocked, setUnlocked] = (0, import_react.useState)(pin.length === 0);
	const [code, setCode] = (0, import_react.useState)("");
	const [miss, setMiss] = (0, import_react.useState)(false);
	const setPin = useTalk((state) => state.setPin);
	(0, import_react.useEffect)(() => {
		if (pin.length === 0) {
			setUnlocked(true);
			return;
		}
		try {
			if (sessionStorage.getItem("talk-steps-desk") === "open") setUnlocked(true);
		} catch {}
	}, [pin]);
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "Opening the desk…"
	});
	if (!unlocked) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "panel mx-auto grid max-w-lg gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold",
				children: "Teacher desk"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: "Enter the 4-digit code. This only hides the desk on this device. It is not an account and it does not encrypt student information."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-3",
				onSubmit: (event) => {
					event.preventDefault();
					if (code === pin) {
						setUnlocked(true);
						setMiss(false);
						try {
							sessionStorage.setItem("talk-steps-desk", "open");
						} catch {}
					} else setMiss(true);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold",
							children: "Code"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field tabular-nums",
							inputMode: "numeric",
							autoComplete: "off",
							value: code,
							onChange: (event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 4))
						})]
					}),
					miss && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-danger",
						role: "alert",
						children: "That code does not match."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "btn btn-primary btn-lg",
						children: "Open desk"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn btn-ghost justify-self-start",
				onClick: () => {
					setPin("");
					setUnlocked(true);
				},
				children: "Forgot the code? Remove it"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Anyone at this device can remove the code. Do not store private or medical details here."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold",
						children: "Teacher desk"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-2xl text-muted",
						children: "Set practice, switch students, and read progress. Nothing is uploaded. This desk does not diagnose and does not replace professional care."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex flex-wrap gap-2",
						"aria-label": "Desk sections",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "btn btn-quiet",
								href: "#plan",
								children: "Plan"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "btn btn-quiet",
								href: "#students",
								children: "Students"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "btn btn-quiet",
								href: "#progress",
								children: "Progress"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "btn btn-quiet",
								href: "#privacy",
								children: "Privacy"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plan, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Students, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Privacy, {})
		]
	});
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
	const [word, setWord] = (0, import_react.useState)("");
	const [hint, setHint] = (0, import_react.useState)("");
	const [parts, setParts] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("Other");
	const [icon, setIcon] = (0, import_react.useState)("Apple");
	const [error, setError] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "plan",
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-bold",
				children: "Practice plan"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
					className: "panel grid gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "text-lg font-bold",
						children: "Activities"
					}), ACTIVITIES.map((kind) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "mt-1",
							type: "checkbox",
							checked: activities.includes(kind),
							onChange: () => toggleActivity(kind)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-bold",
							children: ACTIVITY_META[kind].title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm text-muted",
							children: ACTIVITY_META[kind].blurb
						})] })]
					}, kind))]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
					className: "panel grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
							className: "text-lg font-bold",
							children: "Ways to answer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "At least one stays on."
						}),
						MODES.map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "mt-1",
								type: "checkbox",
								checked: modes.includes(mode),
								onChange: () => toggleMode(mode)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-bold",
								children: MODE_META[mode].label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm text-muted",
								children: MODE_META[mode].hint
							})] })]
						}, mode)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "grid gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold",
								children: "Daily try goal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "field tabular-nums",
								type: "number",
								min: 1,
								max: 30,
								value: goal,
								onChange: (event) => patchSettings({ goal: clamp(Number(event.target.value), 1, 30) })
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-bold",
						children: "Words"
					}),
					CATEGORIES.map((categoryName) => {
						const group = library.filter((item) => item.category === categoryName);
						if (group.length === 0) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
								className: "font-bold",
								children: categoryName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "grid gap-2",
								children: group.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex flex-wrap items-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex min-h-12 flex-1 items-center gap-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													checked: wordIds.includes(item.id),
													onChange: () => toggleWord(item.id)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconView, {
													name: item.icon,
													className: "size-6 text-accent"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold",
													children: item.word
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "ml-2 text-sm text-muted",
													children: item.hint
												})] })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "btn btn-quiet",
											onClick: () => speak(item.word, {
												rate,
												volume
											}),
											children: "Hear"
										}),
										item.id.startsWith("c-") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "btn btn-danger",
											onClick: () => removeCustomWord(item.id),
											children: "Remove"
										})
									]
								}, item.id))
							})]
						}, categoryName);
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "grid gap-3 border-t border-line pt-4",
						onSubmit: (event) => {
							event.preventDefault();
							const message = addWord({
								id: "new",
								word,
								hint,
								icon,
								category,
								syllables: parts.split("-").map((part) => part.trim()).filter(Boolean)
							});
							if (message) {
								setError(message);
								return;
							}
							setError("");
							setWord("");
							setHint("");
							setParts("");
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-bold",
								children: "Add a word"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "grid gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold",
											children: "Word"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "field",
											value: word,
											onChange: (event) => setWord(event.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "grid gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold",
											children: "Hint"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "field",
											value: hint,
											onChange: (event) => setHint(event.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "grid gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold",
											children: "Syllables"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "field",
											value: parts,
											placeholder: "wa-ter",
											onChange: (event) => setParts(event.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "grid gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold",
											children: "Category"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											className: "field",
											value: category,
											onChange: (event) => setCategory(event.target.value),
											children: CATEGORIES.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: name }, name))
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
								className: "grid gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
									className: "font-bold",
									children: "Picture"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2",
									children: ICON_CHOICES.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: icon === name ? "grid size-12 place-items-center rounded-md bg-accent text-accent-fg" : "grid size-12 place-items-center rounded-md border border-line-strong bg-surface text-ink",
										"aria-pressed": icon === name,
										"aria-label": name.replace(/([a-z])([A-Z])/g, "$1 $2"),
										onClick: () => setIcon(name),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconView, {
											name,
											className: "size-6"
										})
									}, name))
								})]
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-danger",
								role: "alert",
								children: error
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "btn btn-primary w-fit",
								children: "Add word"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
				className: "panel grid gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
					className: "text-lg font-bold",
					children: "Conversation turns"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-3",
					children: SEED_TURNS.map((turn) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex min-h-12 flex-1 items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "mt-1",
								type: "checkbox",
								checked: turnIds.includes(turn.id),
								onChange: () => toggleTurn(turn.id)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-bold",
								children: turn.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm text-muted",
								children: turn.model
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn btn-quiet",
							onClick: () => speak(turn.model.replaceAll("{name}", "Alex"), {
								rate,
								volume
							}),
							children: "Hear"
						})]
					}, turn.id))
				})]
			})
		]
	});
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
	const [name, setName] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "students",
		className: "panel grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-bold",
				children: "Students"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Use a first name or nickname. Do not write diagnoses, full names, or medical details in notes. Notes never leave this browser."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-4",
				children: students.map((student) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "grid gap-3 border-b border-line pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-h-12 items-center gap-2 font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "radio",
									name: "active-student",
									checked: student.id === activeStudentId,
									onChange: () => setActiveStudent(student.id)
								}), "Practicing"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "grid min-w-48 flex-1 gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: "Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "field",
									value: student.name,
									onChange: (event) => renameStudent(student.id, event.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn btn-danger",
								disabled: students.length < 2,
								onClick: () => removeStudent(student.id),
								children: "Remove"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-bold",
							children: "Practice note"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: "field area",
							value: notes[student.id] ?? "",
							onChange: (event) => setNote(student.id, event.target.value)
						})]
					})]
				}, student.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex flex-wrap items-end gap-3",
				onSubmit: (event) => {
					event.preventDefault();
					const message = addStudent(name);
					if (message) {
						setError(message);
						return;
					}
					setError("");
					setName("");
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid min-w-48 flex-1 gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold",
						children: "Add a student"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						value: name,
						placeholder: "First name",
						onChange: (event) => setName(event.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "btn btn-primary",
					children: "Add"
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				role: "alert",
				children: error
			})
		]
	});
}
function Progress() {
	const students = useTalk((state) => state.students);
	const activeStudentId = useTalk((state) => state.activeStudentId);
	const attempts = useTalk((state) => state.attempts);
	const [filter, setFilter] = (0, import_react.useState)(activeStudentId);
	const shown = attempts.filter((item) => filter === "all" || item.studentId === filter);
	const clear = shown.filter((item) => item.result === "clear").length;
	const again = shown.filter((item) => item.result === "again").length;
	const recent = [...shown].reverse().slice(0, 12);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "progress",
		className: "panel grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-bold",
					children: "Progress"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Sample tries for Alex are included so this view is not empty. Clear them under Privacy."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-bold",
						children: "Show"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "field",
						value: filter,
						onChange: (event) => setFilter(event.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "All students"
						}), students.map((student) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: student.id,
							children: student.name
						}, student.id))]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Tries",
						value: shown.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Clear",
						value: clear
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Try again",
						value: again
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "sr-only",
				children: [
					shown.length,
					" tries. ",
					clear,
					" clear. ",
					again,
					" marked try again. Bars group tries by activity."
				]
			}),
			shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No practice yet. When a student finishes a card, it shows up here." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressChart, { attempts: shown }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[36rem] border-collapse text-left text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("caption", {
							className: "mb-2 text-left font-bold",
							children: "Recent tries"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-line",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-3 font-bold",
									children: "When"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-3 font-bold",
									children: "Student"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-3 font-bold",
									children: "Activity"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-3 font-bold",
									children: "Item"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-3 font-bold",
									children: "How"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 font-bold",
									children: "Result"
								})
							]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [recent.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-line",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 pr-3 tabular-nums",
									children: formatWhen(item.at)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 pr-3",
									children: students.find((student) => student.id === item.studentId)?.name ?? "Student"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 pr-3",
									children: ACTIVITY_META[item.activity].title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 pr-3",
									children: item.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 pr-3",
									children: MODE_META[item.mode].label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2",
									children: RESULT_LABEL[item.result]
								})
							]
						}, item.id)), recent.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3",
							colSpan: 6,
							children: "No tries for this view yet."
						}) })] })
					]
				})
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-line bg-bg p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-3xl font-bold tabular-nums",
			children: value
		})]
	});
}
function ProgressChart({ attempts }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setReady(true), []);
	const data = (0, import_react.useMemo)(() => ACTIVITIES.map((activity) => ({
		name: ACTIVITY_META[activity].title.replace(" the ", " ").replace(" a ", " "),
		clear: attempts.filter((item) => item.activity === activity && item.result === "clear").length,
		close: attempts.filter((item) => item.activity === activity && (item.result === "close" || item.result === "said")).length,
		again: attempts.filter((item) => item.activity === activity && item.result === "again").length
	})), [attempts]);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-60 rounded-lg bg-bg",
		"aria-hidden": true
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-60 w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
				data,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
						stroke: "var(--color-line)",
						vertical: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "name",
						tick: {
							fill: "var(--color-muted)",
							fontSize: 12
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						allowDecimals: false,
						width: 32,
						tick: {
							fill: "var(--color-muted)",
							fontSize: 12
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
						dataKey: "clear",
						stackId: "tries",
						fill: "var(--color-accent)",
						name: "Clear"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
						dataKey: "close",
						stackId: "tries",
						fill: "var(--color-line-strong)",
						name: "Close or said"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
						dataKey: "again",
						stackId: "tries",
						fill: "var(--color-try)",
						name: "Try again"
					})
				]
			})
		})
	});
}
function Privacy() {
	const pin = useTalk((state) => state.pin);
	const setPin = useTalk((state) => state.setPin);
	const clearProgress = useTalk((state) => state.clearProgress);
	const resetDevice = useTalk((state) => state.resetDevice);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "privacy",
		className: "panel grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-bold",
				children: "Privacy"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Practice stays in this browser. Talk Steps does not claim to diagnose a speech or language disorder and is not a medical record. Export a copy if you need it, then store that file somewhere you control." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "grid max-w-xs gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold",
						children: "Teacher code"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field tabular-nums",
						inputMode: "numeric",
						autoComplete: "off",
						value: pin,
						placeholder: "Optional, 4 digits",
						onChange: (event) => setPin(event.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted",
						children: "Leave blank to keep the desk open. This is not encryption."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-quiet",
						onClick: () => {
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
								settings: state.settings
							};
							const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
							const url = URL.createObjectURL(blob);
							const link = document.createElement("a");
							link.href = url;
							link.download = "talk-steps-progress.json";
							link.click();
							URL.revokeObjectURL(url);
						},
						children: "Download progress"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Confirm, {
						label: "Clear progress",
						title: "Clear progress on this device?",
						body: "Tries are removed. Students, notes, and the plan stay.",
						confirm: "Clear progress",
						onConfirm: clearProgress
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Confirm, {
						label: "Reset this device",
						title: "Reset Talk Steps on this device?",
						body: "Students, notes, the plan, the code, and progress return to the starter example.",
						confirm: "Reset",
						onConfirm: resetDevice
					})
				]
			})
		]
	});
}
function Confirm({ label, title, body, confirm, onConfirm }) {
	const ref = (0, import_react.useRef)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "btn btn-danger",
		onClick: () => ref.current?.showModal(),
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dialog", {
		ref,
		className: "sheet",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-lg font-bold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2",
				children: body
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn btn-quiet",
					onClick: () => ref.current?.close(),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn btn-danger",
					onClick: () => {
						onConfirm();
						ref.current?.close();
					},
					children: confirm
				})]
			})
		]
	})] });
}
function clamp(value, min, max) {
	if (Number.isNaN(value)) return min;
	return Math.min(max, Math.max(min, value));
}
function formatWhen(iso) {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return iso;
	return new Intl.DateTimeFormat(void 0, {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit"
	}).format(date);
}
function TeacherPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeacherView, {}) });
}
//#endregion
export { TeacherPage as component };
