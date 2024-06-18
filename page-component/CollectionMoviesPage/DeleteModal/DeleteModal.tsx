import { ConfirmModal } from '@/components';
import { AppContext } from '@/contexts/app.context';
import { API } from '@/helpers/api';
import { Collection } from '@/interfaces/collection.interface';
import { IErrorResponse } from '@/interfaces/error.interface';
import { StateModalProps } from '@/interfaces/stateModal.props';
import { isHttpError } from '@/typeguards/error.typeguard';
import { useContext } from 'react';

export const DeleteModal = ({
	closeModal,
	router,
	stateModal,
	name,
	idCollection
}: StateModalProps & { idCollection: number; name: string }) => {
	const { addNotification } = useContext(AppContext);

	const sendRequest = async () => {
		const response = await fetch(API.collections.delete + idCollection, { credentials: 'include', method: 'delete' });
		const result: IErrorResponse | Collection = await response.json();
		if (isHttpError(result)) {
			return addNotification({ key: 'error', title: result.message, description: result.data.error });
		}
		if (!response.ok) {
			return addNotification({ key: 'error', title: 'Ошибка. Повторите позже' });
		}
		router?.push('/collections');
	};

	return <ConfirmModal title={`Удалить ${name}`} onConfirm={sendRequest} stateModal={stateModal} closeModal={closeModal} />;
};
