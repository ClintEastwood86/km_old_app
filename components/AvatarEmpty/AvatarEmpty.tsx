import styles from './AvatarEmpty.module.css';
import Avatar from './avatar.svg';
import cn from 'classnames';

export const AvatarEmpty = ({ className }: { className?: string }): JSX.Element => {
	return (
		<span className={cn(styles.avatar, className)}>
			<Avatar />
		</span>
	);
};
