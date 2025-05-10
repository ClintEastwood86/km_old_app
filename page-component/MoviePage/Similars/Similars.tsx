import { Htag, MoviesRow } from '@/components';
import { MoviePageContext } from '@/contexts/moviePage.context';
import { useContext } from 'react';
import { SimilarsProps } from './Similars.props';

export const Similars = ({ className, ...props }: SimilarsProps) => {
	const { movie } = useContext(MoviePageContext);

	if (!movie || !movie.similarMovies.length) {
		return <></>;
	}
	return (
		<section {...props} className={className}>
			<Htag tag="h2">Похожие</Htag>
			<MoviesRow movies={movie.similarMovies} />
		</section>
	);
};
