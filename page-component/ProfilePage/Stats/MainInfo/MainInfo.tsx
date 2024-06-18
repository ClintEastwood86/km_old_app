import { SettingItem } from '@/components';
import styles from './MainInfo.module.css';
import { MainInfoProps } from './MainInfo.props';
import dayjs from 'dayjs';

export const MainInfo = ({ id, ranks, rankId, watchedMinutes, multiplier }: MainInfoProps) => {
	return (
		<div className={styles.statsSettingItems}>
			<SettingItem title="ID" value={id.toString()} />
			<SettingItem title="Ранг" value={ranks.length ? ranks[rankId - 1].name : 'Неизвестный'} />
			<SettingItem
				title="Просмотрено"
				value={dayjs(new Date(0, 0, 0, 0, watchedMinutes)).format((watchedMinutes / 60 >= 24 ? 'DDд ' : '') + 'HHч mmм')}
			/>
			<SettingItem link="/blog/bonus" title="Множитель" value={`${multiplier}x`} />
		</div>
	);
};
