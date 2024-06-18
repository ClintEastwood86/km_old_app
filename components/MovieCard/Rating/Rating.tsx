import { RatingProps } from './Rating.props';
import styles from './Rating.module.css';
import { Htag, P } from '@/components';
import cn from 'classnames';

export const Rating = ({ kp, imdb, className, ...props }: RatingProps): JSX.Element => {
	if (!kp && !imdb) {
		return (
			<Htag color="gray" tag="h3">
				Рейтинг отсутствует
			</Htag>
		);
	}

	const ratingTuple: [string, number?][] = [
		['КиноПоиск', kp],
		['IMDB', imdb]
	];

	return (
		<div className={cn(styles.ratings, className)} {...props}>
			{ratingTuple.map(
				([name, rating]) =>
					rating && (
						<div key={name} className={styles.rating}>
							<P color="white">{name}</P>
							<Htag className={styles.ratingValue} tag="h3">
								{rating}
								<p className={styles.ratingTextSmall}> из 10</p>
							</Htag>
						</div>
					)
			)}
		</div>
	);
};
