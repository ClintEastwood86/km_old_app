import { DonateButtonProps } from './DonateButton.props';
import cn from 'classnames';
import { ButtonGhost } from '@/components';

export const DonateButton = ({ sum, billNumber, className, ...props }: DonateButtonProps) => {
	return (
		<form className={cn(className)} {...props} method="POST" target="_blank" action="https://yoomoney.ru/quickpay/confirm">
			<input type="hidden" name="billNumber" value={billNumber} />
			<input type="hidden" name="targets" value="На развитие проекта" />
			<input type="hidden" name="backgroundId" value="102" />
			<input type="hidden" name="buttonText" value="donate" />
			<input type="hidden" name="buttonSize" value="L" />
			<input type="hidden" name="receiver" value="4100118405855686" />
			<input type="hidden" name="sum" value={sum} />
			<input type="hidden" name="referer" value="" />
			<input type="hidden" name="quickpay-form" value="button" />
			<input type="hidden" name="is-inner-form" value="true" />
			<ButtonGhost>Задонатить {sum}₽</ButtonGhost>
		</form>
	);
};
