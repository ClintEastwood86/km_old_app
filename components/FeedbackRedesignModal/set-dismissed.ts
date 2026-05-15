export const FEEDBACK_REDESIGN_DISMISSED_STORAGE_KEY = 'feedback-redesign-2026-dismissed';

export const setDismissed = () => {
	try {
		localStorage.setItem(FEEDBACK_REDESIGN_DISMISSED_STORAGE_KEY, '1');
	} catch {
		null;
	}
};
