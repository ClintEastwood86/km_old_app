import { TopWrapperProps } from './TopWrapper.props';
import Image from 'next/image';
import styles from './TopWrapper.module.css';
import cn from 'classnames';
import { AvatarEmpty, Wrapper, Error, Loader, Htag, Input, Button, P, IsTruthy } from '@/components';
import { ChangeEvent, useContext, useState } from 'react';
import { API } from '@/helpers/api';
import { isHttpError } from '@/typeguards/error.typeguard';
import { useRouter } from 'next/router';
import { validateConfig } from '@/configs/validate.config';
import { useForm } from 'react-hook-form';
import parse from 'html-react-parser';
import Edit from './edit.svg';
import AdminIcon from './admin.svg';
import Copy from '@/public/copy.svg';
import { myLoader } from '@/helpers/loader';
import { AppContext } from '@/contexts/app.context';
import { UserContext } from '@/contexts/user.context';
import { UserRole } from '@/interfaces/user.interface';
import Link from 'next/link';
import { navAdminRoutes } from '@/configs/nav.routes.config';

export const TopWrapper = ({ login, avatar, userId, icon, className, selfProfile = true, ...props }: TopWrapperProps): JSX.Element => {
	const [error, setError] = useState<string>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [editable, setEditable] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState<string>(login);
	const { addNotification } = useContext(AppContext);
	const user = useContext(UserContext);

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<{ login: string }>();

	const router = useRouter();

	const redirectToAdminPanel = (): string => {
		if (!user.isAuth) return navAdminRoutes.users;
		switch (user.role) {
			case UserRole.ADMIN: {
				return navAdminRoutes.users;
			}
			case UserRole.MODERATOR: {
				return navAdminRoutes.comments;
			}
			default: {
				return navAdminRoutes.users;
			}
		}
	};

	const onLoadFile = (e: ChangeEvent<HTMLInputElement>) => {
		setError(undefined);
		if (!e.target.files) {
			return setError('Файл не найден');
		}
		const form = new FormData();
		const file = e.target.files[0];
		form.append('uploadFile', file);
		if (!file) {
			return setError('Файл не выбран');
		}
		if (file.size && file.size < 1_572_864) {
			setIsLoading(true);
			fetch(API.users.uploadAvatar, {
				credentials: 'include',
				method: 'post',
				body: form
			})
				.then((response) => response.json())
				.then((dataOrError) => {
					setIsLoading(false);
					if (isHttpError(dataOrError)) {
						return setError(dataOrError.data.error);
					}
					router.reload();
				});
		} else {
			setError('Файл не должен превышать размер 1.5Мб');
		}
	};

	const copyLink = () => {
		navigator.clipboard.writeText(process.env.NEXT_PUBLIC_DOMAIN + `/user/${userId}`);
		addNotification({
			title: 'Скопировано',
			description: 'Ссылка на ваш профиль скопирован в буфер обмена',
			key: `copy${Date.now() / 1000}`
		});
	};

	const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const onCloseEdit = () => {
		setEditable(false);
		setError(undefined);
		setInputValue(login);
	};

	const onHandleLogin = (data: { login: string }) => {
		fetch(API.users.changeLogin, {
			credentials: 'include',
			method: 'put',
			body: JSON.stringify(data),
			headers: { 'Content-Type': 'application/json' }
		})
			.then((res) => res.json())
			.then((dataOrError) => {
				if (isHttpError(dataOrError)) {
					return setError(dataOrError.data.error);
				}
				router?.reload();
			});
	};

	return (
		<Wrapper className={cn(className, styles.wrapper)} {...props}>
			<div className={styles.mainWrapper}>
				<div className={styles.inputs}>
					<div className={styles.inputContainer}>
						<IsTruthy condition={selfProfile}>
							<input onChange={onLoadFile} className={styles.uploadFile} type="file" name="uploadFile" id="image" />
						</IsTruthy>
						<label
							title={selfProfile ? 'Сменить аватарку' : undefined}
							className={cn(styles.label, { [styles.selfProfile]: !selfProfile })}
							htmlFor="image">
							{avatar ? (
								<Image
									unoptimized
									loader={myLoader}
									alt={login}
									src={process.env.NEXT_PUBLIC_DOMAIN + avatar}
									priority={true}
									fill={true}></Image>
							) : (
								<AvatarEmpty className={styles.avatarEmpty} />
							)}
						</label>
						{isLoading && <Loader className={styles.loader} />}
					</div>
					<div className={styles.editLoginWrapper}>
						<div className={styles.editLogin}>
							{editable ? (
								<div className={styles.inputWrapper}>
									<Input
										{...register('login', validateConfig.login)}
										autoFocus
										onChange={onChangeInput}
										value={inputValue}
										className={styles.inputEdit}
										id="login"
										placeholder="Garner01"
									/>
								</div>
							) : (
								<div className={styles.loginWrapper}>
									<Htag tag="h1" appearanceTag="h2">
										{login}
									</Htag>
									{icon && parse(icon)}
								</div>
							)}

							<IsTruthy condition={selfProfile}>
								{!editable ? (
									<button onClick={() => setEditable(true)}>
										<Edit />
									</button>
								) : (
									<div className={styles.controls}>
										<Button onClick={handleSubmit(onHandleLogin)}>Сохранить</Button>
										<Button onClick={onCloseEdit}>Отмена</Button>
									</div>
								)}
							</IsTruthy>
						</div>
						{editable && (
							<P className={styles.info} size="s" color="gray">
								Менять логин разрешено раз в 14 дней!
							</P>
						)}
					</div>
				</div>
				{((editable && errors.login) || error) && <Error className={styles.error}>{error || errors.login?.message}</Error>}
			</div>
			<div className={styles.icons}>
				<IsTruthy condition={selfProfile && user.isAuth && user.role !== UserRole.USER}>
					<Link href={redirectToAdminPanel()} title={'Панель администратора'} className={styles.admin}>
						<AdminIcon />
					</Link>
				</IsTruthy>
				<IsTruthy condition={selfProfile}>
					<button onClick={copyLink} title={'Скопировать ссылку на профиль'} className={styles.copy}>
						<Copy />
					</button>
				</IsTruthy>
			</div>
		</Wrapper>
	);
};
