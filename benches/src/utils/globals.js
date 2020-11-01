import undom from "../../node_modules/undom/src/undom.js";

/** @type {Document} */
// @ts-expect-error undom doesn't return the real Document type
const document = undom();
globalThis.document = document;
globalThis.window = document.defaultView;

const main = globalThis.document.createElement("div");
document.body.appendChild(main);

const root = globalThis.document.createElement("div");
document.body.appendChild(root);

globalThis.document.getElementById = function (id) {
	return id === "main" ? main : id == "root" ? root : null;
};

// @ts-ignore
globalThis.requestAnimationFrame = function (cb) {
	return setTimeout(() => cb(Date.now()), 0)
}
