import { RegisterOptions } from 'react-hook-form';
import { AddBonusModalDto } from './AddBonusModal.dto';

interface AddBonusModalValidateConfigType {
	multiplier: RegisterOptions<AddBonusModalDto, 'multiplier'>;
	expiries: RegisterOptions<AddBonusModalDto, 'expiries'>;
}

export const AddBonusModalValidateConfig: AddBonusModalValidateConfigType = {
	multiplier: {
		min: { value: 2, message: 'Минимальное значение – 2' },
		required: { value: true, message: 'Укажите множитель' },
		valueAsNumber: true
	},
	expiries: {
		valueAsDate: true
	}
};
