import { StateModalProps } from '@/interfaces/stateModal.props';
import { Dispatch, SetStateAction } from 'react';

export interface PlaylistMoviesModalProps extends StateModalProps {
	moviesId: number[];
	setChecked: Dispatch<SetStateAction<number[]>>;
}
