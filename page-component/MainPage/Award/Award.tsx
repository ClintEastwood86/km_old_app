import { AwardProps } from './Award.props';
import styles from './Award.module.css';
import parser from 'html-react-parser';
import { Button, Htag } from '@/components';
import { profileRoutes } from '@/configs/profile.routes.config';
import cn from 'classnames';

export const Award = ({ icon, className, ...props }: AwardProps) => {
	return (
		<div {...props} className={cn(className, styles.award)}>
			<div className={styles.icon}>
				{icon ? (
					parser(icon)
				) : (
					<svg
						style={{ stroke: 'var(--secondary)', fill: 'none' }}
						xmlns="http://www.w3.org/2000/svg"
						width="800px"
						height="800px"
						viewBox="0 0 24 24"
						fill="none">
						<path
							d="M12 17V16.9929M12 14.8571C12 11.6429 15 12.3571 15 9.85714C15 8.27919 13.6568 7 12 7C10.6567 7 9.51961 7.84083 9.13733 9M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				)}
			</div>
			<Htag className={styles.title} tag="h2">
				Значок
			</Htag>
			<div className={styles.wrapper}>
				<Button stretch href="/blog/awards">
					Таблица значков
				</Button>
				<Button stretch href={profileRoutes.stats}>
					Выбрать значок
				</Button>
			</div>
		</div>
	);
};
