import { SettingItemProps } from './SettingItem.props';
import styles from './SettingItem.module.css';
import cn from 'classnames';
import QuestionIcon from '@/public/question.svg';
import { Htag, IsTruthy } from '..';
import Link from 'next/link';

export const SettingItem = ({ onClick, link, className, title, value, button, ...props }: SettingItemProps): JSX.Element => {
	return (
		<div {...props} className={cn(styles.setting, className)}>
			<Htag className={styles.htag} tag="h3" color="secondary">
				{title}: <span style={{ fontWeight: 300 }}>{value}</span>
				<IsTruthy condition={!!link}>
					<Link className={styles.link} href={link || '/'}>
						<QuestionIcon />
					</Link>
				</IsTruthy>
			</Htag>
			{button && (
				<button className={styles.button} onClick={onClick}>
					{button}
				</button>
			)}
		</div>
	);
};
