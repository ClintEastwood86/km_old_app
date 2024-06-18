import { HtagProps } from './Htag.props';
import styles from './Htag.module.css';
import cn from 'classnames';

export const Htag = ({ appearanceTag, tag, className, children, color = 'white', ...props }: HtagProps): JSX.Element => {
	switch (tag) {
		case 'h1':
			return (
				<h1 {...props} className={cn(className, styles[appearanceTag ?? 'h1'], styles[color])}>
					{children}
				</h1>
			);
		case 'h2':
			return (
				<h2 {...props} className={cn(className, styles[appearanceTag ?? 'h2'], styles[color])}>
					{children}
				</h2>
			);
		case 'h3':
			return (
				<h3 {...props} className={cn(className, styles[appearanceTag ?? 'h3'], styles[color])}>
					{children}
				</h3>
			);
		default:
			throw new Error('Этот Htag недоступен');
	}
};
