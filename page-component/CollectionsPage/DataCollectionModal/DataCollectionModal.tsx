import { Button, Input, Modal, ColorPicker, Error, Switch } from '@/components';
import { IColorPickerItem } from '@/components/ColorPicker/ColorPicker.interface';
import { colorConfig } from '@/configs/colors.config';
import { API } from '@/helpers/api';
import styles from './DataCollectionModal.module.css';
import { Collection } from '@/interfaces/collection.interface';
import { IErrorResponse } from '@/interfaces/error.interface';
import { isHttpError } from '@/typeguards/error.typeguard';
import { useRouter } from 'next/router';
import { FormEvent, useCallback, useRef, useState } from 'react';
import { DataCollectionModalProps } from './DataCollectionModal.props';

export const DataCollectionModal = ({
	stateModal,
	closeModal,
	id,
	route,
	defaultColor = colorConfig[0].hex,
	defaultName = '',
	defaultDescriptionValue = '',
	defaultSwitch = false
}: DataCollectionModalProps) => {
	const label = route == 'create' ? 'Создать подборку' : 'Изменить подборку';
	const [error, setError] = useState<string>();
	const [color, setColor] = useState<string>(defaultColor);
	const inputName = useRef<HTMLInputElement>(null);
	const description = useRef<HTMLTextAreaElement>(null);
	const [isPrivate, setIsPrivate] = useState<boolean>(defaultSwitch);
	const [inputNameError, setInputNameError] = useState<string>();
	const { reload } = useRouter();

	const onPickColor = (item: IColorPickerItem) => {
		setColor(item.hex);
	};

	const clearText = (text: string, usedLineBreak = false): string => {
		const clearSpaces = text
			.replaceAll(/\u3164/g, '')
			.split(' ')
			.filter((i) => i !== '')
			.join(' ');
		if (!usedLineBreak) {
			return clearSpaces;
		}
		return clearSpaces
			.split('\n')
			.filter((i) => i !== '')
			.join('\n');
	};

	const sendRequest = useCallback(async () => {
		const body = {
			color,
			name: inputName.current?.value,
			private: isPrivate,
			description: description.current?.value
		};
		const response = await fetch(API.collections[route] + `${route == 'change' ? id : ''}`, {
			method: route == 'create' ? 'post' : 'put',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});
		const result: IErrorResponse | Collection = await response.json();
		if (isHttpError(result)) {
			return setError(result.data.error);
		}
		if (!response.ok) {
			setError('Повторите позже');
		}
		return reload();
	}, [color, id, isPrivate, reload, route]);

	const onSubmit = useCallback(
		(e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (!inputName.current || !description.current) {
				return;
			}
			inputName.current.value = clearText(inputName.current.value);
			description.current.value = clearText(description.current.value, true);

			setInputNameError(undefined);
			if (inputName.current.value.length < 5) {
				return setInputNameError('Минимальная длина – 5');
			}
			if (inputName.current.value.length > 44) {
				return setInputNameError('Максимальная длина – 44');
			}
			if (!/^[a-zA-Zа-яА-ЯёЁ0-9:;!*+-=,.#?()\s]+$/.test(inputName.current.value)) {
				return setInputNameError('Разрешено использовать латиницу и кириллицу и некоторые спец. символы');
			}

			if (description.current.value.length < 15) {
				return setError('Минимальная длина описания – 15');
			}
			if (description.current.value.length > 1500) {
				return setError('Максимальная длина описания – 1500');
			}
			sendRequest();
		},
		[sendRequest]
	);

	const setDefaultColor = () => {
		const index = colorConfig.findIndex((i) => i.hex == defaultColor);
		if (index < 0) {
			return 0;
		}
		return index;
	};

	return (
		<Modal closeModal={closeModal} stateModal={stateModal} title={label}>
			<form onSubmit={onSubmit}>
				<Input
					autoFocus
					defaultValue={defaultName}
					error={inputNameError ? { message: inputNameError, type: 'value' } : undefined}
					ref={inputName}
					type="text"
					id="name"
					placeholder="Звездные войны"
					label="Введите название подборки"
				/>
				<div>
					<p>Введите описание подборки</p>
					<textarea
						defaultValue={defaultDescriptionValue}
						className={styles.textarea}
						placeholder="Подборка про супергероев"
						name="description"
						ref={description}
					/>
				</div>
				<ColorPicker defaultIndexItem={setDefaultColor()} onPickColor={onPickColor} items={colorConfig} />
				<Switch defaultChecked={defaultSwitch} id="switch" label="Приватная подборка" setState={setIsPrivate} />
				<Button stretch children={label} />
				{error && <Error>{error}</Error>}
			</form>
		</Modal>
	);
};
