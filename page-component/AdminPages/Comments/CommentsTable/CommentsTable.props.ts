import { CommentAttachedAlias, StatusCommentEnum } from '@/interfaces/comment.interface';
import { Dispatch, SetStateAction } from 'react';

export interface CommentsTableProps {
	comments: CommentAttachedAlias[];
	setComments: Dispatch<SetStateAction<CommentAttachedAlias[]>>;
	status: StatusCommentEnum;
}
