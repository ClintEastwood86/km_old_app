import { NextApiRequest, NextApiResponse } from 'next';
import { getSitemapCollections } from '@/meta/sitemap';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	res.setHeader('Content-Type', 'text/xml');
	res.write(await getSitemapCollections());
	res.end();
};

export default handler;
