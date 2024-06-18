import { ObjectConstructorProps, TypeConditionItemComponent } from './ObjectConstructor.props';
import styles from './ObjectConstructor.module.css';
import cn from 'classnames';
import { Select } from '..';
import { ChangeEvent, useEffect, useState } from 'react';
import { SelectQueryItem } from '../Select/Select.props';
import { isJsxComponent } from '@/typeguards/jsx.typeguard';

export const ObjectConstructor = ({ setCondition, index, options, className, ...props }: ObjectConstructorProps): JSX.Element => {
	const [embeddingKeys, setEmbeddingKeys] = useState<string[]>([]);

	const setNewKeys = (item: SelectQueryItem<string>, currentIndex: number) => {
		const newArr: string[] = [];
		for (let o = 0; o <= currentIndex; o++) {
			newArr.push(embeddingKeys[o]);
		}
		newArr.push(item.value);
		setEmbeddingKeys(newArr);
	};

	const getCorrectValue = (e: Parameters<typeof onChange>[0]): unknown => {
		switch (e.target.type) {
			case 'number': {
				return Number(e.target.value);
			}
			case 'checkbox': {
				return e.target.checked;
			}
			case 'date': {
				return new Date(e.target.value).toJSON();
			}
			default: {
				return e.target.value;
			}
		}
	};

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		//
		const object: Record<string, any> = embeddingKeys.reduceRight<Record<string, any>>((obj, key) => {
			if (key == embeddingKeys.at(-1)) {
				obj[key] = getCorrectValue(e);
				return obj;
			} else {
				return { [key]: obj };
			}
		}, {});
		setCondition(object, index);
	};

	const constructQueriesForSelect = (obj: Record<string, unknown>) => {
		return Object.keys(obj).map((key) => ({ label: key, value: key }));
	};

	useEffect(() => {
		setCondition({}, index);
	}, [index, setCondition]);

	return (
		<div {...props} className={cn(className, styles.body)}>
			<Select
				className={styles.select}
				appearance="default"
				onSelect={(item) => setEmbeddingKeys([item.value])}
				queries={constructQueriesForSelect(options)}
			/>
			{embeddingKeys.map((_, i) => {
				//
				const element = embeddingKeys.reduce<TypeConditionItemComponent | Record<string, any>>((obj, key, index) => {
					if (index > i || isJsxComponent<TypeConditionItemComponent>(obj, onChange)) {
						return obj;
					}
					return obj[key];
				}, options);
				if (isJsxComponent<TypeConditionItemComponent>(element, onChange)) {
					return (
						<div className={styles.input} key={element.name}>
							{element(onChange)}
						</div>
					);
				}
				return (
					<Select
						className={styles.select}
						key={i}
						onSelect={(item) => setNewKeys(item, i)}
						queries={constructQueriesForSelect(element)}
					/>
				);
			})}
		</div>
	);
};
