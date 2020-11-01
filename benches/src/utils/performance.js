/**
 * @typedef Mark
 * @property {"mark"} type
 * @property {string} name
 * @property {number} time
 *
 * @typedef Measure
 * @property {"measure"} type
 * @property {string} name
 * @property {number} duration
 */

/**
 * @type {Map<string, Mark | Measure>}
 */
const entries = new Map();
const now = () =>
	typeof performance !== "undefined" ? performance.now() : Date.now();
const globalStart = now();

const log = typeof print == "function" ? print : console.log.bind(console);

/**
 * @param {string} name
 */
export function mark(name) {
	entries.set(name, { type: "mark", name, time: now() });
}

/**
 * @param {string} name
 * @param {string} startMarkName
 * @param {string} endMarkName
 */
export function measure(name, startMarkName, endMarkName) {
	const startMark = entries.get(startMarkName);
	const start = startMark?.type == "mark" ? startMark.time : globalStart;

	const endMark = entries.get(endMarkName);
	const end = endMark?.type == "mark" ? endMark.time : now();

	entries.set(name, { type: "measure", name, duration: end - start });
}

export function logMeasures() {
	for (let entry of entries.values()) {
		if (entry.type == "measure") {
			log(`${entry.name}: ${entry.duration.toFixed(2)}ms`);
		}
	}
}
