import { CommentActions } from '@/interfaces/comment.interface';
import { CollectionActions } from '@/interfaces/collection.interface';

export const API = {
	users: {
		register: process.env.NEXT_PUBLIC_API + '/users/register',
		login: process.env.NEXT_PUBLIC_API + '/users/login',
		info: process.env.NEXT_PUBLIC_API + '/users/info',
		uploadAvatar: process.env.NEXT_PUBLIC_API + '/users/upload/avatar',
		getIdOpenAwards: process.env.NEXT_PUBLIC_API + '/users/awards',
		forgotPassword: process.env.NEXT_PUBLIC_API + '/users/forgotPassword',
		changeLogin: process.env.NEXT_PUBLIC_API + '/users/change/login',
		changePassword: process.env.NEXT_PUBLIC_API + '/users/change/password',
		changePasswordWithToken: process.env.NEXT_PUBLIC_API + '/users/change/password/withToken',
		changeNotification: process.env.NEXT_PUBLIC_API + '/users/change/notification',
		changeEmail: process.env.NEXT_PUBLIC_API + '/users/change/email',
		changeAward: process.env.NEXT_PUBLIC_API + '/users/change/award/',
		deleteAccount: process.env.NEXT_PUBLIC_API + '/users/delete',
		getPaths: process.env.NEXT_PUBLIC_API + '/users/paths',
		getUserOtherInfo: process.env.NEXT_PUBLIC_API + '/users/user/',
		hasMarkInMovie: process.env.NEXT_PUBLIC_API + '/users/mark/has/',
		toggleMark: process.env.NEXT_PUBLIC_API + '/users/mark/',
		confirmAccount: process.env.NEXT_PUBLIC_API + '/users/confirm/',
		addPoints: process.env.NEXT_PUBLIC_API + '/users/addPoints',
		block: process.env.NEXT_PUBLIC_API + '/users/block/',
		unblock: process.env.NEXT_PUBLIC_API + '/users/unblock/',
		getUsersForAdminPanel: process.env.NEXT_PUBLIC_API + '/users/admin/users'
	},
	ranks: {
		get: process.env.NEXT_PUBLIC_API + '/ranks/get/',
		getHistory: process.env.NEXT_PUBLIC_API + '/ranks/history/get',
		create: process.env.NEXT_PUBLIC_API + '/ranks/create/',
		update: process.env.NEXT_PUBLIC_API + '/ranks/update/'
	},
	points: {
		get: process.env.NEXT_PUBLIC_API + '/points/get/'
	},
	awards: {
		get: process.env.NEXT_PUBLIC_API + '/awards/get/',
		create: process.env.NEXT_PUBLIC_API + '/awards/create/',
		update: process.env.NEXT_PUBLIC_API + '/awards/update/',
		updatePositions: process.env.NEXT_PUBLIC_API + '/awards/update/positions',
		delete: process.env.NEXT_PUBLIC_API + '/awards/delete/'
	},
	movies: {
		getPaths: process.env.NEXT_PUBLIC_API + '/movies/paths',
		getGenres: process.env.NEXT_PUBLIC_API + '/movies/genres',
		getCountries: process.env.NEXT_PUBLIC_API + '/movies/countries',
		get: process.env.NEXT_PUBLIC_API + '/movies/get/',
		getMarks: process.env.NEXT_PUBLIC_API + '/movies/marks',
		getMarksId: process.env.NEXT_PUBLIC_API + '/movies/marks/id',
		getRandom: process.env.NEXT_PUBLIC_API + '/movies/random',
		getTops: process.env.NEXT_PUBLIC_API + '/movies/top',
		getByQueries: process.env.NEXT_PUBLIC_API + '/movies/search/byQuery',
		getByArray: process.env.NEXT_PUBLIC_API + '/movies/get/byArray',
		websocket: process.env.NEXT_PUBLIC_WSS + '/movies'
	},
	comments: {
		getByMovieId: process.env.NEXT_PUBLIC_API + '/comments/get/byMovie/',
		getChildren: process.env.NEXT_PUBLIC_API + '/comments/get/children/',
		getCount: process.env.NEXT_PUBLIC_API + '/comments/get/count/',
		publish: process.env.NEXT_PUBLIC_API + '/comments/publish/',
		reject: process.env.NEXT_PUBLIC_API + '/comments/reject/',
		create: process.env.NEXT_PUBLIC_API + '/comments/create',
		getCommentsForAdminPanel: process.env.NEXT_PUBLIC_API + '/comments/admin/get',
		setAction: (commentId: number, actionId: CommentActions) => `${process.env.NEXT_PUBLIC_API}/comments/actions/${commentId}/${actionId}`
	},
	collections: {
		create: process.env.NEXT_PUBLIC_API + '/collections/create',
		change: process.env.NEXT_PUBLIC_API + '/collections/change/',
		delete: process.env.NEXT_PUBLIC_API + '/collections/delete/',
		setMovies: process.env.NEXT_PUBLIC_API + '/collections/movies/',
		get: process.env.NEXT_PUBLIC_API + '/collections/get/',
		getPaths: process.env.NEXT_PUBLIC_API + '/collections/paths/',
		find: process.env.NEXT_PUBLIC_API + '/collections/find',
		getNew: process.env.NEXT_PUBLIC_API + '/collections/new',
		getPopular: process.env.NEXT_PUBLIC_API + '/collections/popular',
		getSubscs: process.env.NEXT_PUBLIC_API + '/collections/subscs',
		getBestByMovie: process.env.NEXT_PUBLIC_API + '/collections/best/',
		setAction: (id: number, action: CollectionActions) => `${process.env.NEXT_PUBLIC_API}/collections/actions/${id}/${action}`
	},
	bonus: {
		create: process.env.NEXT_PUBLIC_API + '/bonus/create',
		getCommonMultiplier: process.env.NEXT_PUBLIC_API + '/bonus/common/',
		getHolidays: process.env.NEXT_PUBLIC_API + '/bonus/holidays'
	},
	partners: {
		vibix: {
			getMovie: 'https://vibix.org/api/v1/publisher/videos/kp/'
		}
	}
};
