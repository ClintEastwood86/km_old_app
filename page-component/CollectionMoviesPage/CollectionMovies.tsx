import { AvatarEmpty, Button, ButtonGhost, Htag, IsTruthy, Loader, MoviesRow, P, Sort } from '@/components';
import { API } from '@/helpers/api';
import { getCorrectDeclination } from '@/helpers/declination';
import { Collection, CollectionActions } from '@/interfaces/collection.interface';
import { MovieShort } from '@/interfaces/movie.interface';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import styles from './CollectionMovies.module.css';
import { IErrorResponse } from '@/interfaces/error.interface';
import { isHttpError } from '@/typeguards/error.typeguard';
import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';
import { UserContext } from '@/contexts/user.context';
import { AppContext } from '@/contexts/app.context';
import { MOVIES_PER_REQUEST } from './CollectionMovies.constants';
import Copy from '@/public/copy.svg';
import { DataCollectionModal } from '../CollectionsPage/DataCollectionModal/DataCollectionModal';
import { DeleteModal } from './DeleteModal/DeleteModal';
import { AddMovies } from '../AddMoviesPage/AddMoviesPage';
import { UserRole } from '@/interfaces/user.interface';
import { numberCutting } from '@/helpers/number';
import parse from 'html-react-parser';
import dayjs from 'dayjs';
import { useViewportElements } from '@/hooks/viewportElements.hook';
import { displayedMoviesConfig } from '@/configs/row.config';

