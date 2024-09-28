import { Rank } from './Rank/Rank';
import styles from './Main.module.css';
import { useContext, useEffect, useMemo, useRef } from 'react';
import { UserContext } from '@/contexts/user.context';
import { Award } from './Award/Award';
import { SectionHead } from '@/components/SectionHead/SectionHead';
import { Random } from './Random/Random';
import { Genres } from './Genres/Genres';
import { useViewportElements } from '@/hooks/viewportElements.hook';
import { displayedMoviesConfig } from '@/configs/row.config';
import { Tops } from './Tops';
import { AppContext } from '@/contexts/app.context';
import { useRouter } from 'next/router';
import { staticNotifications } from '@/constants/static-notifications.constants';

export const MainPage = () => {
	const user = useContext(UserContext);
	const { elements: take, updated } = useViewportElements(displayedMoviesConfig, 5);
	const ref = useRef<HTMLDivElement>(null);
	const genres = useMemo(() => <Genres take={take} parent={ref} />, [take]);
	const { addNotification } = useContext(AppContext);
	const router = useRouter();

	useEffect(() => {
		const notificationKey = router.query.n;
		if (!notificationKey || Array.isArray(notificationKey) || !(notificationKey in staticNotifications)) {
			return;
		}
		addNotification(staticNotifications[notificationKey as keyof typeof staticNotifications]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.n]);

	return (
		<div ref={ref} className={styles.mainContent}>
			<Tops isUpdated={updated} take={take} />
			{user.isAuth && (
				<section>
					<div className={styles.headWrapper}>
						<SectionHead title="Статистика" />
					</div>
					<div className={styles.statistics}>
						<Rank userPoints={user.userPoints} rankId={user.rankId} className={styles.statsItem} />
						<Award className={styles.statsItem} icon={user.awardSelected?.icon} />
						<Random className={styles.statsItem} />
					</div>
				</section>
			)}
			{genres}
		</div>
	);
};
