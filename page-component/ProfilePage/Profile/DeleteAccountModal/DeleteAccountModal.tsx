import { Button, Modal, Error, Input } from '@/components';
import { validateConfig } from '@/configs/validate.config';
import { API } from '@/helpers/api';
import { ILoginModal } from '@/layout/LoginModal/LoginModal.interface';
import { isHttpError } from '@/typeguards/error.typeguard';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ProfileModalProps } from '../ProfileModal.props';
import { AppContext } from '@/contexts/app.context';
import { useRouter } from 'next/router';

export const DeleteAccountModal = ({ state, setState }: ProfileModalProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<ILoginModal>();
	const [error, setError] = useState<string>();
	const router = useRouter();
	const { addNotification } = useContext(AppContext);

	const closeModal = () => {
		setState(false);
	};

	const onSubmit = (data: ILoginModal) => {
		request(data);
	};

	const request = async (data: ILoginModal) => {
		const res = await fetch(API.users.deleteAccount, {
			credentials: 'include',
			method: 'delete',
			body: JSON.stringify(data),
			headers: { 'Content-Type': 'application/json' }
		});
		const dataOrError = await res.json();
		if (isHttpError(dataOrError)) {
			return setError(dataOrError.data.error);
		}
		closeModal();
		addNotification({
			title: `Аккаунт ${data.email} был удален`,
			key: `deleteAccount${Date.now() / 1000}`
		});
		router.push(router.asPath, {}, { shallow: true });
	};

	return (
		<Modal closeModal={closeModal} stateModal={state} title="Удалить аккаунт">
			<form onSubmit={handleSubmit(onSubmit)}>
				<Input
					autoFocus
					error={errors.email}
					{...register('email', validateConfig.email)}
					label="Введите email"
					id="email"
					placeholder="garner01@gmail.com"
				/>
				<Input
					error={errors.password}
					isPassword
					{...register('password', validateConfig.password)}
					label="Введите пароль"
					id="password"
					placeholder="**********"
				/>
				<Button stretch>Удалить аккаунт</Button>
				{error && <Error>{error}</Error>}
			</form>
		</Modal>
	);
};
