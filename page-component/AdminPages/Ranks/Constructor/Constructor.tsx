import { Button, Htag, Input, IsTruthy, Error, Cell, ErrorBlock, Loader } from '@/components';
import { useState, ChangeEvent, useContext } from 'react';
import styles from './Constructor.module.css';
import { ConstructorProps } from './Constructor.props';
import cn from 'classnames';
import { IAward } from '@/interfaces/awards.interface';
import { API } from '@/helpers/api';
import { isHttpError } from '@/typeguards/error.typeguard';
import { useRouter } from 'next/router';
import { AppContext } from '@/contexts/app.context';
import { useAwards } from '@/hooks/awards.hook';
import parse from 'html-react-parser';
import { useRanks } from '@/hooks/ranks.hook';
import { useAuth } from '@/hooks/auth.hook';
import { UserRole } from '@/interfaces/user.interface';

export const RankConstructor = ({ className, editableRankId, pointsDefault, nameDefault, awardDefault, ...props }: ConstructorProps) => {
	const [name, setName] = useState<string>(nameDefault ?? '');
	const [points, setPoints] = useState<number>(pointsDefault ?? 0);
	const [award, setAward] = useState<IAward | null>(awardDefault ?? null);

	const ranksList = useRanks(true);
	const awardList = useAwards(true);

	const { authState } = useAuth(UserRole.ADMIN);
	const router = useRouter();
	const [errors, setErrors] = useState<string[]>([]);
	const { addNotification } = useContext(AppContext);

	const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};

	const onChangePoints = (e: ChangeEvent<HTMLInputElement>) => {
		setPoints(Number(e.target.value));
	};

	const onCheckAward = (award: IAward) => {
		setAward((a) => {
			if (!a) {
				return award;
			}
			return a.id == award.id ? null : award;
		});
	};

	const sendRequest = async () => {
		if (!validateForm()) {
			return;
		}
		const dto = {
			name,
			awardId: award?.id,
			points
		};
		const route = editableRankId ? API.ranks.update + editableRankId : API.ranks.create;
		const response = await fetch(route, {
			body: JSON.stringify(dto),
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			method: editableRankId ? 'PUT' : 'POST'
		});
		const rank = await response.json();
		if (isHttpError(rank)) {
			if (rank.context == 'validator') {
				return setErrors(Object.values(rank.data.data));
			}
			return addNotification({ key: (Date.now() / 1000).toString(), title: rank.message, description: rank.data.error });
		}
		if (editableRankId) {
			return router.push('/admin/ranks');
		}
		return router.reload();
	};

	const validateForm = (): boolean => {
		const errs: string[] = [];
		if (name.length < 2) {
			errs.push('Название должно быть длиннее 2 символов');
		}
		if (name.length > 15) {
			errs.push('Название должно быть короче 15 символов');
		}

		if (!errs.length) {
			return true;
		}
		setErrors(errs);
		return false;
	};

	const filterAwards = (a: IAward) =>
		!ranksList.some((r) => {
			if (editableRankId && r.id == editableRankId) {
				return false;
			}
			return r.awardId && r.awardId == a.id;
		});

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
					Изменить звание <span>{nameDefault}</span>
				</Htag>
			) : (
				<Htag tag="h2">Создать звание</Htag>
			)}
			<Input
				className={cn(styles.name, styles.wrapper, styles.input)}
				id="name"
				placeholder="Новичок"
				label="Название"
				value={name}
				onChange={onChangeName}
			/>
			<div className={styles.wrapper}>
				<Input
					className={styles.input}
					type="number"
					id="points"
					min={0}
					placeholder="1000"
					label="Кол-во очков"
					value={points}
					onChange={onChangePoints}
				/>
			</div>

			<div className={cn(styles.wrapper, styles.awardsWrapper)}>
				{awardList.filter(filterAwards).map((a) => {
					return (
						<Cell
							title={`ID ${a.id}`}
							key={a.id}
							onClick={() => onCheckAward(a)}
							isActive={award?.id == a.id}
							className={styles.cell}>
							{parse(a.icon)}
						</Cell>
					);
				})}
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
