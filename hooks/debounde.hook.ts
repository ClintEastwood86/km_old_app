import { useState } from 'react';

export const useDebounce = <T extends (...args: any[]) => any>(callback: T, time: number) => {
	const [id, setId] = useState<NodeJS.Timeout | null>(null);

	const debounced = (...args: Parameters<T>) => {
		if (id !== null) {
			clearTimeout(id);
		}
		setId(
			setTimeout(() => {
				setId(null);
				callback(...args);
			}, time)
		);
	};
	return debounced;
};
