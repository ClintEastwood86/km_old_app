import { ModalProps } from './Modal.props';
import styles from './Modal.module.css';
import cn from 'classnames';
import { Htag, IsTruthy, Loader } from '..';
import { useEffect } from 'react';
import Cross from '@/public/cross.svg';

export const Modal = ({ stateLoad, title, className, closeModal, stateModal, children, ...props }: ModalProps): JSX.Element => {
	const closeModalByKeydown = (e: KeyboardEvent) => {
		e.key == 'Escape' && closeModal();
	};

	useEffect(() => {
		document.body.classList[!stateModal ? 'remove' : 'add']('block-scroll');
	}, [stateModal]);

	useEffect(() => {
		document.addEventListener('keydown', closeModalByKeydown);
		return () => {
			document.removeEventListener('keydown', closeModalByKeydown);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<IsTruthy condition={stateModal}>
			<div onClick={(e) => e.target == e.currentTarget && closeModal()} className={cn(styles.overlay, { [styles.open]: stateModal })}>
				<div {...props} className={cn(className, styles.modal)}>
					<div className={styles.header}>
						<Htag tag="h2">{title}</Htag>
						<button type="button" onClick={closeModal}>
							<Cross />
						</button>
					</div>
					<div className={styles.body}>{children}</div>
					{stateLoad && <Loader />}
				</div>
			</div>
		</IsTruthy>
	);
};
