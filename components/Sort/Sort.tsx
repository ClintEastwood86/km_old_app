import { Htag, P } from '@/components';
import styles from './Sort.module.css';
import { useRef } from 'react';
import { sortConfig } from '@/configs/sort.config';
import cn from 'classnames';
import { SortProps } from './Sort.props';
import { useOutsideClick } from '@/hooks/outsideClick.hook';

export const Sort = ({ sortId, setSort, className, ...props }: SortProps) => {
	const context = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen, trigger] = useOutsideClick<HTMLButtonElement, HTMLDivElement>(context);

	return (
		<div className={styles.sortComponent}>
			<button ref={trigger} {...props} onClick={() => setIsOpen((bool) => !bool)} className={cn(styles.button, className)}>
				{typeof sortId == 'number' ? (
					<svg
						style={{ transition: '.2s all ease' }}
						className={cn({ [styles.arrow]: sortId % 2 == 0 })}
						xmlns="http://www.w3.org/2000/svg"
						width="10"
						height="16"
						viewBox="0 0 10 16"
						fill="none">
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M5.00001 0C5.55229 0 6.00001 0.51168 6.00001 1.14286V12.0981L8.29291 9.4776C8.68341 9.03131 9.31661 9.03131 9.70711 9.4776C10.0976 9.92389 10.0976 10.6475 9.70711 11.0938L5.70712 15.6653C5.31659 16.1115 4.68343 16.1115 4.2929 15.6653L0.29289 11.0938C-0.0976301 10.6475 -0.0976301 9.92389 0.29289 9.4776C0.683421 9.03131 1.31658 9.03131 1.70711 9.4776L4.00001 12.0981V1.14286C4.00001 0.51168 4.44773 0 5.00001 0Z"
							fill="#FCB74F"
						/>
					</svg>
				) : (
					<P size="l">–</P>
				)}
				<span className={styles.wrapper}>
					<Htag tag="h3">Сортировка</Htag>
					<P className={styles.value} size="s">
						{typeof sortId == 'number'
							? sortConfig.find((sort) => sort.value == sortId - (sortId % 2 == 1 ? 1 : 0))?.name
							: 'Нет сортировки'}
					</P>
				</span>
			</button>
			{isOpen && (
				<div ref={context} className={styles.context}>
					{sortConfig.map((item) => (
						<button
							onClick={() => setSort(typeof sortId == 'number' && sortId == item.value ? item.value + 1 : item.value)}
							className={cn({
								[styles.activeButton]: typeof sortId == 'number' && item.value + (sortId % 2 == 0 ? 0 : 1) == sortId
							})}
							key={item.value}>
							<P size="m" color="grayLight">
								{item.name}
							</P>
						</button>
					))}
				</div>
			)}
		</div>
	);
};
