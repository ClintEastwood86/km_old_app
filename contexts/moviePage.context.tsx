import { CollectionShort } from '@/interfaces/collection.interface';
import { Comment } from '@/interfaces/comment.interface';
import { Country, Genre, Movie } from '@/interfaces/movie.interface';
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useState } from 'react';

export interface IMoviePageContext {
	movie?: Movie;
	comments: Comment[];
	genresList: Genre[];
	countriesList: Country[];
	collections: CollectionShort[];
	setComments: Dispatch<SetStateAction<Comment[]>>;
}

export const MoviePageContext = createContext<IMoviePageContext>({
	collections: [],
	genresList: [],
	countriesList: [],
	comments: [],
	setComments: () => []
});

export const MoviePageContextProvider = ({
	movie,
	collections,
	genresList,
	countriesList,
	children
}: PropsWithChildren<Required<Omit<IMoviePageContext, 'setComments' | 'comments'>>>) => {
	const [commentsState, setCommentsState] = useState<Comment[]>([]);
	return (
		<MoviePageContext.Provider
			value={{ genresList, countriesList, collections, movie, comments: commentsState, setComments: setCommentsState }}>
			{children}
		</MoviePageContext.Provider>
	);
};
