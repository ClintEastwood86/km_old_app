const nextConfig = {
	webpack(config, options) {
		config.module.rules.push({
			loader: '@svgr/webpack',
			issuer: /\.[jt]sx?$/,
			options: {
				prettier: false,
				svgo: true,
				svgoConfig: {
					plugins: [
						{
							name: 'preset-default',
							params: {
								override: {
									removeViewBox: false
								}
							}
						}
					]
				},
				titleProp: true
			},
			test: /\.svg$/
		});
		return config;
	},
	rewrites: () => {
		return [
			{
				source: '/robots.txt',
				destination: '/api/robots'
			},
			{
				source: '/sitemap.xml',
				destination: '/api/sitemap'
			},
			{
				source: '/sitemap-users.xml',
				destination: '/api/sitemap-users'
			},
			{
				source: '/sitemap-collections.xml',
				destination: '/api/sitemap-collections'
			},
			{
				source: '/sitemap-movies.xml',
				destination: '/api/sitemap-movies'
			},
			{
				source: '/sitemap-movies-1.xml',
				destination: '/api/sitemap-movies-1'
			},
			{
				source: '/sitemap-movies-2.xml',
				destination: '/api/sitemap-movies-2'
			},
			{
				source: '/sitemap-movies-3.xml',
				destination: '/api/sitemap-movies-3'
			},
			{
				source: '/sitemap-movies-4.xml',
				destination: '/api/sitemap-movies-4'
			}
		];
	}
};

module.exports = nextConfig;
