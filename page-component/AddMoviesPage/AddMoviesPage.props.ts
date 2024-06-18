import { Collection } from '@/interfaces/collection.interface';

export interface AddMoviesPageProps {
	id: number;
	info: Collection;
	checkedMovies: number[];
	closePage: () => unknown;
}
