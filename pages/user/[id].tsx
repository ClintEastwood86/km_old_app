/* eslint-disable prettier/prettier */
import { Collection, Htag, IsTruthy, Progressbar, Separator, Wrapper } from '@/components';
import { AppContext } from '@/contexts/app.context';
import { API } from '@/helpers/api';
import { IErrorResponse } from '@/interfaces/error.interface';
import { UserModelOther } from '@/interfaces/user.interface';
import { withLayout } from '@/layout/Layout';
import { TopWrapper } from '@/page-component/ProfilePage/TopWrapper/TopWrapper';
import { isHttpError } from '@/typeguards/error.typeguard';
import { isUserModelOther } from '@/typeguards/userModelOther.typeguard';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { MainInfo } from '@/page-component/ProfilePage/Stats/MainInfo/MainInfo';
import { Awards } from '@/page-component/ProfilePage/Stats/Awards/Awards';
import { IAward } from '@/interfaces/awards.interface';
import Head from 'next/head';
import { createTitle } from '@/helpers/title';
import { IRank } from '@/interfaces/rank.interface';

const User = (data: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const router = useRouter();
	const { addNotification } = useContext(AppContext);

	if (isUserModelOther(data)) {
		const description = `Страница пользователя ${data.login} (ID: ${data.id}). Ранг: ${
			data.ranks.find((r) => r.id == data.rankId)?.name
		}. Открыто ${data.allAwards.length} значков.`;
		const title = createTitle(data.login);

		return (
			<>
				<Head>
					<title>{title}</title>
					<meta property="og:title" content={title} />
					<meta property="og:type" content="profile" />
					{data.avatar && <meta property="og:image" content={data.avatar} />}
					<meta property="og:description" content={description} />
					<meta name="description" content={description} />
				</Head>
				<TopWrapper
					userId={data.id}
					selfProfile={false}
					login={data.login}
					avatar={data.avatar}
					icon={data.allAwards.find((a) => a.id == data.awardId)?.icon}
				/>
				<Wrapper>
					<MainInfo multiplier={data.bonus} {...data} ranks={data.ranks} />
					<Progressbar
						style={{ marginTop: 25 }}
						value={data.userPoints}
						limit={data.ranks.length == data.rankId ? null : data.ranks[data.rankId].points}
					/>
					<IsTruthy condition={data.allAwards.length > 0}>
						<Separator />
						<Awards selfProfile={false} awardId={data.awardId} awards={data.allAwards} />
					</IsTruthy>
					<IsTruthy condition={data.collections.length !== 0}>
						<Separator />
						<Htag tag="h2">Популярные подборки пользователя</Htag>
						<section style={{ display: 'flex', marginTop: 25, gap: '36px 16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
							{data.collections.map((c) => (
								<Collection info={c} key={c.id} />
							))}
						</section>
					</IsTruthy>
				</Wrapper>
			</>
		);
	}
	'error' in data &&
		data.error &&
		addNotification({
			title: data.error,
			key: `error${Date.now() / 1000}`
		});
	router.push('/404', {}, { shallow: true });
	return <></>;
};

export default withLayout(User);

export const getServerSideProps: GetServerSideProps<
	(UserModelOther & { allAwards: IAward[]; ranks: IRank[]; bonus: number }) | { error?: string }
> = async ({ params }) => {
	if (!params || Number.isNaN(Number(params.id))) {
		return {
			notFound: true
		};
	}
	const awardsResponse = await fetch(API.awards.get);
	let awards: IAward[] = await awardsResponse.json();
	if (isHttpError(awards)) {
		awards = [];
	}

	const userResponse = await fetch(API.users.getUserOtherInfo + params.id);
	const userInfo: UserModelOther | IErrorResponse = await userResponse.json();
	if (isHttpError(userInfo)) {
		switch (userInfo.code) {
			case 404: {
				return {
					notFound: true
				};
			}
			default: {
				return {
					props: {
						error: userInfo.data.error
					}
				};
			}
		}
	}

	const ranksResponse = await fetch(API.ranks.get);
	const ranks = await ranksResponse.json();

	const response = await fetch(API.bonus.getCommonMultiplier + params.id, { credentials: 'include' });
	const multiplier: number = await response.json();

	return {
		props: {
			...userInfo,
			ranks,
			bonus: multiplier,
			allAwards: awards.length ? awards.filter((award) => userInfo.awardsOpen.map((a) => a.id).includes(award.id)) : []
		}
	};
};
