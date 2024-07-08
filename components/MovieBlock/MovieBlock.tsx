import Image from 'next/image';
import Link from 'next/link';
import { MovieBlockProps } from './MovieBlock.props';
import styles from './MovieBlock.module.css';
import cn from 'classnames';
import { Button, EmptyPoster, Htag, IsTruthy, P } from '..';
import dayjs from 'dayjs';

export const MovieBlock = ({
	generateNewMovie,
	direction = 'column',
	info,
	usePhrases = true,
	genres,
	className,
	...props
}: MovieBlockProps): JSX.Element => {
	const link = `/movie/${info?.alias}`;
	const name = (info?.nameRussian || info?.nameOriginal) as string;

	const constructPoster = (alias: string, poster?: string): JSX.Element => {
		if (poster) {
			return <Image unoptimized loader={() => poster} src={poster} alt={alias} fill style={{ objectFit: 'cover' }} />;
		}
		return <EmptyPoster appearance="primaryLight" className={styles.poster} usePhrases={usePhrases} size="small" />;
	};

	const constuctDuration = (minutes: number): string => {
		const hours = Math.floor(minutes / 60);
		return `${hours ? `${hours}ч` : ''} ${minutes - hours * 60}м`;
	};

	const constructGenres = (genresId: number[]): JSX.Element => {
		if (!genresId.length) {
			return <></>;
		}
		const arrayNames = genresId.map((id) => {
			return genres.find((g) => g.id == id)?.name;
		}) as string[];
		return (
			<>
				Жанр: {arrayNames[0]} {arrayNames.length > 1 ? ` и ${arrayNames.length - 1} др.` : ''}
			</>
		);
	};

	if (!info) {
		return (
			<div className={cn(styles.empty, { [styles.row]: direction == 'row' })}>
				<div className={styles.image}></div>
				<div>
					<span className={styles.title}></span>
					<div className={styles.characteristics}>
						<span></span>
						<span></span>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div {...props} className={cn(className, styles.movie, { [styles.row]: direction == 'row' })}>
			<Link tabIndex={-1} href={link} className={cn(styles.image, { [styles.blur]: info.genres.includes(29) })}>
				{constructPoster(info.alias, process.env.NODE_ENV == 'development' ? info.secondPoster : info.poster || info.secondPoster)}
				<IsTruthy condition={info.genres.includes(29)}>
					<div className={styles.ageRestriction}>
						<P size="s" color="white">
							18+
						</P>
					</div>
				</IsTruthy>
			</Link>
			<div className={styles.rowWrapper}>
				<div>
					<Htag className={styles.title} tag="h3">
						<Link href={link}>{name}</Link>
					</Htag>
					<div className={styles.characteristics}>
						<P>{constructGenres(info.genres)}</P>
						<P>
							{info.premiere
								? `Премьера: ${dayjs(info.premiere).format('YYYY-MM-DD')}`
								: info.timeMinutes
								? `Длительность: ${constuctDuration(info.timeMinutes)}`
								: ''}
						</P>
					</div>
				</div>
				<IsTruthy condition={direction == 'row'}>
					<div className={styles.rowButtons}>
						<IsTruthy condition={!!generateNewMovie}>
							<Button onClick={generateNewMovie} stretch>
								Заново
							</Button>
						</IsTruthy>
						<Button stretch href={link}>
							Смотреть
						</Button>
					</div>
				</IsTruthy>
			</div>
		</div>
	);
};
