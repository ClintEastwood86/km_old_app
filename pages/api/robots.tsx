import { NextApiRequest, NextApiResponse } from 'next';
import config, { RobotsPath } from '@/meta/robots';

const getPaths = (type: 'Allow' | 'Disallow') => {
	return (acc: string, curr: string): string => {
		return `${acc}\n${type}: ${curr}`;
	};
};

const constructConfig = (acc: string, curr: RobotsPath): string => {
	return `${acc}User-agent: ${curr.userAgent}${curr.disallow?.reduce(getPaths('Disallow'), '')}\n${
		curr.allow ? curr.allow?.reduce(getPaths('Allow'), '') : ''
	}\n`;
};

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
	res.setHeader('Content-Type', 'text/plain');
	const paths = config.paths.reduce(constructConfig, '');
	res.write(
		`User-agent: Yandex\nClean-param: q&sort&date_end&date_start&country&genre /search\n${paths}Host: ${config.host}\nSitemap: ${config.sitemap}`
	);
	res.end();
};

export default handler;
