import { ActorProps } from './Actor.props';
import styles from './Actor.module.css';
import { Htag, P, Button } from '../index';
import cn from 'classnames';
import { useProfession } from '@/hooks/profession.hook';

export const Actor = ({ actor, className, ...props }: ActorProps): JSX.Element => {
	const profession = useProfession(actor.profession);

	return (
		<div>
			<div {...props} className={cn(className, styles.actor)}>
				<Htag className={styles.title} tag="h3">
					{actor.name}
				</Htag>
				<P className={styles.role}>{profession}</P>
				<Button tabIndex={-1} className={styles.button} href={`https://www.kinopoisk.ru/name/${actor.kinopoiskId}`} stretch arrow>
					Фильмы
				</Button>
			</div>
		</div>
	);
};