export const CollectionMoviesPage = () => {
	const router = useRouter();
	const { addNotification } = useContext(AppContext);
	const [moviesId, setMoviesId] = useState<number[] | null>([]);
	const [movies, setMovies] = useState<MovieShort[]>([]);
	const [page, setPage] = useState<number>(0);
	const [sort, setSort] = useState<number | undefined>(undefined);
	const [isLastPage, setIsLastPage] = useState<boolean>(false);
	const [changedMovies, setChangedMovies] = useState<boolean>(false);
	const [stateSettingModal, setStateSettingModal] = useState<boolean>(false);
	const [stateDeleteModal, setStateDeleteModal] = useState<boolean>(false);
	const [isSendRequest, setIsSendRequest] = useState<boolean>(false);
	const [isSelfCollection, setIsSelfCollection] = useState<boolean>(false);
	const [isOpen, setIsOpen] = useState(false);
	const [isShowButton, setIsShowButton] = useState(false);
	const wrapperElement = useRef<HTMLDivElement>(null);
	const textElement = useRef<HTMLDivElement>(null);
	const [info, setInfo] = useState<Collection | IErrorResponse>();
	const ref = useRef<HTMLDivElement>(null);
	const user = useContext(UserContext);
	const { elements: moviesPerPage, updated } = useViewportElements(displayedMoviesConfig, MOVIES_PER_REQUEST / 3);

	const onClickEvaluate = useCallback(
		async (actionId: CollectionActions) => {
			const id = Number(router.query.id);
			if (!id || isHttpError(info) || !info) return;
			if (!user.isAuth) {
				return addNotification({
					title: 'Нужна авторизация',
					description: 'Для реакции на подборку требуется авторизация',
					key: `evaluate${Date.now() / 1000}`
				});
			}
			const response = await fetch(API.collections.setAction(id, actionId), { method: 'put', credentials: 'include' });
			const result: Pick<Collection, 'likes' | 'dislikes' | 'followers'> = await response.json();
			setInfo({ ...info, likes: result.likes, dislikes: result.dislikes, followers: result.followers });
		},
		[addNotification, info, router.query.id, user.isAuth]
	);

	const setAvatar = (src: string | undefined, alt: string) => {
		if (!src) {
			return <AvatarEmpty />;
		}
		return <Image unoptimized src={process.env.NEXT_PUBLIC_DOMAIN + src} height={28} width={28} alt={alt} loader={() => src} />;
	};

	const setDescription = (text: string): string | JSX.Element | JSX.Element[] => {
		try {
			return parse(text.replaceAll('\n', '<br/>'.repeat(2)));
		} catch (error) {
			return text;
		}
	};

	const getCollectionInfo = useCallback(async () => {
		if (!router.query.id) return;
		const response = await fetch(`${API.collections.get}${router.query.id}`, { credentials: 'include' });
		const collection: Collection | IErrorResponse = await response.json();
		if (!isHttpError(collection)) {
			setMoviesId(collection.moviesId.length == 0 ? null : collection.moviesId);
		}
		setInfo(collection);
	}, [router.query]);

	const fetchMovies = useCallback(
		async (take: number, skip: number, sort: number | undefined) => {
			setIsSendRequest(true);
			if (!moviesId?.length) {
				return;
			}
			const body = {
				take,
				skip,
				movies: moviesId,
				sort
			};
			const response = await fetch(API.movies.getByArray, {
				credentials: 'include',
				method: 'post',
				body: JSON.stringify(body),
				headers: { 'Content-Type': 'application/json' }
			});
			const movies: IErrorResponse | MovieShort[] = await response.json();
			if (isHttpError(movies)) {
				setIsLastPage(true);
				return console.error(movies);
			}
			if (!movies.length) {
				setIsLastPage(true);
			}
			setMovies((m) => m.concat(movies));
			setIsSendRequest(false);
		},
		[moviesId]
	);

	const onCopy = useCallback(() => {
		navigator.clipboard.writeText(process.env.NEXT_PUBLIC_DOMAIN + router.asPath);
		addNotification({
			title: 'Скопировано',
			description: 'Ссылка на подборку скопирована в буфер обмена',
			key: `copy${Date.now() / 1000}`
		});
	}, [addNotification, router.asPath]);

	const moviesRendered = useMemo(() => {
		return (
			<section ref={ref}>
				<MoviesRow setPosition movies={movies} className={styles.movies} />
			</section>
		);
	}, [movies]);

	const openOrClose = useCallback(() => {
		setIsOpen(!isOpen);
	}, [isOpen]);

	const showButton = useCallback(() => {
		if (!wrapperElement.current || !textElement.current) {
			return;
		}
		setIsShowButton(wrapperElement.current.offsetHeight < textElement.current.offsetHeight);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [info]);

	useEffect(() => {
		showButton();
	}, [showButton]);

	useEffect(() => {
		getCollectionInfo();
	}, [getCollectionInfo]);

	useEffect(() => {
		if (!moviesId || !updated) return;
		setPage(1);
	}, [moviesId, updated]);

	useEffect(() => {
		setMovies([]);
	}, [sort]);

	useEffect(() => {
		if (!page) return;
		fetchMovies(moviesPerPage * 3, moviesPerPage * 3 * (page - 1), sort);
	}, [page, fetchMovies, moviesPerPage, sort]);

	useEffect(() => {
		const handleScroll = () => {
			if (isSendRequest || isLastPage) return;
			if (ref.current && ref.current.getBoundingClientRect().bottom - window.innerHeight - 150 < 0) {
				setPage((p) => p + 1);
			}
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [isLastPage, isSendRequest]);

	useEffect(() => {
		if (!info || isHttpError(info) || !user.isAuth) {
			return;
		}
		setIsSelfCollection(user.id == info.creatorId);
	}, [info, user]);

	if (!info) return <Loader className="loader-page" />;

	if (isHttpError(info)) {
		return (
			<section style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
				<Htag tag="h2">{info.data.error}</Htag>
			</section>
		);
	}

	if (changedMovies) {
		return <AddMovies id={info.id} closePage={() => setChangedMovies(false)} checkedMovies={info.moviesId} info={info} />;
	}

	return (
		<>
			<P>
				{info.private ? 'Приватная' : 'Публичная'} / {info.moviesId.length}{' '}
				{getCorrectDeclination(info.moviesId.length, ['фильм', 'фильма', 'фильмов'])}
				<IsTruthy condition={!info.private}>
					/ {info._count.followers} {getCorrectDeclination(info._count.followers, ['подписчик', 'подписчика', 'подписчиков'])}
				</IsTruthy>
			</P>
			<div className={styles.titleWrapper}>
				<Htag title={info.name} tag="h1" appearanceTag="h2" className={styles.title}>
					Подборка: <span>{info.name}</span>
				</Htag>
				<IsTruthy condition={isSelfCollection}>
					<ButtonGhost className={styles.addButton} onClick={() => setChangedMovies(true)}>
						Изменить плейлист
					</ButtonGhost>
				</IsTruthy>
			</div>
			<Link href={`/user/${info.creator.id}`} className={styles.user}>
				<div className={styles.avatar}>{setAvatar(info.creator.avatar, info.creator.login)}</div>
				<Htag color="secondary" className={styles.login} tag="h3">
					{info.creator.login}
				</Htag>
			</Link>
			<div className={styles.descriptionWrapper}>
				<Htag color="secondary" tag="h3">
					Описание подборки:
				</Htag>
				<div ref={wrapperElement} className={cn(styles.description, { [styles.open]: isOpen })}>
					<P ref={textElement} size="m">
						{setDescription(info.description)}
					</P>
				</div>
				<IsTruthy condition={isShowButton}>
					<button onClick={openOrClose} className={styles.button}>
						{isOpen ? 'Свернуть' : 'Далее'}
					</button>
				</IsTruthy>
			</div>
			<IsTruthy condition={!!info && !isHttpError(info)}>
				<div className={styles.actions}>
					<div>
						<IsTruthy condition={!info.private}>
							<div>
								<button
									title={info.likes.length.toString()}
									onClick={() =>
										onClickEvaluate(
											user.isAuth && info.likes.includes(user.id) ? CollectionActions.Empty : CollectionActions.Like
										)
									}
									className={styles.evaluate}>
									<Htag tag="h3">{numberCutting(info.likes.length)}</Htag>{' '}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="25"
										height="25"
										viewBox="0 0 25 25"
										className={cn({
											[styles.active]: user.isAuth && info.likes.includes(user.id),
											[styles.inactive]: !user.isAuth || !info.likes.includes(user.id)
										})}>
										<g clipPath="url(#clip0_114_406)">
											<path d="M25 14.8434C25 14.2174 24.751 13.634 24.3219 13.2038C24.8083 12.6715 25.0563 11.958 24.9885 11.2153C24.8667 9.89131 23.6739 8.85381 22.2719 8.85381H15.8375C16.1562 7.88608 16.6667 6.11216 16.6667 4.68716C16.6667 2.42778 14.7469 0.520508 13.5417 0.520508C12.4604 0.520508 11.6864 1.12988 11.6542 1.15488C11.5302 1.25386 11.4583 1.40386 11.4583 1.56216V5.09443L8.45728 11.5934L8.3333 11.6569V11.458C8.3333 11.1705 8.09995 10.9371 7.81245 10.9371H2.60415C1.16772 10.9372 0 12.1049 0 13.5413V21.8747C0 23.3111 1.16772 24.4788 2.60415 24.4788H5.72915C6.85518 24.4788 7.81768 23.7601 8.18018 22.7569C9.04688 23.2028 10.2135 23.4372 10.9375 23.4372H20.499C21.6334 23.4372 22.6261 22.6726 22.8594 21.6184C22.9792 21.0747 22.9094 20.5278 22.6719 20.0528C23.4406 19.6663 23.9583 18.8715 23.9583 17.9684C23.9583 17.5997 23.874 17.2465 23.7146 16.9278C24.4833 16.5403 25 15.7465 25 14.8434ZM22.8031 16.1288C22.6021 16.1528 22.4323 16.2892 22.3677 16.4819C22.3042 16.6747 22.3573 16.8861 22.5052 17.0257C22.7698 17.2747 22.9167 17.6101 22.9167 17.9684C22.9167 18.6257 22.4198 19.1778 21.7625 19.2538C21.5615 19.2778 21.3917 19.4142 21.3271 19.6069C21.2636 19.7997 21.3167 20.0111 21.4646 20.1507C21.8074 20.4736 21.9449 20.9267 21.8417 21.3934C21.7136 21.9747 21.149 22.3955 20.499 22.3955H10.9375C10.0917 22.3955 8.6729 21.9986 8.18125 21.5059C8.03228 21.358 7.80728 21.3143 7.61353 21.3934C7.41875 21.4736 7.29165 21.6643 7.29165 21.8747C7.29165 22.7361 6.59062 23.4372 5.72915 23.4372H2.60415C1.74268 23.4372 1.04165 22.7361 1.04165 21.8747V13.5413C1.04165 12.6798 1.74268 11.9788 2.60415 11.9788H7.29165V12.4997C7.29165 12.6799 7.3854 12.8476 7.53955 12.9434C7.69165 13.0351 7.8833 13.0444 8.0458 12.9653L9.08745 12.4444C9.19268 12.3923 9.27705 12.3048 9.32705 12.1976L12.4521 5.42671C12.4833 5.35796 12.5 5.28296 12.5 5.20796V1.84443C12.7167 1.72466 13.0927 1.56216 13.5417 1.56216C14.1125 1.56216 15.625 2.98091 15.625 4.68716C15.625 6.52051 14.6271 9.16318 14.6177 9.18926C14.5573 9.34863 14.5781 9.52886 14.675 9.67051C14.7729 9.81113 14.9333 9.89551 15.1042 9.89551H22.2719C23.1406 9.89551 23.8781 10.5174 23.951 11.3111C24.0063 11.9049 23.7208 12.4695 23.2094 12.7851C23.05 12.883 22.9552 13.0601 22.9625 13.2486C22.9698 13.4372 23.0781 13.6059 23.2448 13.6924C23.6854 13.9164 23.9583 14.358 23.9583 14.8434C23.9583 15.5007 23.4615 16.0528 22.8031 16.1288Z" />
											<path d="M7.8126 11.9795C7.5251 11.9795 7.29175 12.2128 7.29175 12.5003V21.8754C7.29175 22.1629 7.5251 22.3962 7.8126 22.3962C8.1001 22.3962 8.33345 22.1629 8.33345 21.8754V12.5003C8.33345 12.2128 8.1001 11.9795 7.8126 11.9795Z" />
										</g>
										<defs>
											<clipPath id="clip0_114_406">
												<rect width="25" height="25" />
											</clipPath>
										</defs>
									</svg>
								</button>
								<button
									title={info.dislikes.length.toString()}
									onClick={() =>
										onClickEvaluate(
											user.isAuth && info.dislikes.includes(user.id) ? CollectionActions.Empty : CollectionActions.Dislike
										)
									}
									className={styles.evaluate}>
									<Htag tag="h3">{numberCutting(info.dislikes.length)}</Htag>{' '}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="25"
										height="25"
										viewBox="0 0 25 25"
										className={cn({
											[styles.active]: user.isAuth && info.dislikes.includes(user.id),
											[styles.inactive]: !user.isAuth || !info.dislikes.includes(user.id)
										})}>
										<g clipPath="url(#clip0_114_415)">
											<path d="M0 10.1566C0 10.7826 0.248974 11.366 0.678125 11.7962C0.19165 12.3285 -0.0562515 13.042 0.0114746 13.7847C0.133348 15.1087 1.32607 16.1462 2.72812 16.1462L9.1625 16.1462C8.84375 17.1139 8.33335 18.8878 8.33335 20.3128C8.33335 22.5722 10.2531 24.4795 11.4583 24.4795C12.5396 24.4795 13.3136 23.8701 13.3458 23.8451C13.4698 23.7461 13.5417 23.5961 13.5417 23.4378V19.9056L16.5427 13.4066L16.6667 13.3431V13.542C16.6667 13.8295 16.9 14.0629 17.1875 14.0629L22.3958 14.0629C23.8323 14.0628 25 12.8951 25 11.4587L25 3.12535C25 1.68887 23.8323 0.521194 22.3958 0.521194H19.2708C18.1448 0.521194 17.1823 1.23994 16.8198 2.24307C15.9531 1.79722 14.7865 1.56285 14.0625 1.56285L4.50103 1.56285C3.36665 1.56285 2.37393 2.32744 2.14063 3.38159C2.02085 3.92534 2.09062 4.47222 2.32813 4.94722C1.55937 5.33369 1.04165 6.12847 1.04165 7.03159C1.04165 7.40034 1.12603 7.75347 1.2854 8.07222C0.516651 8.45972 0 9.25347 0 10.1566ZM2.19687 8.87119C2.3979 8.84722 2.56772 8.71079 2.63227 8.51807C2.6958 8.32534 2.64268 8.11392 2.49477 7.97432C2.23018 7.72534 2.0833 7.38994 2.0833 7.03159C2.0833 6.37432 2.58018 5.82222 3.23745 5.74619C3.43848 5.72222 3.6083 5.58579 3.67285 5.39307C3.73638 5.20034 3.68325 4.98892 3.53535 4.84932C3.19263 4.52642 3.05513 4.07329 3.15825 3.60659C3.28638 3.02534 3.85098 2.6045 4.50098 2.6045L14.0625 2.6045C14.9083 2.6045 16.3271 3.00137 16.8188 3.49409C16.9677 3.64199 17.1927 3.68575 17.3865 3.60659C17.5812 3.52637 17.7084 3.33574 17.7084 3.12535C17.7084 2.26387 18.4094 1.56285 19.2708 1.56285H22.3958C23.2573 1.56285 23.9583 2.26387 23.9583 3.12535L23.9583 11.4587C23.9583 12.3202 23.2573 13.0212 22.3958 13.0212L17.7084 13.0212V12.5003C17.7084 12.3201 17.6146 12.1524 17.4604 12.0566C17.3083 11.9649 17.1167 11.9556 16.9542 12.0347L15.9125 12.5556C15.8073 12.6077 15.7229 12.6952 15.6729 12.8024L12.5479 19.5733C12.5167 19.642 12.5 19.717 12.5 19.792V23.1556C12.2833 23.2753 11.9073 23.4378 11.4583 23.4378C10.8875 23.4378 9.375 22.0191 9.375 20.3128C9.375 18.4795 10.3729 15.8368 10.3823 15.8107C10.4427 15.6514 10.4219 15.4711 10.325 15.3295C10.2271 15.1889 10.0667 15.1045 9.89585 15.1045L2.72812 15.1045C1.85938 15.1045 1.12188 14.4826 1.04897 13.6889C0.99375 13.0951 1.2792 12.5305 1.79062 12.2149C1.95 12.117 2.04478 11.9399 2.0375 11.7514C2.03022 11.5628 1.92188 11.3941 1.75522 11.3076C1.3146 11.0836 1.0417 10.642 1.0417 10.1566C1.04165 9.49932 1.53853 8.94722 2.19687 8.87119Z" />
											<path d="M17.1874 13.0205C17.4749 13.0205 17.7083 12.7872 17.7083 12.4997V3.12465C17.7083 2.83715 17.4749 2.6038 17.1874 2.6038C16.8999 2.6038 16.6666 2.83715 16.6666 3.12465V12.4997C16.6666 12.7872 16.8999 13.0205 17.1874 13.0205Z" />
										</g>
										<defs>
											<clipPath id="clip0_114_415">
												<rect width="25" height="25" transform="matrix(-1 0 0 -1 25 25)" />
											</clipPath>
										</defs>
									</svg>
								</button>
							</div>
						</IsTruthy>
						<div>
							{!isSelfCollection && user.isAuth && (
								<ButtonGhost
									onClick={() =>
										onClickEvaluate(
											user.id && info.followers.includes(user.id)
												? CollectionActions.Unsubscribe
												: CollectionActions.Subscribe
										)
									}>
									{info.followers.includes(user.id) ? 'Отписаться' : 'Подписаться'}
								</ButtonGhost>
							)}
							{isSelfCollection && <ButtonGhost onClick={() => setStateSettingModal(true)}>Настройки</ButtonGhost>}
							{!info.private && (
								<button className={styles.copyBtn} onClick={onCopy}>
									<Copy />
								</button>
							)}
							{(isSelfCollection || (user.isAuth && user.role == UserRole.ADMIN)) && (
								<ButtonGhost className={styles.deleteButton} onClick={() => setStateDeleteModal(true)} appearance="red">
									Удалить
								</ButtonGhost>
							)}
						</div>
					</div>
					<div>
						<Sort className={styles.sort} sortId={sort} setSort={setSort} />
					</div>
				</div>
			</IsTruthy>
			{moviesId == null ? (
				<div className={styles.nullMovies}>
					<P size="m">В подборке нет фильмов</P>
					<IsTruthy condition={isSelfCollection}>
						<Button className={styles.addButton} onClick={() => setChangedMovies(true)}>
							Добавить фильмы
						</Button>
					</IsTruthy>
				</div>
			) : (
				<>
					{moviesRendered}
					<IsTruthy condition={isSendRequest}>
						<div className="loader">
							<Loader />
						</div>
					</IsTruthy>
				</>
			)}
			<div className={styles.timestamps}>
				<div className={styles.timestamp}>
					<P color="gray">Создана:</P>
					<P color="secondary">
						<span>{dayjs(info.createdAt).format('YYYY-MM-DD в HH:mm')}</span>
					</P>
				</div>
				<div className={styles.timestamp}>
					<P color="gray">Изменена:</P>
					<P color="secondary">
						<span>{dayjs(info.updatedAt).format('YYYY-MM-DD в HH:mm')}</span>
					</P>
				</div>
			</div>
			<DataCollectionModal
				id={info.id}
				route="change"
				defaultColor={info.color}
				defaultName={info.name}
				defaultDescriptionValue={info.description}
				defaultSwitch={info.private}
				closeModal={() => setStateSettingModal(false)}
				stateModal={stateSettingModal}
			/>
			<DeleteModal
				router={router}
				idCollection={info.id}
				name={info.name}
				stateModal={stateDeleteModal}
				closeModal={() => setStateDeleteModal(false)}
			/>
		</>
	);
};
