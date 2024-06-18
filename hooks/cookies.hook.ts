import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

interface IUseCookies {
	logout: () => void;
	iHaveCookie: () => boolean;
}

export const useCookies = (): IUseCookies => {
	const router = useRouter();
	const logout = () => {
		Cookies.remove('accessToken');
		Cookies.remove('refreshToken');
		router.reload();
	};

	const iHaveCookie = (): boolean => {
		return Cookies.get('accessToken') ? true : false;
	};

	return { logout, iHaveCookie };
};
