import { Button, Input, Modal } from '@/components';
import { validateConfig } from '@/configs/validate.config';
import { API } from '@/helpers/api';
import { IErrorResponse } from '@/interfaces/error.interface';
import { StateModalProps } from '@/interfaces/stateModal.props';
import { Error } from '@/components';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ILoginModal } from './LoginModal.interface';

export const LoginModal = ({ router, stateModal, closeModal, className, ...props }: StateModalProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<ILoginModal>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>();

	const onSubmit = async (dataFrom: ILoginModal) => {
		setIsLoading(true);
		const res = await fetch(API.users.login, {
			credentials: 'include',
			method: 'POST',
			body: JSON.stringify(dataFrom),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		setIsLoading(false);
		if (res.ok) {
			return router?.reload();
		}
		const dataResponse = (await res.json()) as IErrorResponse;
		setError(dataResponse.data.error);
	};

	return (
		<Modal stateLoad={isLoading} {...props} className={className} stateModal={stateModal} title="Вход" closeModal={closeModal}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Input
					autoFocus
					type="email"
					error={errors.email}
					{...register('email', validateConfig.email)}
					placeholder="Garner01@gmail.com"
					id="email"
					label="Укажите почту:"
				/>
				<Input
					error={errors.password}
					{...register('password', validateConfig.password)}
					placeholder="************"
					isPassword
					id="password"
					label="Укажите пароль:"
				/>
				<Button stretch>Вход</Button>
				{error && <Error>{error}</Error>}
			</form>
		</Modal>
	);
};
