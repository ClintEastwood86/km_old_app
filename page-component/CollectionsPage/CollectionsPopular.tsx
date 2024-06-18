import { SectionHead } from '@/components/SectionHead/SectionHead';
import { CollectionRow } from '../../components/CollectionRow/CollectionRow';
import { useEffect, useState } from 'react';
import { CollectionShort } from '@/interfaces/collection.interface';
import { API } from '@/helpers/api';
import { Button, IsTruthy } from '@/components';

export const CollectionsPopular = ({ take, isUpdated }: { take: number; isUpdated: boolean }) => {
	const [collections, setCollections] = useState<CollectionShort[]>([]);
	const [page, setPage] = useState<number>(1);
	const [isLastPage, setIsLastPage] = useState<boolean>(false);
	const [isSendRequest, setIsSendRequest] = useState<boolean>(false);

	const getCollections = async (take: number, skip: number) => {
		setIsSendRequest(true);
		const response = await fetch(`${API.collections.getPopular}?take=${take}&skip=${skip}`, { credentials: 'include', method: 'get' });
		const collections: CollectionShort[] = await response.json();
		if (!collections.length || collections.length % take !== 0) {
			setIsLastPage(true);
		}
		setCollections((c) => c.concat(collections));
		setIsSendRequest(false);
	};

	const onButtonClick = () => {
		if (isLastPage || isSendRequest || !isUpdated) return;
		setPage((p) => p + 1);
	};

	useEffect(() => {
		if (!isUpdated) return;
		getCollections(take, take * (page - 1));
	}, [page, take, isUpdated]);

	if (!collections.length) {
		return <></>;
	}
	return (
		<section>
			<SectionHead title="Популярные" />
			<CollectionRow collections={collections} />
			<IsTruthy condition={!isLastPage}>
				<Button onClick={onButtonClick} style={{ margin: '25px auto 0' }} children="Загрузить еще" />
			</IsTruthy>
		</section>
	);
};
