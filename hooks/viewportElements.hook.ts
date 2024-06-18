import { IViewportConfig } from '@/configs/row.config';
import { useEffect, useState } from 'react';

export const useViewportElements = (config: IViewportConfig[], defaultValue: number) => {
	const [elements, setElements] = useState<number>(defaultValue);
	const [isUpdated, setIsUpdated] = useState<boolean>(false);

	useEffect(() => {
		const elements = config.find((el) => el.viewport >= window.innerWidth)?.elements;
		elements && setElements(elements);
		setIsUpdated(true);
	}, [config]);

	return { elements, updated: isUpdated };
};
