import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface BurgerMenuProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	onClose(): void;
	state: boolean;
}
