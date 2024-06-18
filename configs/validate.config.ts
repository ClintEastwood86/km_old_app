import { regExp } from '@/helpers/regexp';
import { ILoginModal } from '@/layout/LoginModal/LoginModal.interface';
import { IRegisterModal } from '@/layout/RegisterModal/RegisterModal.interface';
import { IChangeEmailForm } from '@/page-component/ProfilePage/Profile/ChangeEmailModal/ChangeEmailModal';
import { IChangePasswordForm } from '@/page-component/ProfilePage/Profile/ChangePasswordModal/ChangePasswordModal';
import { RegisterOptions } from 'react-hook-form';

interface ValidateConfigType {
	login: RegisterOptions<IRegisterModal | { login: string }, 'login'>;
	email: RegisterOptions<IRegisterModal | ILoginModal | IChangeEmailForm, 'email'>;
	password: RegisterOptions<IRegisterModal | ILoginModal | IChangePasswordForm, 'password'>;
	policyAccept: RegisterOptions<IRegisterModal, 'policyAccept'>;
}

export const validateConfig: ValidateConfigType = {
	email: {
		required: { value: true, message: 'Укажите почту' },
		pattern: { value: regExp.email, message: 'Разрешено использовать домены gmail.com, mail.ru, yandex.ru, vk.com' }
	},
	login: {
		required: { value: true, message: 'Укажите логин' },
		maxLength: { value: 14, message: 'Максимальная длина логина – 14 символов' },
		minLength: { value: 4, message: 'Минимальная длина логина – 4 символа' },
		pattern: { value: regExp.login, message: 'Разрешено использовать только латинские буквы и цифры' }
	},
	password: {
		required: { value: true, message: 'Укажите пароль' },
		maxLength: { value: 21, message: 'Максимальная длина пароля – 21 символ' },
		minLength: { value: 8, message: 'Минимальная длина пароля – 8 символов' },
		pattern: { value: regExp.password, message: 'Пароль должен содержать только цифры, буквы и специальные символы' }
	},
	policyAccept: {
		required: { value: true, message: 'Условия не приняты' }
	}
};
