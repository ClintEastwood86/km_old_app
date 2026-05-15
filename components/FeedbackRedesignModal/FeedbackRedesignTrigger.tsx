import { UserContext } from '@/contexts/user.context';
import { useContext, useState, useEffect } from 'react';
import { FeedbackRedesignModal } from './FeedbackRedesignModal';
import styles from './FeedbackRedesignModal.module.css';
import { FEEDBACK_REDESIGN_DISMISSED_STORAGE_KEY, setDismissed } from './set-dismissed';

export const FeedbackRedesignTrigger = (): JSX.Element | null => {
	const user = useContext(UserContext);
	const [mounted, setMounted] = useState<boolean>(false);
	const [isHidden, setIsHidden] = useState<boolean>(true);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const dismissForever = () => {
		setDismissed();
		setIsHidden(true);
		setIsOpen(false);
	};

	useEffect(() => {
		setMounted(true);
		try {
			setIsHidden(localStorage.getItem(FEEDBACK_REDESIGN_DISMISSED_STORAGE_KEY) === '1');
		} catch {
			setIsHidden(false);
		}
	}, []);

	if (!mounted || isHidden) {
		return null;
	}

	return (
		<>
			<button type="button" className={styles.fab} onClick={() => setIsOpen(true)} aria-label="Открыть опрос о редизайне">
				<span aria-hidden>📝</span>
				<span>Опрос</span>
			</button>
			<FeedbackRedesignModal
				stateModal={isOpen}
				closeModal={dismissForever}
				username={user.isAuth ? user.login : undefined}
				onSubmitted={() => {
					setIsHidden(true);
					setIsOpen(false);
				}}
			/>
		</>
	);
};
