import Glide from '@glidejs/glide';

export const sliderProps: Partial<Glide.Options> = {
	breakpoints: {
		560: {
			perView: 2
		},
		465: {
			perView: 1
		}
	},
	rewind: false,
	keyboard: true,
	dragThreshold: 10,
	swipeThreshold: 10,
	perSwipe: '',
	type: 'slider',
	perView: 2.5,
	bound: true
};
