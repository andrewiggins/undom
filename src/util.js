export function assign(obj, props) {
	for (let i in props) obj[i] = props[i];
}

export function toLower(str) {
	return String(str).toLowerCase();
}

export function findWhere(arr, fn, returnIndex, byValue) {
	let i = arr.length;
	while (i--) if (byValue ? arr[i]===fn : fn(arr[i])) break;
	return returnIndex ? i : i < 0 ? undefined : arr[i];
}

export function createAttributeFilter(ns, name) {
	return o => o.ns===ns && toLower(o.name)===toLower(name);
}
