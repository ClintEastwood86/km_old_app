import { Dispatch, SetStateAction } from 'react';

export interface DeleteCommentModalProps {
	state: boolean;
	setState: Dispatch<SetStateAction<boolean>>;
	commentId: number;
	onDelete?(id: number): void;
}
