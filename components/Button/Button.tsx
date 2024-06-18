import { ButtonProps } from './Button.props';
import cn from 'classnames';
import styles from './Button.module.css';
import { ReactNode } from 'react';
import Arrow from './arrow.svg';

export const Button = ({ href = undefined, stretch = false, arrow = false, className, children, ...props }: ButtonProps): JSX.Element => {
	// Фунцкия которая составляет DOM элемент button, в зависимости есть стрелка или нет
	const constructChildren = (children: ReactNode, arrow: boolean) => {
		return (
			<button
				{...props}
				className={cn(styles.button, {
					[className as string]: !href,
					[styles.stretch]: stretch
				})}>
				{children}
				{arrow && <Arrow />}
			</button>
		);
	};

	return (
		// Если есть ссылка, тогда оборачиваем кнопку в тег <a></a>, потому что внутри ссылка не будет доступна из-за padding. Навешиваем на нее класс stretch, чтобы кнопка могла растягиваться на всю доступную ширину
		href ? (
			<a
				target={arrow && href ? '_blank' : '_self'}
				tabIndex={-1}
				className={cn(className, { [styles.stretch]: stretch })}
				style={{ outline: 'none', display: 'inline-block' /* Чтобы не расстягивалась сразу на всю ширину */ }}
				href={href}>
				{constructChildren(children, arrow)}
			</a>
		) : (
			<>{constructChildren(children, arrow)}</>
		)
	);
};
