import { Htag, IsTruthy, Loader } from '@/components';
import styles from './Comments.module.css';
import { InputComment } from './InputComment/InputComment';
import { UserContext } from '@/contexts/user.context';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { MoviePageContext } from '@/contexts/moviePage.context';
import { Comment } from '../../../components/Comment/Comment';
import { ICommentsProps } from './Comments.props';
import cn from 'classnames';
import { UserRole } from '@/interfaces/user.interface';
import { API } from '@/helpers/api';
import { COMMENTS_PER_REQUEST } from '../../../components/Comment/Comment.constants';
import { Comment as IComment } from '@/interfaces/comment.interface';
import { IErrorResponse } from '@/interfaces/error.interface';
import { isHttpError } from '@/typeguards/error.typeguard';

export const Comments = ({ movieId, className, ...props }: ICommentsProps) => {
	const user = useContext(UserContext);
	const { comments, setComments } = useContext(MoviePageContext);
	const ref = useRef<HTMLDivElement>(null);

	const [isSendRequest, setIsSendRequest] = useState<boolean>(false);
	const [isLastPage, setIsLastPage] = useState<boolean>(false);
	const [page, setPage] = useState<number>(0);
	const [count, setCount] = useState<number>(0);

	const getComments = useCallback(
		async (take: number, skip: number) => {
			const queries = new URLSearchParams({ take: take.toString(), skip: skip.toString() });
			const response = await fetch(`${API.comments.getByMovieId}${movieId}?${queries}`);
			const comments: IComment[] = await response.json();
			if (comments.length % COMMENTS_PER_REQUEST !== 0 || !comments.length) {
				setIsLastPage(true);
			}
			setComments((c) => c.concat(comments));
			setIsSendRequest(false);
		},
		[movieId, setComments]
	);

	const setCommentCount = useCallback(async () => {
		const response = await fetch(API.comments.getCount + movieId);
		let count: number | IErrorResponse = await response.json();
		if (isHttpError(count)) {
			count = 0;
		}
		setCount(count);
	}, [movieId]);

	const handleScroll = useCallback(() => {
		if (!ref.current || isSendRequest || isLastPage) return;
		if (ref.current.getBoundingClientRect().bottom - window.innerHeight - 150 < 0) {
			setIsSendRequest(true);
			setPage((p) => p + 1);
		}
	}, [isLastPage, isSendRequest]);

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [handleScroll]);

	useEffect(() => {
		getComments(COMMENTS_PER_REQUEST, COMMENTS_PER_REQUEST * page);
	}, [page, getComments]);

	useEffect(() => {
		setCommentCount();
	}, [setCommentCount]);

	return (
		<section ref={ref} {...props} className={cn(className)}>
			<Htag tag="h2">
				Комментарии <span className={styles.count}>{count}</span>
			</Htag>
			<InputComment movieId={movieId} className={styles.input} user={user} />
			{useMemo(
				() => (
					<div className={styles.messages}>
						{comments.map((c) => (
							<Comment
								movieId={movieId}
								isModerator={user.isAuth && (user.role == UserRole.ADMIN || user.role == UserRole.MODERATOR)}
								userId={user.isAuth ? user.id : undefined}
								data={c}
								key={c.id}
							/>
						))}
					</div>
				),
				[comments, movieId, user]
			)}
			<IsTruthy condition={!isLastPage}>
				<div className={styles.loader}>
					<Loader />
				</div>
			</IsTruthy>
		</section>
	);
};
