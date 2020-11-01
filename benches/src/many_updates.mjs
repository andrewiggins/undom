import "./utils/globals.js";
import { mark, measure, logMeasures } from "./utils/performance.js";

import {
	measureName,
	measureMemory,
	markRunStart,
	markRunEnd,
} from "./utils/util.js";
import {
	createRoot,
	createElement as h,
	// @ts-expect-error
} from "../node_modules/keyed/dist/keyed.mjs";

const state = {
	msg: "hello",
	list: new Array(1000).fill(0).map((_, i) => ({
		i,
		text: "foobar" + i,
	})),
};

let counter = 0;
function App() {
	return h(
		"div",
		{ id: "app" },
		h("p", null, "> ", ++counter, " <"),
		h("p", null, state.msg),
		...state.list.map((obj, i) =>
			h(
				"div",
				{ key: i, title: state.msg + i },
				h("span", { className: state.msg }, obj.text),
				h("span", { className: "baz" }, "one"),
				h("span", { className: "qux" }, "two"),
				h(
					"div",
					null,
					h("span", { className: "qux" }, "three"),
					h("span", { className: "qux" }, "four"),
					h("span", { className: "baz" }, "five"),
					h(
						"div",
						null,
						h("span", { className: "qux" }, "six"),
						h("span", { className: "baz" }, "seven"),
						h("span", { className: state.msg }, "eight")
					)
				)
			)
		)
	);
}

const root = createRoot(document.getElementById("root"));

// const p = performance.now();
root.render(h(App));
// console.log(`mount: ${(performance.now() - p).toFixed(2)}ms`);

// const patchResults = [];

function runPatch() {
	// const s = performance.now();
	state.msg = state.msg === "hello" ? "bye" : "hello";
	state.list[0].text = state.msg;
	root.render(h(App));
	// patchResults.push(performance.now() - s);
}

async function warmup() {
	// const count = 100;
	const count = 25;

	for (let i = 0; i < count; i++) {
		if (i > count - 5) {
			markRunStart(`warmup-${i}`);
		}

		runPatch();

		if (i > count - 5) {
			await markRunEnd(`warmup-${i}`);
		}

		await new Promise((r) => requestAnimationFrame(r));
	}

	// let fastest = Infinity;
	// const total = patchResults.reduce((all, cur) => {
	// 	if (cur < fastest) {
	// 		fastest = cur;
	// 	}
	// 	return all + cur;
	// }, 0);

	// console.log(`${count} runs average: ${(total / count).toFixed(2)}ms`);
	// console.log(`fastest run: ${fastest.toFixed(2)}ms`);
}

// setTimeout(() => {
warmup().then(async () => {
	markRunStart("final");
	mark("start");
	runPatch();
	await markRunEnd("final");
	await new Promise((r) => requestAnimationFrame(r));
	mark("stop");
	measure(measureName, "start", "stop");

	measureMemory();
	logMeasures();
});
// }, 5000);
