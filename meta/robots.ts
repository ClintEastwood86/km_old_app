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
	host: process.env.NEXT_PUBLIC_DOMAIN || 'https://kinmov.ru',
	sitemap: `${process.env.NEXT_PUBLIC_DOMAIN}/sitemap.xml`,
	paths: [
		{
			userAgent: '*',
			disallow: ['/admin/', '/api/', '/profile', '/user-agreement', '/404', '/500']
		},
		{
			userAgent: 'Yandex',
			disallow: ['/admin/', '/api/', '/profile', '/user-agreement', '/404', '/500', '/upload/']
		},
		{
			userAgent: 'YandexImages',
			disallow: ['/admin/', '/api/', '/profile', '/user-agreement', '/404', '/500']
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
