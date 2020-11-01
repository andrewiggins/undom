import "./utils/globals.js";
import { mark, measure, logMeasures } from "./utils/performance.js";

import {
	measureName,
	measureMemory,
	testElementText,
	afterFrame,
	afterFrameAsync,
	markRunStart,
	markRunEnd,
} from "./utils/util.js";
// @ts-expect-error TS intellisense doesn't like .mjs extensions
import * as framework from "../node_modules/keyed/dist/keyed.mjs";
import { render } from "./keyed-children/index.js";

const { run } = render(framework, document.getElementById("main"));

async function main() {
	const elementSelector = "tr:first-child > td:first-child";

	const WARMUP_COUNT = 10;
	for (let i = 0; i < WARMUP_COUNT; i++) {
		markRunStart(`warmup-${i}`);
		run();
		await markRunEnd(`warmup-${i}`);

		await afterFrameAsync();
		testElementText(elementSelector, (i * 1000 + 1).toFixed());
	}

	await afterFrameAsync();

	afterFrame(function () {
		testElementText(elementSelector, "10001");
		mark("stop");
		measure(measureName, "start", "stop");

		measureMemory();
		logMeasures();
	});

	markRunStart("final");
	mark("start");
	run();
	await markRunEnd("final");
}

afterFrame(main);
