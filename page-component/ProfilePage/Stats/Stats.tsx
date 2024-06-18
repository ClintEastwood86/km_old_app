import { IsTruthy, Separator } from '@/components';
import { StatsProps } from './Stats.props';
import { Ranks } from './Ranks/Ranks';
import Head from 'next/head';
import { Points } from './Points/Points';
import { History } from './History/History';
import { Awards } from './Awards/Awards';
import { createTitle } from '@/helpers/title';
import { MainInfo } from './MainInfo/MainInfo';
import { API } from '@/helpers/api';
import { IErrorResponse } from '@/interfaces/error.interface';
import { isHttpError } from '@/typeguards/error.typeguard';
import { useEffect, useState } from 'react';

export const Stats = ({ awards, ranks, user, pointsItems, className, ...props }: StatsProps) => {
	const [multiplier, setMultiplier] = useState<number>(1);

	const getMultiplier = async () => {
		const response = await fetch(API.bonus.getCommonMultiplier, { credentials: 'include' });
		const multiplier: number | IErrorResponse = await response.json();
		if (isHttpError(multiplier)) {
			return console.error(multiplier.data.error);
		}
		setMultiplier(multiplier);
	};

	useEffect(() => {
		getMultiplier();
	}, []);

	return (
		<>
			<Head>
				<title>{createTitle('Статистика')}</title>
			</Head>
			<div className={className} {...props}>
				<MainInfo multiplier={multiplier} {...user} ranks={ranks} />

				<Separator />
				<Awards awardId={user.awardId} awards={awards.filter((award) => award.isOpen)} />

				<IsTruthy condition={ranks.length !== 0}>
					<Separator />
					<Ranks awards={awards} userPoints={user.userPoints} userRankId={user.rankId} ranks={ranks} />
				</IsTruthy>

				<IsTruthy condition={pointsItems.length !== 0}>
					<Separator />
					<Points pointsItems={pointsItems} />
				</IsTruthy>

				<IsTruthy condition={user.userPoints > 0}>
					<Separator />
					<History pointsItems={pointsItems} />
				</IsTruthy>
			</div>
		</>
	);
};
