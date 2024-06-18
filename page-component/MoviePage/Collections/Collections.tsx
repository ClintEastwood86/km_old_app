import { Htag } from '@/components';
import { CollectionRow } from '@/components/CollectionRow/CollectionRow';
import { MoviePageContext } from '@/contexts/moviePage.context';
import { useContext } from 'react';
import { CollectionsProps } from './Collections.props';

export const Collections = ({ className, ...props }: CollectionsProps) => {
	const { collections } = useContext(MoviePageContext);

	if (!collections.length) {
		return <></>;
	}
	return (
		<section {...props} className={className}>
			<Htag tag="h2">В популярных подборках</Htag>
			<CollectionRow collections={collections} />
		</section>
	);
};
