import { NextApiRequest, NextApiResponse } from 'next';
import { getSitemapMovies } from '@/meta/sitemap';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	res.setHeader('Content-Type', 'text/xml');
	res.write(await getSitemapMovies(1));
	res.end();
};

export default handler;
