import { SmartCaptcha } from '@yandex/smart-captcha';
import { CaptchaProps } from './Captcha.props';

export const Captcha = ({ onToken }: CaptchaProps): JSX.Element => {
	const token = process.env.NEXT_PUBLIC_CAPTCHA_KEY_CLIENT;
	return token ? <SmartCaptcha language="ru" onSuccess={onToken} sitekey={token} /> : <></>;
};
