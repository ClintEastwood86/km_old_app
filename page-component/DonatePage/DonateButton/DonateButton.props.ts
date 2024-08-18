import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface DonateButtonProps extends DetailedHTMLProps<HTMLAttributes<HTMLFormElement>, HTMLFormElement> {
	sum: number;
	billNumber: string;
}
