import { StateModalProps } from '@/interfaces/stateModal.props';

export interface ConfirmModalProps extends StateModalProps {
	className?: string;
	onConfirm: () => unknown;
	title: string;
}
