import { Button, Input, Modal, Error, IsTruthy } from '@/components';
import { AddPointsModalProps } from './AddPointsModal.props';
import { StateModalProps } from '@/interfaces/stateModal.props';
import { useForm } from 'react-hook-form';
import { AddPointsModalDto } from './AddPointsModal.dto';
import { AddPointsModalValidateConfig } from './AddPointsModal.config';
import { useContext, useState } from 'react';
import { API } from '@/helpers/api';
import { isHttpError } from '@/typeguards/error.typeguard';
import { AppContext } from '@/contexts/app.context';

export const AddPointsModal = ({ userId: id, login, stateModal, closeModal }: StateModalProps & AddPointsModalProps) => {
	const {
		handleSubmit,
		register,
		reset,
		formState: { errors }
	} = useForm<AddPointsModalDto>();
	const [error, setError] = useState<string>('');
	const { addNotification } = useContext(AppContext);

	const clearModal = () => {
		reset();
		closeModal();
	};

	const sendRequest = async ({ points, message }: AddPointsModalDto) => {
		const body = { points, userId: id, message };
		const response = await fetch(API.users.addPoints, {
			body: JSON.stringify(body),
			credentials: 'include',
			method: 'post',
			headers: { 'Content-Type': 'application/json' }
		});
		const result = await response.json();
		if (isHttpError(result)) {
			console.error(result);
			return setError(result.data.error);
		}
		clearModal();
		addNotification({
			title: 'Данные успешно обновлены',
			description: `Конечное количество очков – ${result}`,
			key: `sendRequest${Date.now() / 1000}`
		});
	};

	return (
		<Modal title={`Добавить очков ${login}`} stateModal={stateModal} closeModal={closeModal}>
			<form onSubmit={handleSubmit(sendRequest)}>
				<Input
					{...register('points', AddPointsModalValidateConfig.points)}
					min={1}
					placeholder="100"
					id="points"
					type="number"
					label="Количество"
					error={errors.points}
				/>
				<Input
					{...register('message', AddPointsModalValidateConfig.message)}
					placeholder="За участие в конкурсе"
					id="message"
					label="Сообщение"
					error={errors.message}
				/>
				<Button children="Добавить" />
				<IsTruthy condition={!!errors.userId?.message}>
					<Error>{errors.userId?.message}</Error>
				</IsTruthy>
				<IsTruthy condition={error !== ''}>
					<Error>{error}</Error>
				</IsTruthy>
			</form>
		</Modal>
	);
};
