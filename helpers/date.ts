import dayjs from 'dayjs';
import { getCorrectDeclination } from './declination';

export const getRelativeDate = (d: string | Date) => {
	const date = dayjs(d);
	const dateNow = dayjs();
	const differenceDays = dateNow.diff(date, 'day', true);

	if (date.isSame(dateNow, 'day')) {
		return date.format('HH:mm');
	}

	if (differenceDays < 1 && dateNow.subtract(1, 'day').isSame(date, 'day')) {
		return 'Вчера';
	}

	if (differenceDays >= 31 && differenceDays <= 365) {
		const months = dateNow.diff(date, 'month');
		return `${months} ${getCorrectDeclination(months, ['месяц', 'месяца', 'месяцев'])} назад`;
	}

	if (differenceDays > 365) {
		const years = dateNow.diff(date, 'year');
		return `${years} ${getCorrectDeclination(years, ['год', 'года', 'лет'])} назад`;
	}

	return `${Math.floor(differenceDays)} ${getCorrectDeclination(Math.floor(differenceDays), ['день', 'дня', 'дней'])} назад`;
};
