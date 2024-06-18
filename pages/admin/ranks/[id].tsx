import { API } from '@/helpers/api';
import { IAward } from '@/interfaces/awards.interface';
import { IErrorResponse } from '@/interfaces/error.interface';
import { IRank } from '@/interfaces/rank.interface';
import { withLayout } from '@/layout/Layout';
import { RankConstructor } from '@/page-component/AdminPages/Ranks/Constructor/Constructor';
import { isHttpError } from '@/typeguards/error.typeguard';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

const AdminSettingRank = ({ rank, award }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	return <RankConstructor editableRankId={rank.id} awardDefault={award} pointsDefault={rank.points} nameDefault={rank.name} />;
};

export default withLayout(AdminSettingRank, 'admin');

export const getServerSideProps: GetServerSideProps<ReturnTypeGetServerSideProps> = async ({ params }) => {
	if (!params) {
		return {
			notFound: true
		};
	}
	const response = await fetch(API.ranks.get + params.id);
	const rank: IRank | IErrorResponse = await response.json();
	if (isHttpError(rank)) {
		return {
			notFound: true
		};
	}
	const award = rank.awardId ? await (await fetch(API.awards.get + rank.awardId)).json() : null;
	return {
		props: {
			rank,
			award
		}
	};
};

interface ReturnTypeGetServerSideProps extends Record<string, unknown> {
	rank: IRank;
	award: IAward | null;
}
