import { StateModalProps } from '@/interfaces/stateModal.props';

export interface FeedbackRedesignModalProps extends Omit<StateModalProps, 'router'> {
	className?: string;
	username?: string;
	onSubmitted: () => void;
}
