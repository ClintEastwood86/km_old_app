import { NotificationProps } from './Notification.props';
import styles from './Notification.module.css';
import cn from 'classnames';
import { Htag, P } from '..';
import { useEffect, useRef } from 'react';

export const Notification = ({ className, title, description }: NotificationProps): JSX.Element => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const timer = setTimeout(() => {
			ref.current?.classList.add(styles.exit);
		}, 5_500);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div ref={ref} className={cn(className, styles.notification)}>
			<Htag tag="h3" color="black">
				{title}
			</Htag>
			<P className={styles.description} size="s" color="black">
				{description}
			</P>
		</div>
	);
};
