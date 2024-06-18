import { Button, IsTruthy } from '@/components';
import { SectionHead } from '@/components/SectionHead/SectionHead';
import styles from '../Comments.module.css';
import { useEffect, useState } from 'react';
import { IErrorResponse } from '@/interfaces/error.interface';
import { COMMENTS_PER_REQUEST } from '../Comments.constants';
import { CommentAttachedAlias, StatusCommentEnum } from '@/interfaces/comment.interface';
import { isHttpError } from '@/typeguards/error.typeguard';
import { CommentsTable } from '../CommentsTable/CommentsTable';
import { SectionCommentsProps } from './SectionComments.props';
import { API } from '@/helpers/api';

export const SectionComments = ({ title, status }: SectionCommentsProps): JSX.Element => {
	const [isLastPage, setIsLastPage] = useState<boolean>(false);
	const [isSendRequest, setIsSendRequest] = useState<boolean>(false);
	const [page, setPage] = useState<{ count: number }>({ count: 1 });
	const [comments, setComments] = useState<CommentAttachedAlias[]>([]);

	const processRequest = async (take: number, skip: number, status: StatusCommentEnum) => {
		setIsSendRequest(true);
		const comments = await getComments(take, skip, status);
		if (isHttpError(comments)) {
			setIsSendRequest(false);
			return console.error(comments);
		}
		if (!comments.length || comments.length % COMMENTS_PER_REQUEST !== 0) {
			setIsLastPage(true);
		}
		setComments((c) => c.concat(comments));
		setIsSendRequest(false);
	};

	const getComments = async (take: number, skip: number, status: StatusCommentEnum) => {
		const response = await fetch(API.comments.getCommentsForAdminPanel, {
			credentials: 'include',
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ take, skip, status })
		});
		const comments: CommentAttachedAlias[] | IErrorResponse = await response.json();
		return comments;
	};

	useEffect(() => {
		processRequest(COMMENTS_PER_REQUEST, COMMENTS_PER_REQUEST * (page.count - 1), status);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	return (
		<section>
			<SectionHead title={title} />
			<CommentsTable status={status} setComments={setComments} comments={comments} />
			<IsTruthy condition={!isLastPage && !isSendRequest}>
				<Button onClick={() => setPage((p) => ({ count: p.count + 1 }))} className={styles.loadButton}>
					Загрузить еще
				</Button>
			</IsTruthy>
		</section>
	);
};
