import { SwitchProps } from './Switch.props';
import styles from './Switch.module.css';
import cn from 'classnames';
import * as S from '@radix-ui/react-switch';
import { IsTruthy } from '..';

export const Switch = ({ id, label, defaultChecked, setState, className, ...props }: SwitchProps): JSX.Element => {
	return (
		<div {...props} className={cn(className)}>
			<IsTruthy condition={!!label}>
				<label htmlFor={id}>{label}</label>
			</IsTruthy>
			<S.Root defaultChecked={defaultChecked} onCheckedChange={setState} id={id} className={styles.switch}>
				<S.Thumb className={styles.switchThumb} />
			</S.Root>
		</div>
	);
};
