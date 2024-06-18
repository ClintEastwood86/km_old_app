import { Button, Input, Modal, Error } from '@/components';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ProfileModalProps } from '../ProfileModal.props';
import { validateConfig } from '@/configs/validate.config';
import { API } from '@/helpers/api';
import { isHttpError } from '@/typeguards/error.typeguard';
import { AppContext } from '@/contexts/app.context';
import { useCookies } from '@/hooks/cookies.hook';

export interface IChangePasswordForm {
	oldPassword: string;
	newPassword: string;
}

export const ChangePasswordModal = ({ state, setState }: ProfileModalProps): JSX.Element => {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<IChangePasswordForm>();
	const [error, setError] = useState<string>();
	const { addNotification } = useContext(AppContext);
	const { logout } = useCookies();

	const closeModal = () => {
		setState(false);
	};

	const onSubmit = (dataModal: IChangePasswordForm) => {
		fetch(API.users.changePassword, {
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			method: 'put',
			body: JSON.stringify(dataModal)
		})
			.then((response) => response.json())
			.then((dataOrError) => {
				if (isHttpError(dataOrError)) {
					return setError(dataOrError.data.error);
				}
				addNotification({
					title: 'Пароль сменён',
					description: 'Требуется повторная авторизация',
					key: `changePassword${Date.now() / 1000}`
				});
				logout();
			});
	};

	return (
		<Modal title="Сменить пароль" closeModal={closeModal} stateModal={state}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Input
					autoFocus
					{...register('oldPassword', { ...validateConfig.password })}
					error={errors.oldPassword}
					id="oldpass"
					isPassword
					label="Введите старый пароль"
					placeholder="********"
				/>
				<Input
					{...register('newPassword', { ...validateConfig.password })}
					error={errors.newPassword}
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
