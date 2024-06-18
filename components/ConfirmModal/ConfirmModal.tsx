import { ConfirmModalProps } from './ConfirmModal.props';
import { Button, Modal, Switch, Error } from '..';
import { FormEvent, useState } from 'react';

export const ConfirmModal = ({ closeModal, stateModal, onConfirm, title, className }: ConfirmModalProps): JSX.Element => {
	const [isConfirm, setIsConfirm] = useState<boolean>(false);
	const [error, setError] = useState<string>();

	const onSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (!isConfirm) {
			return setError('Подтвердите условия');
		}
		onConfirm();
		setError(undefined);
		setIsConfirm(false);
	};

	return (
		<Modal className={className} title={title} closeModal={closeModal} stateModal={stateModal}>
			<form onSubmit={onSubmit}>
				<Switch setState={setIsConfirm} label="Подтвердить" id="confirm" />
				<Button autoFocus children={title} />
				{error && <Error>{error}</Error>}
			</form>
		</Modal>
	);
};
