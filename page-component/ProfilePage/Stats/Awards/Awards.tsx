import { SectionHead } from '@/components/SectionHead/SectionHead';
import { AwardsProps } from './Awards.props';
import { Cell, Htag, IsTruthy, P, Slider } from '@/components';
import styles from './Awards.module.css';
import parse from 'html-react-parser';
import { useContext, useEffect, useState, MouseEvent, useMemo } from 'react';
import { IAward } from '@/interfaces/awards.interface';
import { API } from '@/helpers/api';
import cn from 'classnames';
import { isHttpError } from '@/typeguards/error.typeguard';
import { AppContext } from '@/contexts/app.context';
import Link from 'next/link';
import { sliderProps } from './Awards.config';

interface ICell {
	key: string | number;
	isActive: boolean;
	title: string;
	onClick: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => unknown;
	icon: JSX.Element | JSX.Element[] | string;
}

export const Awards = ({ awards, awardId, className, selfProfile = true, ...props }: AwardsProps) => {
	const [cells, setCells] = useState<ICell[]>([]);
	const [useSlider, setUseSlider] = useState<boolean>(true);
	const { addNotification } = useContext(AppContext);
	const [isFirstRender, setIsFirstRender] = useState<boolean>(true);

	const constructCells = (awards: IAward[], activeId?: number) => {
		return awards.map<ICell>((award) => {
			return {
				key: award.id,
				isActive: activeId == award.id ? true : false,
				title: award.name,
				onClick: (e) => onSelect(award.id, e.currentTarget.className),
				icon: parse(award.icon)
			};
		});
	};

	useEffect(() => {
		setCells(constructCells(awards, awardId));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [awards]);

	useEffect(() => {
		if (typeof window !== 'undefined' && window.innerWidth > 640) {
			setUseSlider(false);
		}
	}, []);

	const getAwardBlock = useMemo(() => {
		const children = cells.map((award) => {
			return (
				<Cell
					inversion
					className={cn(styles.cell, { [styles.cursorDefault]: !selfProfile })}
					isActive={award.isActive}
					key={award.key}
					title={award.title}
					onClick={(e) => award.onClick(e)}>
					{award.icon}
				</Cell>
			);
		});
		return useSlider ? (
			<Slider startAt={isFirstRender ? undefined : cells.findIndex((cell) => cell.isActive)} {...sliderProps} className={styles.slider}>
				{children}
			</Slider>
		) : (
			<div className={cn(styles.awards, styles.slider)}>{children}</div>
		);
	}, [cells, isFirstRender, selfProfile, useSlider]);

	const sendRequestSelectAward = async (id: number): Promise<boolean> => {
		const res = await fetch(API.users.changeAward + id.toString(), { credentials: 'include', method: 'put' });
		const dataOrError = await res.json();
		if (isHttpError(dataOrError)) {
			addNotification({ title: `Ошибка: ${dataOrError.data.error}`, key: `error${Date.now() / 500}` });
			return false;
		}
		addNotification({
			title: `Значок ${id == 0 ? 'убран' : `${(awards.find((a) => a.id == id) as IAward).name} установлен`}`,
			key: `changeAward${Date.now() / 500}`
		});
		return true;
	};

	const onSelect = async (awardId: number, classNames: string) => {
		if (!selfProfile) {
			return;
		}
		if (classNames.includes('isActive')) {
			awardId = 0;
		}
		if (await sendRequestSelectAward(awardId)) {
			setCells(constructCells(awards, awardId));
			setIsFirstRender(false);
		}
	};

	return (
		<section {...props} className={className}>
			<IsTruthy condition={selfProfile}>
				<SectionHead title="Установить значок" description="Значок будет виден у всех пользователей" />
			</IsTruthy>
			{getAwardBlock}
			<IsTruthy condition={awards.length == 0}>
				<Htag className={styles.emptyAwardsMessage} tag="h3" color="gray">
					У вас отсутствуют значки
				</Htag>
			</IsTruthy>
			<IsTruthy condition={selfProfile}>
				<P className={styles.about} color="white">
					Все значки можно посмотреть <Link href={'/blog/awards'}>тут</Link>
				</P>
			</IsTruthy>
		</section>
	);
};
