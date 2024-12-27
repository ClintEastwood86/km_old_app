import { RatingProps } from './Rating.props';
import styles from './Rating.module.css';
import { Htag, P } from '@/components';
import cn from 'classnames';

export const Rating = ({ kp, kpCount, imdb, imdbCount, className, ...props }: RatingProps): JSX.Element => {
	if (!kp && !imdb) {
		return (
			<Htag color="gray" tag="h3">
				Рейтинг отсутствует
			</Htag>
		);
	}

	const ratingTuple: [string, number?, number?][] = [
		['КиноПоиск', kp, kpCount],
		['IMDB', imdb, imdbCount]
	];

	return (
		<div className={cn(styles.ratings, className)} {...props}>
			{ratingTuple.map(
				([name, rating, count]) =>
					rating && (
						<div key={name} className={styles.rating}>
							<P color="white">{name}</P>
							<Htag className={styles.ratingValue} tag="h3">
								{rating}
								<p className={styles.ratingTextSmall}> из 10 {count && '(' + Intl.NumberFormat('ru-RU').format(count) + ')'}</p>
							</Htag>
						</div>
					)
			)}
		</div>
	);
};
