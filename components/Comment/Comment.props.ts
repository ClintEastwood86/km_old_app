import { Comment } from '@/interfaces/comment.interface';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface CommentProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	data: Comment;
	userId?: number;
	isModerator: boolean;
	movieId: number;
}
