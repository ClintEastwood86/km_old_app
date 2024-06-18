import { RegisterOptions } from 'react-hook-form';
import { BlockModalDto } from './BlockModal.dto';

interface BlockModalValidateConfigType {
	message: (isBlocked: boolean) => RegisterOptions<BlockModalDto, 'message'>;
}

export const BlockModalValidateConfig: BlockModalValidateConfigType = {
	message: (isBlocked: boolean) => {
		return {
			minLength: { value: 15, message: 'Напишите сообщение на 15 символов' },
			maxLength: { value: 500, message: 'Максимальная длина – 500' },
			required: { value: !isBlocked, message: 'Укажите сообщение' }
		};
	}
};
