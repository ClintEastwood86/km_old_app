import { NextApiRequest, NextApiResponse } from 'next';
import { getSitemapUsers } from '@/meta/sitemap';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	res.setHeader('Content-Type', 'text/xml');
	res.write(await getSitemapUsers());
	res.end();
};

export default handler;
