import { Button, Input, Modal, Error, IsTruthy } from '@/components';
import { AddBonusModalProps } from './AddBonusModal.props';
import { StateModalProps } from '@/interfaces/stateModal.props';
import { useForm } from 'react-hook-form';
import { AddBonusModalDto } from './AddBonusModal.dto';
import { AddBonusModalValidateConfig } from './AddBonusModal.config';
import { useContext, useState } from 'react';
import { API } from '@/helpers/api';
import { isHttpError } from '@/typeguards/error.typeguard';
import { AppContext } from '@/contexts/app.context';
import { IErrorResponse } from '@/interfaces/error.interface';
import { Bonus } from '@/interfaces/bonus.interface';

export const AddBonusModal = ({ userId, login, stateModal, closeModal }: StateModalProps & AddBonusModalProps) => {
	const {
		handleSubmit,
		register,
		reset,
		formState: { errors }
	} = useForm<AddBonusModalDto>();
	const [error, setError] = useState<string>('');
	const { addNotification } = useContext(AppContext);

	const clearModal = () => {
		reset();
		closeModal();
	};

	const sendRequest = async ({ expiries, multiplier }: AddBonusModalDto) => {
		const body = { multiplier, userId, expiries };
		const response = await fetch(API.bonus.create, {
			body: JSON.stringify(body),
			credentials: 'include',
			method: 'post',
			headers: { 'Content-Type': 'application/json' }
		});
		const result: IErrorResponse | Bonus = await response.json();
		if (isHttpError(result)) {
			console.error(result);
			return setError(result.data.error);
		}
		clearModal();
		addNotification({
			title: 'Бонус успешно выдан',
			key: `sendRequest${Date.now() / 1000}`
		});
	};

	return (
		<Modal title={`Выдать бонус ${login}`} stateModal={stateModal} closeModal={closeModal}>
			<form onSubmit={handleSubmit(sendRequest)}>
				<Input
					{...register('multiplier', AddBonusModalValidateConfig.multiplier)}
					min={1}
					placeholder="2"
					id="bonus"
					type="number"
					label="Множитель"
					error={errors.multiplier}
				/>
				<Input
					{...register('expiries', AddBonusModalValidateConfig.expiries)}
					error={errors.expiries}
					type="date"
					label="Срок действия (до)"
					id="date"
				/>
				<Button children="Выдать" />
				<IsTruthy condition={error !== ''}>
					<Error>{error}</Error>
				</IsTruthy>
			</form>
		</Modal>
	);
};
