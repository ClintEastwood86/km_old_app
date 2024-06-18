import { Button, Error, Input, IsTruthy, Modal } from '@/components';
import { DeleteCommentModalProps } from './DeleteCommentModal.props';
import { useContext, useState } from 'react';
import { API } from '@/helpers/api';
import { isHttpError } from '@/typeguards/error.typeguard';
import { AppContext } from '@/contexts/app.context';
import { useForm } from 'react-hook-form';
import { IDeleteCommentModal } from './DeleteCommentModal.interface';
import { Comment } from '@/interfaces/comment.interface';
import { IErrorResponse } from '@/interfaces/error.interface';

export const DeleteCommentModal = ({ onDelete, commentId, state, setState }: DeleteCommentModalProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<IDeleteCommentModal>();
	const closeModal = () => setState(false);
	const { addNotification } = useContext(AppContext);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>();

	const deleteComment = async ({ cause }: IDeleteCommentModal) => {
		setIsLoading(true);
		const response = await fetch(API.comments.reject + commentId, {
			credentials: 'include',
			method: 'put',
			body: JSON.stringify({ cause }),
			headers: { 'Content-Type': 'application/json' }
		});
		const result: Comment | IErrorResponse = await response.json();
		setIsLoading(false);
		if (isHttpError(result)) {
			setError(result.data.error);
			return addNotification({
				title: result.message,
				description: result.data.error,
				key: (Date.now() / 100).toString()
			});
		}
		addNotification({
			title: 'Комментарий успешно удален',
			key: (Date.now() / 100).toString()
		});
		onDelete && onDelete(result.id);
		closeModal();
	};

	return (
		<Modal stateLoad={isLoading} stateModal={state} closeModal={closeModal} title="Удалить комментарий">
			<form onSubmit={handleSubmit(deleteComment)}>
				<Input
					{...register('cause', {
						minLength: { value: 5, message: 'Минимальная длина 5 символов' },
						required: { value: true, message: 'Укажите причину' }
					})}
					label="Укажите причину"
					error={errors.cause}
					id="delete"
					placeholder="Ненормативная лексика"
				/>
				<Button stretch>Удалить</Button>
				<IsTruthy condition={!!error} children={<Error>{error}</Error>} />
			</form>
		</Modal>
	);
};
