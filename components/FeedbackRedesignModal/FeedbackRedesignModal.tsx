import { FormEvent, useContext, useEffect, useState } from 'react';
import { FeedbackRedesignModalProps } from './FeedbackRedesignModal.props';
import styles from './FeedbackRedesignModal.module.css';
import cn from 'classnames';
import { Button, Checkbox, Error, Modal, P } from '..';
import { AppContext } from '@/contexts/app.context';
import { API } from '@/helpers/api';
import { setDismissed } from './set-dismissed';

const KEEP_FEATURES = ['Личный кабинет', 'Система рангов с очками и значками', 'Подборки', 'Комментарии', 'Случайный фильм'] as const;

const PLAN_ITEMS = [
	'Улучшенный дизайн под мобильное приложение, а не адаптация сайта',
	'Автоматическое постоянное обновление контента',
	'Улучшенный личный кабинет с оценками, рецензиями и списком просмотров',
	'Более креативная главная страница',
	'Подборки из других сайтов (IMDb, TMDB, Кинопоиск)',
	'Богатая страница фильма со скриншотами, рецензиями Кинопоиска и актёрами',
	'AI для подбора фильма',
	'Возможно, скачивание фильмов и оффлайн-просмотр (не гарантируем)'
] as const;

export const FeedbackRedesignModal = ({ closeModal, stateModal, className, username, onSubmitted }: FeedbackRedesignModalProps): JSX.Element => {
	const { addNotification } = useContext(AppContext);
	const [step, setStep] = useState<1 | 2>(1);
	const [keepFeatures, setKeepFeatures] = useState<string[]>([]);
	const [wishes, setWishes] = useState<string>('');
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [error, setError] = useState<string>();

	useEffect(() => {
		if (!stateModal) {
			setStep(1);
			setError(undefined);
		}
	}, [stateModal]);

	const toggleFeature = (feature: string) => {
		setKeepFeatures((prev) => (prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]));
	};

	const goNext = (e: FormEvent) => {
		e.preventDefault();
		setError(undefined);
		setStep(2);
	};

	const submit = async (e: FormEvent) => {
		e.preventDefault();
		setError(undefined);
		setSubmitting(true);
		try {
			const res = await fetch(API.feedback.newApp, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({
					keepFeatures,
					wishes: wishes.trim() || undefined,
					username: username || undefined
				})
			});
			if (!res.ok) {
				setError('Не удалось отправить. Попробуйте позже.');
				setSubmitting(false);
				return;
			}
			setDismissed();
			addNotification({
				title: 'Спасибо за отзыв!',
				description: 'Ваше мнение поможет сделать новую версию лучше.',
				key: (Date.now() / 100).toString()
			});
			onSubmitted();
		} catch {
			setError('Сеть недоступна. Проверьте подключение.');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Modal
			className={className}
			title={step === 1 ? 'Опрос о редизайне' : 'Что вы хотите видеть?'}
			closeModal={closeModal}
			stateModal={stateModal}
			stateLoad={submitting}>
			{step === 1 ? (
				<form onSubmit={goNext}>
					<span className={styles.stepIndicator}>Шаг 1 из 2</span>
					<p className={cn(styles.intro)}>
						Планируется полная переработка приложения — будет изменён дизайн и функционал. Помогите выбрать, что стоит сохранить.
					</p>
					<div className={styles.featuresList}>
						{KEEP_FEATURES.map((feature) => (
							<Checkbox
								key={feature}
								id={`keep-${feature}`}
								checked={keepFeatures.includes(feature)}
								onChange={() => toggleFeature(feature)}>
								{feature}
							</Checkbox>
						))}
					</div>
					<Button autoFocus>Далее</Button>
					{error && <Error>{error}</Error>}
				</form>
			) : (
				<form onSubmit={submit}>
					<span className={styles.stepIndicator}>Шаг 2 из 2</span>
					<P size="s">Что бы вы хотели видеть в новой версии, чего нет здесь или в других приложениях?</P>
					<textarea
						className={styles.textarea}
						value={wishes}
						onChange={(e) => setWishes(e.target.value)}
						placeholder="Ваши идеи и пожелания…"
						maxLength={2000}
					/>
					<p className={styles.planTitle}>Что уже в планах новой версии:</p>
					<ul className={styles.planList}>
						{PLAN_ITEMS.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
					<div className={styles.actions}>
						<Button type="button" onClick={() => setStep(1)} disabled={submitting}>
							Назад
						</Button>
						<Button type="submit" disabled={submitting}>
							Отправить
						</Button>
					</div>
					{error && <Error>{error}</Error>}
				</form>
			)}
		</Modal>
	);
};
