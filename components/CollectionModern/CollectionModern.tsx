import { CollectionProps } from '@/components/Collection/Collection.props';
import styles from './CollectionModern.module.css';
import cn from 'classnames';
import { EmptyPoster, IsTruthy, User } from '..';
import Image from 'next/image';
import Private from '../Collection/Private.svg';
import { CSSProperties } from 'react';
import { MovieShort } from '@/interfaces/movie.interface';

export const CollectionModern = ({ info, className, ...props }: CollectionProps): JSX.Element => {
	const link = `/collection/${info?.id}`;

	const setPoster = (poster: string | undefined, alt: string) => {
		if (!poster) {
			return (
				<div className={styles.emptyCell}>
					<EmptyPoster usePhrases={false} />
				</div>
			);
		}
		return <Image objectFit="cover" unoptimized loader={() => poster} src={poster} alt={alt} fill />;
	};

	const renderPoster = (movie: MovieShort, cellClass: string, style?: CSSProperties) => (
		<div key={movie.alias} style={style} className={cn(cellClass, { [styles.blur]: movie.genres.includes(29) })}>
			{setPoster(movie.poster, movie.alias)}
		</div>
	);

	if (!info) {
		return (
			<article {...props} className={cn(className, styles.card, styles.lazyCard)} aria-busy="true">
				<div className={styles.lazyHeader}>
					<span className={styles.lazyTitleBar} />
					<span className={styles.lazyAccent} />
				</div>
				<div className={styles.lazyMosaic}>
					<span className={styles.lazyHeroCell} />
					<span />
					<span />
					<span />
				</div>
				<div className={styles.lazyFooter}>
					<span className={styles.lazyAvatar} />
					<div className={styles.lazyFooterMeta}>
						<span />
						<span />
					</div>
					<div className={styles.lazyStats}>
						<span />
						<span />
					</div>
				</div>
			</article>
		);
	}

	const count = info.moviesId.length;
	const previews = info.preview.slice(0, 4);
	const accentStyle = { '--collection-accent': info.color } as CSSProperties;

	const mosaic = () => {
		if (previews.length === 0) {
			return (
				<div className={styles.mosaicEmpty}>
					<span>Подборка пуста</span>
				</div>
			);
		}
		if (previews.length === 1) {
			return <div className={cn(styles.mosaic, styles.mosaicOne)}>{renderPoster(previews[0], styles.cellFull)}</div>;
		}
		if (previews.length === 2) {
			return (
				<div className={cn(styles.mosaic, styles.mosaicTwo)}>
					{renderPoster(previews[0], styles.cellHalf)}
					{renderPoster(previews[1], styles.cellHalf)}
				</div>
			);
		}
		const [main, ...rest] = previews;
		const slots: (MovieShort | null)[] = [rest[0] ?? null, rest[1] ?? null, rest[2] ?? null];
		return (
			<div className={cn(styles.mosaic, styles.mosaicBento)}>
				{renderPoster(main, styles.cellHero)}
				{slots.map((movie, i) =>
					movie ? (
						renderPoster(movie, styles.cellSide, { gridColumn: 2, gridRow: i + 1 })
					) : (
						<div key={`empty-${i}`} className={styles.cellPlaceholder} style={{ gridColumn: 2, gridRow: i + 1 }} />
					)
				)}
			</div>
		);
	};

	return (
		<article {...props} className={cn(className, styles.card)} style={accentStyle}>
			<header className={styles.header}>
				<div className={styles.titleRow}>
					<h3 className={styles.title}>
						<a href={link}>{info.name}</a>
					</h3>
					<IsTruthy condition={info.private}>
						<span className={styles.privateWrap} title="Приватная подборка">
							<Private />
						</span>
					</IsTruthy>
				</div>
			</header>

			<div className={styles.accentRule} aria-hidden />

			<a href={link} className={styles.mosaicLink} aria-label={`Открыть подборку: ${info.name}`}>
				{mosaic()}
			</a>

			<IsTruthy condition={!!info.preview.find((m) => m.genres.includes(29))}>
				<p className={styles.restriction}>Присутствует 18+ контент</p>
			</IsTruthy>

			<footer className={styles.footer}>
				<User appearance="primary" user={info.creator} className={styles.footerUser} />
				<dl className={styles.stats}>
					<div className={styles.stat}>
						<dt>Подписок</dt>
						<dd>{info._count.followers}</dd>
					</div>
					<div className={styles.stat}>
						<dt>Фильмов</dt>
						<dd>{count}</dd>
					</div>
				</dl>
			</footer>
		</article>
	);
};
