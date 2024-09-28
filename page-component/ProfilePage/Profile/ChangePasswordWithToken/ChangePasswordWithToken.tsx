import { Button, Input, Modal, Error } from '@/components';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { API } from '@/helpers/api';
import { isHttpError } from '@/typeguards/error.typeguard';
import { regExp } from '@/helpers/regexp';
import { useRouter } from 'next/router';
import { staticNotifications } from '@/constants/static-notifications.constants';

export interface IForgotPasswordForm {
	password: string;
}

export const ChangePasswordWithToken = (): JSX.Element => {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<IForgotPasswordForm>();
	const [error, setError] = useState<string>();
	const router = useRouter();

	const closeModal = (isSuccess = false) => {
		const notificationKey = staticNotifications.passwordChanged.key;
		router.push(isSuccess ? `/?n=${notificationKey}` : '/', undefined, { shallow: true });
	};

	const onSubmit = (dataModal: IForgotPasswordForm) => {
		const dto = { ...dataModal, token: router.query.token };
		fetch(API.users.changePasswordWithToken, {
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			method: 'put',
			body: JSON.stringify(dto)
		})
			.then((response) => response.json())
			.then((dataOrError) => {
				if (isHttpError(dataOrError)) {
					return setError(dataOrError.data.error);
				}
				closeModal(true);
			});
	};

	return (
		<Modal title="Сменить пароль" closeModal={() => closeModal(false)} stateModal={true}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Input
					{...register('password', {
						required: { value: true, message: 'Укажите пароль' },
						maxLength: { value: 21, message: 'Максимальная длина пароля – 21 символ' },
						minLength: { value: 8, message: 'Минимальная длина пароля – 8 символов' },
						pattern: { value: regExp.password, message: 'Пароль должен содержать только цифры, буквы и специальные символы' }
					})}
					error={errors.password}
					id="newpass"
					isPassword
					label="Введите новый пароль"
					placeholder="********"
				/>
				<Button stretch>Сменить пароль</Button>
				{error && <Error>{error}</Error>}
			</form>
		</Modal>
	);
};
