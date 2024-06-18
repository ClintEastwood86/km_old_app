import { NextRouter } from 'next/router';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface StateModalProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	closeModal: () => void;
	stateModal: boolean;
	router?: NextRouter;
}
