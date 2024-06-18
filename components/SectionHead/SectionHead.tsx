import { Htag, P } from '@/components';
import { SectionHeadProps } from './SectionHead.props';
import styles from './SectionHead.module.css';

export const SectionHead = ({ appearanceTag, tag = 'h2', title, description }: SectionHeadProps) => {
	return (
		<>
			<Htag appearanceTag={appearanceTag} className={styles.htag} tag={tag}>
				{title}
			</Htag>
			{description ? <P>{description}</P> : <span className={styles.separator} />}
		</>
	);
};
