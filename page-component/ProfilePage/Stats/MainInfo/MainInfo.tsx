import { SettingItem } from '@/components';
import styles from './MainInfo.module.css';
import { MainInfoProps } from './MainInfo.props';

export const MainInfo = ({ id, ranks, rankId, watchedMinutes, multiplier }: MainInfoProps) => {
	return (
		<div className={styles.statsSettingItems}>
			<SettingItem title="ID" value={id.toString()} />
			<SettingItem title="Ранг" value={ranks.length ? ranks[rankId - 1].name : 'Неизвестный'} />
			<SettingItem title="Просмотрено" value={`${Math.floor(watchedMinutes / 60)}ч ${watchedMinutes % 60}м`} />
			<SettingItem link="/blog/bonus" title="Множитель" value={`${multiplier}x`} />
		</div>
	);
};
