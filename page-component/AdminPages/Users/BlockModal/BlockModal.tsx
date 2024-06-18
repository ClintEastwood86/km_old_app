import { Modal, Input, Button, IsTruthy, Error } from '@/components';
import { AppContext } from '@/contexts/app.context';
import { API } from '@/helpers/api';
import { StateModalProps } from '@/interfaces/stateModal.props';
import { isHttpError } from '@/typeguards/error.typeguard';
import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { BlockModalProps } from './BlockModal.props';
import { BlockModalDto } from './BlockModal.dto';
import { BlockModalValidateConfig } from './BlockModal.config';

export const BlockModal = ({ userId: id, login, isBlocked, stateModal, closeModal }: StateModalProps & BlockModalProps) => {
	const {
		handleSubmit,
		register,
		reset,
		formState: { errors }
	} = useForm<BlockModalDto>();
	const [error, setError] = useState<string>('');
	const { addNotification } = useContext(AppContext);

	const clearModal = () => {
		reset();
		closeModal();
	};

	const sendRequest = async ({ message }: BlockModalDto) => {
		const body = { message };
		const route: keyof (typeof API)['users'] = isBlocked ? 'unblock' : 'block';
		const response = await fetch(API.users[route] + id, {
			body: JSON.stringify(body),
			credentials: 'include',
			method: 'put',
			headers: { 'Content-Type': 'application/json' }
		});
		const result = await response.json();
		if (isHttpError(result)) {
			console.error(result);
			return setError(result.data.error);
		}
		clearModal();
		addNotification({
			title: isBlocked ? 'Разблокирован' : 'Заблокирован',
			description: `Пользователь ${login} был ${isBlocked ? 'Разблокирован' : 'Заблокирован'}`,
			key: `sendRequest${Date.now() / 1000}`
		});
	};

	return (
		<Modal title={`${isBlocked ? 'Разблокировать' : 'Заблокировать'} ${login}`} stateModal={stateModal} closeModal={closeModal}>
			<form onSubmit={handleSubmit(sendRequest)}>
				<Input
					disabled={isBlocked}
					{...register('message', BlockModalValidateConfig.message(isBlocked))}
					placeholder="Оголённая фотография на аватарке"
					id="message"
					label="Причина"
					error={errors.message}
				/>
				<Button children={isBlocked ? 'Разблокировать' : 'Заблокировать'} />
				<IsTruthy condition={error !== ''}>
					<Error>{error}</Error>
				</IsTruthy>
			</form>
		</Modal>
	);
};
