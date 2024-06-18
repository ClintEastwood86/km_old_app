import { API } from '@/helpers/api';

export interface DataCollectionModalProps {
	defaultColor?: string;
	defaultName?: string;
	defaultSwitch?: boolean;
	defaultDescriptionValue?: string;
	closeModal: () => unknown;
	stateModal: boolean;
	route: keyof Pick<(typeof API)['collections'], 'create' | 'change'>;
	id?: number;
}
