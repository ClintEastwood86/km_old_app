import { CollectionProps } from './Collection.props';
import styles from './Collection.module.css';
import cn from 'classnames';
import { EmptyPoster, Htag, IsTruthy, P, User } from '..';
import Image from 'next/image';
import { getCorrectDeclination } from '@/helpers/declination';
import Private from './Private.svg';
import { CSSProperties } from 'react';

export const Collection = ({ info, className, ...props }: CollectionProps): JSX.Element => {
	const link = `/collection/${info?.id}`;
	const setPoster = (poster: string | undefined, alt: string) => {
		if (!poster) {
			return (
				<div className={styles.emptyPoster}>
					<EmptyPoster />
				</div>
			);
		}
		return <Image unoptimized loader={() => poster} src={poster} alt={alt} fill />;
	};

	if (!info) {
		return (
			<div {...props} className={cn(className, styles.card, styles.lazyCard)}>
				<div className={cn(styles.head, styles.lazyHead)}>
					<div className={styles.lazyFollowers}></div>
					<div className={styles.user}>
						<div className={styles.lazyAvatar}></div>
						<div className={styles.lazyWrapper}>
							<div className={styles.lazyLogin}></div>
							<div className={styles.lazyRank}></div>
						</div>
					</div>
					<div className={styles.lazyTitle}></div>
				</div>
				<div className={cn(styles.preview, styles.lazyPreview)}></div>
			</div>
		);
	}

	return (
		<div {...props} className={cn(className, styles.card)}>
			<div style={{ backgroundColor: info.color }} className={styles.head}>
				<div style={{ justifyContent: info.private ? 'space-between' : 'flex-end' }} className={styles.lockWrapper}>
					<IsTruthy condition={info.private}>
						<Private />
					</IsTruthy>
					<P style={{ fontSize: 12 }} className={styles.followers} color="black" size="s">
						{info._count.followers} подписок
					</P>
				</div>
				<User appearance="black" user={info.creator} />
				<Htag className={styles.title} color="black" tag="h3">
					<a href={link}>{info.name}</a>
				</Htag>
				<P style={{ fontSize: 12 }} color="black" size="s">
					{info.moviesId.length} {getCorrectDeclination(info.moviesId.length, ['фильм', 'фильма', 'фильмов'])}
				</P>
			</div>
			<a href={link} className={styles.preview}>
				{info.preview.map((movie, index) => (
					<div
						key={movie.alias}
						style={{ '--index': index } as CSSProperties}
						className={cn(styles.poster, { [styles.blur]: movie.genres.includes(29) })}>
						{setPoster(movie.secondPoster, movie.alias)}
					</div>
				))}
				<IsTruthy condition={info.preview.length == 0}>
					<P>Подборка пуста</P>
				</IsTruthy>
				<IsTruthy condition={!!info.preview.find((m) => m.genres.includes(29))}>
					<P size="s" color="red" className={styles.restriction}>
						Присутствует 18+ контент
					</P>
				</IsTruthy>
			</a>
		</div>
	);
};
