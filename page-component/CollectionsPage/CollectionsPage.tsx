import { SectionHead } from '@/components/SectionHead/SectionHead';
import styles from './CollectionsPage.module.css';
import { CollectionsNew } from './CollectionsNew';
import { CollectionsPopular } from './CollectionsPopular';
import { CollectionsOwn } from './CollectionsOwn';
import { CollectionsSubscs } from './CollectionsSubscs';
import { UserContext } from '@/contexts/user.context';
import { useContext } from 'react';
import { IsTruthy } from '@/components';
import { CollectionsSearch } from './CollectionsSearch/CollectionsSearch';
import { useViewportElements } from '@/hooks/viewportElements.hook';
import { displayedCollectionsConfig } from '@/configs/row.config';
import { COLLECTIONS_PER_REQUEST } from './CollectionsPage.constants';

export const CollectionsPage = () => {
	const { isAuth } = useContext(UserContext);
	const { elements: collectionsPerPage, updated } = useViewportElements(displayedCollectionsConfig, COLLECTIONS_PER_REQUEST);

	return (
		<>
			<SectionHead tag="h1" appearanceTag="h2" title="Подборки" description="Подборки созданные пользователями" />
			<div className={styles.wrapper}>
				<IsTruthy condition={isAuth}>
					<CollectionsOwn isUpdated={updated} take={collectionsPerPage} />
				</IsTruthy>
				<IsTruthy condition={isAuth}>
					<CollectionsSubscs isUpdated={updated} take={collectionsPerPage} />
				</IsTruthy>
				<CollectionsNew isUpdated={updated} take={collectionsPerPage} />
				<CollectionsPopular isUpdated={updated} take={collectionsPerPage} />
				<CollectionsSearch />
			</div>
		</>
	);
};
