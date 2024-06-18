import { SectionHead } from '@/components/SectionHead/SectionHead';
import { CollectionShort } from '@/interfaces/collection.interface';
import { useEffect, useState } from 'react';
import { CollectionRow } from '../../components/CollectionRow/CollectionRow';
import { API } from '@/helpers/api';
import { IErrorResponse } from '@/interfaces/error.interface';
import { isHttpError } from '@/typeguards/error.typeguard';
import { Button, ButtonGhost, IsTruthy } from '@/components';
import { DataCollectionModal } from './DataCollectionModal/DataCollectionModal';
import styles from './CollectionsPage.module.css';
import cn from 'classnames';

export const CollectionsOwn = ({ take, isUpdated }: { take: number; isUpdated: boolean }) => {
	const [collections, setCollections] = useState<CollectionShort[]>([]);
	const [stateModal, setStateModal] = useState<boolean>(false);
	const [page, setPage] = useState<number>(1);
	const [isLastPage, setIsLastPage] = useState<boolean>(false);
	const [isSendRequest, setIsSendRequest] = useState<boolean>(false);

	const getCollections = async (take: number, skip: number) => {
		setIsSendRequest(true);
		const response = await fetch(`${API.collections.get}?take=${take}&skip=${skip}`, { credentials: 'include', method: 'get' });
		const collections: CollectionShort[] | IErrorResponse = await response.json();
		if (isHttpError(collections)) {
			setIsLastPage(true);
			return console.error(collections);
		}
		if (collections.length % take !== 0 || !collections.length) {
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

	return (
		<section>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
				<div>
					<SectionHead title="Мои подборки" />
				</div>
				<ButtonGhost onClick={() => setStateModal(true)} children="Создать подборку" />
			</div>
			<CollectionRow
				wrapperClassName={cn({ [styles.row]: !collections.length })}
				onClick={() => setStateModal(true)}
				className={styles.card}
				collections={collections}
			/>
			<IsTruthy condition={!isLastPage}>
				<Button onClick={onButtonClick} style={{ margin: '25px auto 0' }} children="Загрузить еще" />
			</IsTruthy>
			<DataCollectionModal route="create" stateModal={stateModal} closeModal={() => setStateModal(false)} />
		</section>
	);
};
