import { SettingItem } from '@/components';
import { API } from '@/helpers/api';
import { isHttpError } from '@/typeguards/error.typeguard';
import { useContext, useState } from 'react';
import { ChangeEmailModal } from './ChangeEmailModal/ChangeEmailModal';
import { ChangePasswordModal } from './ChangePasswordModal/ChangePasswordModal';
import { DeleteAccountModal } from './DeleteAccountModal/DeleteAccountModal';
import styles from './Profile.module.css';
import { ProfileProps } from './Profile.props';
import { AppContext } from '@/contexts/app.context';

export const Profile = ({ email, notification, login }: ProfileProps) => {
	const [passwordModal, setPasswordModal] = useState<boolean>(false);
	const [emailModal, setEmailModal] = useState<boolean>(false);
	const [deleteModal, setDeleteModal] = useState<boolean>(false);

	const [notificationValue, setNotificationValue] = useState<boolean>(notification);
	const { addNotification } = useContext(AppContext);

	const toggleNotification = () => {
		fetch(API.users.changeNotification, { method: 'put', credentials: 'include' })
			.then((res) => res.json())
			.then((resOrError) => {
				if (isHttpError(resOrError)) {
					return console.error(resOrError.data.error);
				}
				setNotificationValue((value) => !value);
				addNotification({
					title: `Рассылка ${notificationValue ? 'отключена' : 'включена'}`,
					key: `changeNotify${Date.now()}`
				});
			});
	};

	const loadModals = () => {
		return (
			<>
				<ChangePasswordModal state={passwordModal} setState={setPasswordModal} />
				<ChangeEmailModal state={emailModal} setState={setEmailModal} />
				<DeleteAccountModal state={deleteModal} setState={setDeleteModal} />
			</>
		);
	};

	return (
		<div className={styles.profileWrapper}>
			<SettingItem onClick={() => setPasswordModal(true)} title="Пароль" value="********" button="Сменить пароль" />
			<SettingItem
				onClick={toggleNotification}
				title="Рассылка"
				value={notificationValue ? 'вкл' : 'выкл'}
				button={`${notificationValue ? 'Отключить' : 'Включить'} рассылку`}
			/>
			<SettingItem onClick={() => setEmailModal(true)} title="E-mail" value={email} button="Сменить почту" />
			<SettingItem onClick={() => setDeleteModal(true)} title="Аккаунт" value={login} button="Удалить аккаунт" />
			{loadModals()}
		</div>
	);
};
