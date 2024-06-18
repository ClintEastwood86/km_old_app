import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

export interface ModalProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	title: string;
	closeModal(): void;
	stateModal: boolean;
	children: ReactNode;
	stateLoad?: boolean;
}
