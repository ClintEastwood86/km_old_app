import { Button, Captcha, Checkbox, Input, Modal, P } from '@/components';
import { validateConfig } from '@/configs/validate.config';
import { API } from '@/helpers/api';
import { IErrorResponse } from '@/interfaces/error.interface';
import { StateModalProps } from '@/interfaces/stateModal.props';
import { Error } from '@/components';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from '../Layout.module.css';
import { IRegisterModal } from './RegisterModal.interface';
import { AppContext } from '@/contexts/app.context';

export const RegisterModal = ({ stateModal, closeModal, className, ...props }: StateModalProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<IRegisterModal>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>();
	const [token, setToken] = useState<string>();
	const { addNotification } = useContext(AppContext);

	const onSubmit = async (dataFrom: IRegisterModal) => {
		// if (!token) {
		// 	setError('Капча не пройдена');
		// 	return;
		// }
		const responseData: Omit<IRegisterModal, 'policyAccept'> & { policyAccept?: boolean } = dataFrom;
		delete responseData['policyAccept'];
		setIsLoading(true);
		const res = await fetch(API.users.register, {
			credentials: 'include',
			method: 'POST',
			body: JSON.stringify(responseData),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		setIsLoading(false);
		if (res.ok) {
			closeModal();
			return addNotification({
				title: 'Проверьте свою почту',
				key: 'register',
				description: 'Ваш аккаунт зарегистрирован, но нужно подтвердить свою почту'
			});
		}
		const dataResponse = (await res.json()) as IErrorResponse;
		setError(dataResponse.data.error);
	};

	return (
		<Modal stateLoad={isLoading} {...props} className={className} stateModal={stateModal} title="Регистрация" closeModal={closeModal}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Input
					autoFocus
					error={errors.login}
					{...register('login', validateConfig.login)}
					placeholder="Garner01"
					id="login"
					label="Укажите логин:"
				/>
				<Input
					type="email"
					autoComplete="email"
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
				{/* <Captcha onToken={setToken} /> */}
				<Checkbox {...register('notification')} id="notification">
					<P size="s" color="gray">
						Хочу быть в курсе важных событий в мире кино
					</P>
				</Checkbox>
				<Checkbox
					className={styles.checkbox}
					error={errors.policyAccept}
					{...register('policyAccept', validateConfig.policyAccept)}
					id="policyAccept">
					<P size="s" color="gray">
						Регистрируя новый профиль, вы принимаете <a href="/user-agreement">условия пользовательского соглашения</a>
					</P>
				</Checkbox>
				<Button stretch>Регистрация</Button>
				{error && <Error>{error}</Error>}
			</form>
		</Modal>
	);
};
