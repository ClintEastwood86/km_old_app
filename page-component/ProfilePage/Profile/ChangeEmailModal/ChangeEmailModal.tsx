import { Button, Input, Modal, Error, P } from '@/components';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ProfileModalProps } from '../ProfileModal.props';
import { validateConfig } from '@/configs/validate.config';
import { API } from '@/helpers/api';
import { isHttpError } from '@/typeguards/error.typeguard';
import { AppContext } from '@/contexts/app.context';
import { regExp } from '@/helpers/regexp';

export interface IChangeEmailForm {
	email: string;
}

export const ChangeEmailModal = ({ state, setState }: ProfileModalProps): JSX.Element => {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<IChangeEmailForm>();
	const [error, setError] = useState<string>();
	const { addNotification } = useContext(AppContext);

	const closeModal = () => {
		setState(false);
	};

	const onSubmit = (data: IChangeEmailForm) => {
		fetch(API.users.changeEmail, {
			credentials: 'include',
			method: 'put',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		})
			.then((res) => res.json())
			.then((dataOrError) => {
				if (isHttpError(dataOrError)) {
					return setError(dataOrError.data.error);
				}
				closeModal();
				addNotification({
					title: 'Теперь вам нужно подтвердить почту',
					description: `Новая почта – ${data.email}`,
					key: `changeEmail${Date.now() / 1000}`
				});
			});
	};

	return (
		<Modal title="Сменить почту" closeModal={closeModal} stateModal={state}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Input
					autoFocus
					error={errors.email}
					{...register('email', {
						required: { value: true, message: 'Укажите почту' },
						pattern: { value: regExp.email, message: 'Разрешено использовать домены gmail.com, mail.ru, yandex.ru, vk.com' }
					})}
					id="email"
					type="email"
					placeholder="garner01@gmail.com"
					label="Введите новый email"
				/>
				<P color="red" size="s">
					Ваш аккаунт будет заблокирован, пока вы не подтвердите новую почту
				</P>
				<Button stretch>Сменить почту</Button>
				{error && <Error>{error}</Error>}
			</form>
		</Modal>
	);
};
