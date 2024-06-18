import { useState } from 'react';
import { Modal } from '../Modal/Modal';
import styles from './RestrictionModal.module.css';
import { Button, Htag, P, Separator } from '..';
import { useRouter } from 'next/router';

export const RestrictionModal = (): JSX.Element => {
	const [state, setState] = useState<boolean>(true);
	const { back } = useRouter();

	const closeModal = () => {
		setState(false);
		back();
	};

	return (
		<Modal title="Взрослых контент" stateModal={state} closeModal={closeModal} className={styles.modal}>
			<P className={styles.content}>Страница содержит контент для взрослых</P>
			<Htag className={styles.content} tag="h2">
				Вам исполнилось 18 лет?
			</Htag>
			<P size="s" className={styles.content}>
				Перейдя на страницу вы подтверждаете, что вам исполнилось 18 лет
			</P>
			<Separator />
			<div className={styles.wrapper}>
				<Button onClick={() => setState(false)}>Да</Button>
				<Button onClick={() => back()}>Нет</Button>
			</div>
		</Modal>
	);
};
