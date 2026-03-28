import { CollectionModern, IsTruthy } from '@/components';
import styles from './CollectionRow.module.css';
import { CollectionRowProps } from './CollectionRow.props';
import { useMemo } from 'react';
import { displayedCollectionsConfig } from '@/configs/row.config';
import { useViewportElements } from '@/hooks/viewportElements.hook';
import cn from 'classnames';

export const CollectionRow = ({ collections, wrapperClassName, ...props }: CollectionRowProps) => {
	const { elements: collectionsInRow } = useViewportElements(displayedCollectionsConfig, 4);

	return (
		<div className={cn(styles.row, wrapperClassName)}>
			{useMemo(
				() => collections.map((collection, index) => <CollectionModern key={collection.id + index * Math.random()} info={collection} />),
				[collections]
			)}
			<IsTruthy condition={collections.length == 0}>
				{new Array(collectionsInRow).fill(<></>).map((_, i) => (
					<CollectionModern {...props} key={Math.random() * i} />
				))}
			</IsTruthy>
		</div>
	);
};
