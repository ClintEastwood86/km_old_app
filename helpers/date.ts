import dayjs from 'dayjs';
import { getCorrectDeclination } from './declination';

export const getRalativeDate = (d: string | Date) => {
	const date = new Date(d);
	const dateNow = new Date();
	if (date.getDate() == dateNow.getDate()) {
		return dayjs(date).format('HH:mm');
	}
	const differenceDays = Math.floor((dateNow.getTime() - date.getTime()) / (60 * 60 * 24 * 1000));
	if (dateNow.getDate() == new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).getDate()) {
		return 'Вчера';
	}
	if (differenceDays >= 31 && differenceDays <= 365) {
		const months = Math.floor(differenceDays / 30);
		return `${months} ${getCorrectDeclination(months, ['месяц', 'месяца', 'месяцев'])} назад`;
	}
	if (differenceDays > 365) {
		const years = Math.floor(differenceDays / 365);
		return `${years} ${getCorrectDeclination(years, ['год', 'года', 'лет'])} назад`;
	}
	return `${differenceDays} ${getCorrectDeclination(differenceDays, ['день', 'дня', 'дней'])} назад`;
};
