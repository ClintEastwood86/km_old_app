import { ObjectConstructor, Button, Htag, Input, IsTruthy, User, Cell, Select, P, Error, ErrorBlock, Loader } from '@/components';
import { useState, useCallback, ChangeEvent, useContext } from 'react';
import { userConditionModelConfig } from '../Awards.constants';
import Cross from '@/public/cross.svg';
import styles from './Constructor.module.css';
import { ConstructorProps } from './Constructor.props';
import cn from 'classnames';
import parse from 'html-react-parser';
import { UserContext } from '@/contexts/user.context';
import { AwardCategory } from '@/interfaces/awards.interface';
import { SelectQueryItem } from '@/components/Select/Select.props';
import { API } from '@/helpers/api';
import { isHttpError } from '@/typeguards/error.typeguard';
import { useRouter } from 'next/router';
import { AppContext } from '@/contexts/app.context';
import { useAuth } from '@/hooks/auth.hook';
import { UserRole } from '@/interfaces/user.interface';

export const AwardConstructor = ({
	className,
	awardId,
	nameDefault,
	categoryDefault,
	conditionDefault,
	iconDefault,
	descriptionDefault,
	...props
}: ConstructorProps) => {
	const [name, setName] = useState<string>(nameDefault ?? '');
	const [description, setDescription] = useState<string>(descriptionDefault ?? '');
	const [condition, setCondition] = useState<(Record<string, any> | null)[]>([]);
	const [svgIcon, setSvgIcon] = useState<string>(iconDefault ?? '');
	const [category, setCategory] = useState<string>(categoryDefault ?? AwardCategory.REGISTER);

	const [indexCostructors, setIndexConstructors] = useState<number[]>([0]);
	const user = useContext(UserContext);
	const { authState } = useAuth(UserRole.ADMIN);
	const router = useRouter();
	const [errors, setErrors] = useState<string[]>([]);
	const { addNotification } = useContext(AppContext);

	const setConditionConfig = useCallback((data: (typeof condition)[number], index: number) => {
		setCondition((prevState) => {
			const newArr = [...prevState];
			newArr[index] = data;
			return newArr;
		});
	}, []);

	const addConstructor = () => {
		setIndexConstructors((arr) => [...arr, (arr.at(-1) ?? 0) + 1]);
	};

	const removeConstructor = (index: number) => {
		setIndexConstructors((arr) => arr.filter((i) => i !== index));
		setCondition((arr) => {
			arr[index] = null;
			return arr;
		});
	};

	const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};

	const onSetCategory = (item: SelectQueryItem<string>) => {
		setCategory(item.value);
	};

	const sendRequest = async () => {
		const dto = {
			name,
			description: description || 'Входит в набор стартовых значков',
			condition: JSON.stringify({ AND: condition.filter((c) => !!c && c.toString() !== '{}') }),
			category,
			icon: svgIcon
		};
		const route = awardId ? API.awards.update + awardId : API.awards.create;
		const response = await fetch(route, {
			body: JSON.stringify(dto),
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			method: awardId ? 'PUT' : 'POST'
		});
		const award = await response.json();
		if (isHttpError(award)) {
			if (award.context == 'validator') {
				return setErrors(Object.values(award.data.data));
			}
			return addNotification({ key: (Date.now() / 1000).toString(), title: award.message, description: award.data.error });
		}
		if (awardId) {
			return router.push('/admin/awards');
		}
		return router.reload();
	};

	if (isHttpError(authState)) {
		return <ErrorBlock setTitle response={authState} />;
	}

	if (!authState) {
		return <Loader className="loader-page" />;
	}

	return (
		<section className={cn(className, styles.main)} {...props}>
			{nameDefault ? (
				<Htag tag="h2">
					Изменить значок <span>{nameDefault}</span>
				</Htag>
			) : (
				<Htag tag="h2">Создать значок</Htag>
			)}

			<Input className={styles.name} id="name" placeholder="Империя" label="Название" value={name} onChange={onChangeName} />
			<div className={cn(styles.wrapper, styles.textareaWrapper)}>
				<label htmlFor="description">Описание</label>
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					id="description"
					placeholder="Входит в стартовый набор значков"
					rows={4}
					maxLength={240}
					className={styles.textarea}
				/>
			</div>
			<div className={styles.wrapper}>
				<label>Категория</label>
				<Select
					className={styles.category}
					defaultQuery={{ label: category, value: category }}
					queries={Object.keys(AwardCategory).map((key) => ({ label: key, value: key }))}
					onSelect={onSetCategory}
				/>
				<P color="grayLight">Выбирая категорию, вы обозначаете в какое время будут обновляться значки.</P>
				<ul className={styles.listAwards}>
					<li>REGISTER – при регистрации аккаунта</li>
					<li>RANKS – при повышении в звании</li>
					<li>POINTS – при начислении очков</li>
				</ul>
			</div>
			<div className={styles.wrapper}>
				<p>Конструктор условия</p>
				<div className={styles.constructors}>
					{indexCostructors.map((index) => (
						<div key={index} className={styles.constr}>
							<ObjectConstructor key={index} index={index} setCondition={setConditionConfig} options={userConditionModelConfig} />
							<button onClick={() => removeConstructor(index)}>{<Cross />}</button>
						</div>
					))}
				</div>
				<Button className={styles.wrapper} onClick={addConstructor}>
					Добавить условие
				</Button>
				<P style={{ marginBlock: 15, display: 'block' }}>Чтобы значок появился у всех можно оставить без изменений</P>
				<pre className={styles.preview}>{JSON.stringify({ AND: condition.filter((c) => !!c && c.toString() !== '{}') }, null, 4)}</pre>
				<IsTruthy condition={!!conditionDefault}>
					<div className={styles.wrapper}>
						<P>Старое условие</P>
						{conditionDefault && <pre className={styles.preview}>{JSON.stringify(JSON.parse(conditionDefault || ''), null, 4)}</pre>}
					</div>
				</IsTruthy>
			</div>
			<div className={styles.wrapper}>
				<div className={styles.textareaWrapper}>
					<label htmlFor="svg">Вставить SVG</label>
					<textarea
						value={svgIcon}
						onChange={(e) => setSvgIcon(e.target.value)}
						id="svg"
						placeholder="<svg>...</svg>"
						className={cn(styles.textarea, styles.textareaSvg)}
					/>
					<P size="m" color="grayLight">
						Обязательно! Свойство fill у svg должно изменять цвет. Width и height – высоту
					</P>
				</div>
				<div className={cn(styles.wrapper, styles.previewIcon)}>
					<p>Превью</p>
					<div>
						<IsTruthy condition={user.isAuth && !!svgIcon}>
							{user.isAuth && <User user={{ ...user, awardSelected: { icon: svgIcon ?? '' } }} appearance="primary" />}
							<Cell inversion isActive title={name}>
								{parse(svgIcon || '')}
							</Cell>
						</IsTruthy>
					</div>
				</div>
			</div>
			<Button className={styles.wrapper} onClick={sendRequest}>
				{nameDefault ? 'Изменить' : 'Создать'}
			</Button>
			<IsTruthy condition={errors.length !== 0}>
				<div className={cn(styles.wrapper, styles.errorBlock)}>
					{errors.map((str, i) => (
						<Error key={i}>{str}</Error>
					))}
				</div>
			</IsTruthy>
		</section>
	);
};
