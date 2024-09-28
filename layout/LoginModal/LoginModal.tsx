import { Button, Input, Modal, P } from '@/components';
import { API } from '@/helpers/api';
import { IErrorResponse } from '@/interfaces/error.interface';
import { StateModalProps } from '@/interfaces/stateModal.props';
import { Error } from '@/components';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ILoginModal } from './LoginModal.interface';
import { regExp } from '@/helpers/regexp';
import styles from './LoginModal.module.css';

export const LoginModal = ({
	router,
	stateModal,
	closeModal,
	className,
	openForgotPasswordModal,
	...props
}: StateModalProps & { openForgotPasswordModal: () => void }) => {
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

	const switchForgotPasswordModal = () => {
		closeModal();
		openForgotPasswordModal();
	};

	return (
		<Modal stateLoad={isLoading} {...props} className={className} stateModal={stateModal} title="Вход" closeModal={closeModal}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Input
					autoFocus
					type="email"
					error={errors.email}
					{...register('email', {
						required: { value: true, message: 'Укажите почту' },
						pattern: { value: regExp.email, message: 'Разрешено использовать домены gmail.com, mail.ru, yandex.ru, vk.com' }
					})}
					placeholder="Garner01@gmail.com"
					id="email"
					label="Укажите почту:"
				/>
				<Input
					error={errors.password}
					{...register('password', {
						required: { value: true, message: 'Укажите пароль' },
						maxLength: { value: 21, message: 'Максимальная длина пароля – 21 символ' },
						minLength: { value: 8, message: 'Минимальная длина пароля – 8 символов' },
						pattern: { value: regExp.password, message: 'Пароль должен содержать только цифры, буквы и специальные символы' }
					})}
					placeholder="************"
					isPassword
					id="password"
					label="Укажите пароль:"
				/>
				<Button stretch>Вход</Button>
				<button onClick={switchForgotPasswordModal} type="button" className={styles.forgotButton}>
					<P size="s" color="secondary">
						Забыли пароль?
					</P>
				</button>
				{error && <Error>{error}</Error>}
			</form>
		</Modal>
	);
};
