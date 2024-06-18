import { API } from '@/helpers/api';
import { IAward } from '@/interfaces/awards.interface';
import { IErrorResponse } from '@/interfaces/error.interface';
import { withLayout } from '@/layout/Layout';
import { AwardConstructor } from '@/page-component/AdminPages/Awards/Constructor/Constructor';
import { isHttpError } from '@/typeguards/error.typeguard';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

const AdminSettingAward = ({ award }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	return (
		<AwardConstructor
			awardId={award.id}
			nameDefault={award.name}
			iconDefault={award.icon}
			descriptionDefault={award.description}
			categoryDefault={award.category}
			conditionDefault={award.condition}
		/>
	);
};

export default withLayout(AdminSettingAward, 'admin');

export const getServerSideProps: GetServerSideProps<ReturnTypeGetServerSideProps> = async ({ params }) => {
	if (!params) {
		return {
			notFound: true
		};
	}
	const response = await fetch(API.awards.get + params.id);
	const award: IAward | IErrorResponse = await response.json();
	if (isHttpError(award)) {
		return {
			notFound: true
		};
	}
	return {
		props: {
			award
		}
	};
};

interface ReturnTypeGetServerSideProps extends Record<string, unknown> {
	award: IAward;
}
