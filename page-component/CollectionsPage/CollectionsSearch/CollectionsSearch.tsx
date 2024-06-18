import { useEffect, useMemo, useState } from 'react';
import styles from './CollectionsSearch.module.css';
import { CollectionShort } from '@/interfaces/collection.interface';
import { useDebounce } from '@/hooks/debounde.hook';
import { API } from '@/helpers/api';
import { CollectionRow } from '@/components/CollectionRow/CollectionRow';
import { IErrorResponse } from '@/interfaces/error.interface';
import { isHttpError } from '@/typeguards/error.typeguard';
import { IsTruthy, P } from '@/components';
import cn from 'classnames';
import { COLLECTIONS_PER_REQUEST } from '../CollectionsPage.constants';

export const CollectionsSearch = () => {
	const [q, setQ] = useState<string>('');
	const [isTyped, setTyped] = useState<boolean>(false);
	const [collections, setCollections] = useState<CollectionShort[]>([]);

	const sendRequest = useDebounce(async () => {
		if (q == '') return;
		const body = {
			q,
			take: COLLECTIONS_PER_REQUEST
		};
		const response = await fetch(API.collections.find, {
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
			method: 'post'
		});
		const collections: CollectionShort[] | IErrorResponse = await response.json();
		if (isHttpError(collections)) {
			return console.error(collections.data.error);
		}
		setCollections(collections);
		setTyped(false);
	}, 1500);

	useEffect(() => {
		sendRequest();
		setTyped(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [q]);

	return (
		<section>
			<input placeholder="Pixar" value={q} onChange={(e) => setQ(e.target.value)} type="text" className={styles.search} />
			{useMemo(() => {
				return (
					<div style={{ position: 'relative' }}>
						<CollectionRow collections={isTyped && collections.length !== 0 ? [] : collections} />
						<IsTruthy condition={!isTyped && collections.length == 0 && q !== ''}>
							<P className={cn(styles.p, styles.notFoundMessage)} size="m">
								Ничего не найдено
							</P>
						</IsTruthy>
					</div>
				);
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, [collections, q])}
			<IsTruthy condition={collections.length !== 0}>
				<P title={`Нет подгрузки. Максимум ${COLLECTIONS_PER_REQUEST} подборок`} className={styles.p} size="m">
					Ограниченный поиск
				</P>
			</IsTruthy>
		</section>
	);
};
