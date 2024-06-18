import { UserModelShortForContext } from '@/interfaces/user.interface';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface InputCommentProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	user: UserModelShortForContext;
	movieId: number;
	parentId?: number;
}
