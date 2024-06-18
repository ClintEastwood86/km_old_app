import { MutableRefObject } from 'react';

export interface GenresProps {
	parent: MutableRefObject<HTMLDivElement | null>;
	take: number;
}
