import { RegisterOptions } from 'react-hook-form';
import { AddPointsModalDto } from './AddPointsModal.dto';

interface AddPointsModalValidateConfigType {
	message: RegisterOptions<AddPointsModalDto, 'message'>;
	points: RegisterOptions<AddPointsModalDto, 'points'>;
}

export const AddPointsModalValidateConfig: AddPointsModalValidateConfigType = {
	message: {
		minLength: { value: 1, message: 'Напишите пояснение' },
		maxLength: { value: 25, message: 'Максимальная длина – 25' },
		required: { value: true, message: 'Укажите сообщение' }
	},
	points: {
		min: { value: 1, message: 'Минимальное значение – 1' },
		max: { value: 1000, message: 'Максимальное значение – 1000' },
		required: { value: true, message: 'Укажите кол-во очков' },
		valueAsNumber: true
	}
};
