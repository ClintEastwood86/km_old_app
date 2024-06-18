export interface RobotsPath {
	userAgent: string;
	allow?: string[];
	disallow?: string[];
}

interface RobotsConfig {
	host: string;
	sitemap: string;
	paths: RobotsPath[];
}

const config: RobotsConfig = {
	host: process.env.NEXT_PUBLIC_DOMAIN || 'https://kmovies.ru',
	sitemap: `${process.env.NEXT_PUBLIC_DOMAIN}/sitemap.xml`,
	paths: [
		{
			userAgent: '*',
			disallow: ['/']
		},
		{
			userAgent: 'Yandex',
			disallow: ['/']
		},
		{
			userAgent: 'YandexImages',
			disallow: ['/']
		},
		{
			userAgent: 'StackRambler',
			disallow: ['/']
		},
		{
			userAgent: 'googlebot-image',
			disallow: ['/']
		},
		{
			userAgent: 'psbot',
			disallow: ['/']
		},
		{
			userAgent: 'yahoo-mmcrawler',
			disallow: ['/']
		}
	]
};

export default config;
