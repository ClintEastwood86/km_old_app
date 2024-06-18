import { NextApiRequest, NextApiResponse } from 'next';
import { getSitemap } from '@/meta/sitemap';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	res.setHeader('Content-Type', 'text/xml');
	res.write(await getSitemap());
	res.end();
};

export default handler;
