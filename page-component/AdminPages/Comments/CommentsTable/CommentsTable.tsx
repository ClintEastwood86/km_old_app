import { ITableHead } from '@/interfaces/table.interface';
import { CommentsTableProps } from './CommentsTable.props';
import { AvatarEmpty, IsTruthy, Table } from '@/components';
import { Comment, CommentAttachedAlias, StatusCommentEnum } from '@/interfaces/comment.interface';
import { myLoader } from '@/helpers/loader';
import dayjs from 'dayjs';
import Link from 'next/link';
import Tick from '@/public/tick.svg';
import Cross from '@/public/cross.svg';
import LinkIcon from '@/public/link.svg';
import Image from 'next/image';
import styles from './CommentsTable.module.css';
import { pasteEmoji } from '@/helpers/emoji';
import { API } from '@/helpers/api';
import { IErrorResponse } from '@/interfaces/error.interface';
import { isHttpError } from '@/typeguards/error.typeguard';
import { useContext, useState } from 'react';
import { AppContext } from '@/contexts/app.context';
import { DeleteCommentModal } from '@/components/DeleteCommentModal/DeleteCommentModal';

const tableHead: ITableHead[] = [
	{ key: 'avatar', name: 'Аватарка' },
	{ key: 'login', name: 'Логин' },
	{ key: 'createdAt', name: 'Дата' },
	{ key: 'message', name: 'Комментарий' },
	{ key: 'actions', name: 'Действия' }
];

export const CommentsTable = ({ status, comments, setComments }: CommentsTableProps): JSX.Element => {
	const { addNotification } = useContext(AppContext);
	const [stateDeleteModal, setStateDeleteModal] = useState<boolean>(false);
	const [id, setId] = useState<number | null>(null);

	async function publishComment(id: number): Promise<void> {
		const response = await fetch(API.comments.publish + id, {
			credentials: 'include',
			method: 'put'
		});
		const comment: Comment | IErrorResponse = await response.json();
		if (isHttpError(comment)) {
			console.error(comment);
			return addNotification({ title: comment.message, description: comment.data.error, key: 'error' });
		}
		addNotification({ title: 'Комментарий успешно опубликован', key: `ok${Date.now() / 1000}` });
		cleanUpComments(id);
	}

	function cleanUpComments(id: number) {
		setComments((comments) => comments.filter((comment) => comment.id !== id));
	}

	async function rejectComment(id: number): Promise<void> {
		setId(id);
		setStateDeleteModal(true);
	}

	const constructCommentToData = (comment: CommentAttachedAlias): Record<string, JSX.Element | JSX.Element[]> => {
		const avatar = comment.user.avatar ? (
			<Image src={process.env.NEXT_PUBLIC_DOMAIN + comment.user.avatar} alt={comment.user.login} unoptimized fill loader={myLoader} />
		) : (
			<AvatarEmpty />
		);
		return {
			avatar: (
				<div className={styles.avatar}>
					<Link className={styles.avatarLink} href={`/user/${comment.user.id}`}>
						{avatar}
					</Link>
				</div>
			),
			login: <p>{comment.user.login}</p>,
			createdAt: <p>{dayjs(comment.createdAt).locale('ru-RU').format('DD-MM-YYYY HH:mm')}</p>,
			message: <div className={styles.message}>{pasteEmoji(comment.content)}</div>,
			actions: [
				<IsTruthy key="publish" condition={status !== StatusCommentEnum.Published}>
					<button onClick={() => publishComment(comment.id)} title="Опубликовать">
						<Tick className={styles.publish} />
					</button>
				</IsTruthy>,
				<IsTruthy key="reject" condition={status !== StatusCommentEnum.Reject}>
					<button onClick={() => rejectComment(comment.id)} title="Отклонить">
						<Cross className={styles.reject} />
					</button>
				</IsTruthy>,
				<Link key="linkToMovie" title="Перейти на фильм" target="_blank" href={`/movie/${comment.alias}`}>
					<LinkIcon className={styles.linkIcon} />
				</Link>
			]
		};
	};

	return (
		<>
			<Table className={styles.table} head={tableHead} data={comments.map(constructCommentToData)} appearance="light" short />
			<DeleteCommentModal onDelete={cleanUpComments} commentId={id || 0} setState={setStateDeleteModal} state={stateDeleteModal} />
		</>
	);
};
