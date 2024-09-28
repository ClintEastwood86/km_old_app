import { Button, Input, Modal } from '@/components';
import { API } from '@/helpers/api';
import { IErrorResponse } from '@/interfaces/error.interface';
import { StateModalProps } from '@/interfaces/stateModal.props';
import { Error } from '@/components';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IForgotPasswordModal } from './ForgotPasswordModal.interface';
import { AppContext } from '@/contexts/app.context';
import { regExp } from '@/helpers/regexp';

export const ForgotPasswordModal = ({ stateModal, closeModal, className, ...props }: StateModalProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<IForgotPasswordModal>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>();
	const { addNotification } = useContext(AppContext);

	const onSubmit = async (data: IForgotPasswordModal) => {
		setIsLoading(true);
		const res = await fetch(API.users.forgotPassword, {
			credentials: 'include',
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		setIsLoading(false);
		if (res.ok) {
			closeModal();
			return addNotification({
				title: 'Проверьте свою почту',
				key: 'forgotPassword',
				description: 'Инструкция по восстановлению выслана вам на почту'
			});
		}
		const dataResponse = (await res.json()) as IErrorResponse;
		setError(dataResponse.data.error);
	};

	return (
		<Modal
			stateLoad={isLoading}
			{...props}
			className={className}
			stateModal={stateModal}
			title="Восстановление пароля"
			closeModal={closeModal}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Input
					type="email"
					autoComplete="email"
					error={errors.email}
					{...register('email', {
						required: { value: true, message: 'Укажите почту' },
						pattern: { value: regExp.email, message: 'Разрешено использовать домены gmail.com, mail.ru, yandex.ru, vk.com' }
					})}
					placeholder="Garner01@gmail.com"
					id="email"
					label="Почта, привязанная к аккаунту:"
				/>
				<Button stretch>Восстановить пароль</Button>
				{error && <Error>{error}</Error>}
			</form>
		</Modal>
	);
};
