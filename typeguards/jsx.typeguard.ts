export const isJsxElement = (data: any): data is JSX.Element => {
	if ('type' in data && 'props' in data && 'key' in data) {
		return true;
	}
	return false;
};

export const isJsxComponent = <T extends (...args: any[]) => any>(func: any, ...params: Parameters<T>): func is T => {
	if (typeof func !== 'function') {
		return false;
	}
	const data = func(...params);
	if ('type' in data && 'props' in data && 'key' in data) {
		return true;
	}
	return false;
};
