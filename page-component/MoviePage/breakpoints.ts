import Glide from '@glidejs/glide';

export const breakpoints: Record<number, Partial<Glide.Options>> = {
	1250: {
		perView: 3
	},
	960: {
		perView: 3,
		gap: 20
	},
	570: {
		perView: 2,
		gap: 20
	}
};
