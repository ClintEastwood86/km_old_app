import { API } from '@/helpers/api';

const template = `
<url>
	<loc>${`${process.env.NEXT_PUBLIC_DOMAIN}/#route#`}</loc>
</url>
`;

const getMoviesRoutes = async (part: number): Promise<string[]> => {
	const response = await fetch(API.movies.getPaths);
	const aliases: string[] = await response.json();
	return aliases.map((alias) => `movie/${alias}`).slice(50000 * (part - 1), 50000 * part);
};

const getCollectionsRoutes = async (): Promise<string[]> => {
	const response = await fetch(API.collections.getPaths);
	const aliases: string[] = await response.json();
	return aliases.map((alias) => `collection/${alias}`);
};

const getUsersRoutes = async (): Promise<string[]> => {
	const response = await fetch(API.users.getPaths);
	const aliases: string[] = await response.json();
	return aliases.map((alias) => `user/${alias}`);
};

export const getSitemap = async () => {
	return `<?xml version="1.0" encoding="UTF-8"?>
   	<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/siteindex.xsd">
	   <url>
		   <loc>${`${process.env.NEXT_PUBLIC_DOMAIN}/`}</loc>
	   </url>
	   <url>
		   <loc>${`${process.env.NEXT_PUBLIC_DOMAIN}/search/`}</loc>
	   </url>
	   <url>
		   <loc>${`${process.env.NEXT_PUBLIC_DOMAIN}/collections/`}</loc>
	   </url>
	   <url>
		   <loc>${`${process.env.NEXT_PUBLIC_DOMAIN}/blog/awards/`}</loc>
	   </url>
		<url>
			<loc>${`${process.env.NEXT_PUBLIC_DOMAIN}/sitemap-users.xml`}</loc>
		</url>
		<url>
			<loc>${`${process.env.NEXT_PUBLIC_DOMAIN}/sitemap-collections.xml`}</loc>
		</url>
		<url>
			<loc>${`${process.env.NEXT_PUBLIC_DOMAIN}/sitemap-movies.xml`}</loc>
		</url>
	</urlset>
 `;
};

export const getSitemapCollections = async () => {
	return `<?xml version="1.0" encoding="UTF-8"?>
   	<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/siteindex.xsd">
		${(await getCollectionsRoutes()).map((route) => template.replace('#route#', route)).join('')}
	</urlset>
 `;
};

export const getSitemapUsers = async () => {
	return `<?xml version="1.0" encoding="UTF-8"?>
   	<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/siteindex.xsd">
		${(await getUsersRoutes()).map((route) => template.replace('#route#', route)).join('')}
	</urlset>
 `;
};

export const getSitemapMovies = async (part: number | 'main') => {
	if (part == 'main') {
		return `<?xml version="1.0" encoding="UTF-8"?>
   	<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/siteindex.xsd">
		<url>
			<loc>${`${process.env.NEXT_PUBLIC_DOMAIN}/sitemap-movies-1.xml`}</loc>
		</url>
		<url>
			<loc>${`${process.env.NEXT_PUBLIC_DOMAIN}/sitemap-movies-2.xml`}</loc>
		</url>
		<url>
			<loc>${`${process.env.NEXT_PUBLIC_DOMAIN}/sitemap-movies-3.xml`}</loc>
		</url>
		<url>
			<loc>${`${process.env.NEXT_PUBLIC_DOMAIN}/sitemap-movies-4.xml`}</loc>
		</url>
	</urlset>
 `;
	}
	return `<?xml version="1.0" encoding="UTF-8"?>
   	<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/siteindex.xsd">
		${(await getMoviesRoutes(part)).map((route) => template.replace('#route#', route)).join('')}
	</urlset>
 `;
};
