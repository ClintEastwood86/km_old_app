import '@/styles/globals.css';
import '@/styles/range.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { keywords } from '@/configs/seo.config';
import ym, { YMInitializer } from 'react-yandex-metrika';
import { useEffect } from 'react';

export default function App({ Component, pageProps, router }: AppProps) {
	useEffect(() => {
		router.events.on('routeChangeComplete', (url: string) => {
			if (typeof window == undefined) {
				return;
			}
			ym('hit', url);
		});
	}, [router.events]);

	return (
		<>
			<Head>
				<title>KingMovies</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta property="og:url" content={process.env.NEXT_PUBLIC_DOMAIN + router.asPath} />
				<meta property="og:type" content="website" />
				<meta property="og:image" content="/og_preview.png" />
				<meta property="og:locale" content="ru_RU" />
				<meta name="keywords" content={keywords.main.join(' ')} />
				<meta property="theme-color" content="#FCB74F" />
				<meta name="turbo-verification" content="a684eceee76fc522773286a895bc8436" />
				<link rel="preconnect" href="https://mc.yandex.ru" />
				<link rel="icon" href="/favicon.ico" type="image/x-icon" />
				<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
			</Head>
			<YMInitializer options={{ webvisor: true, defer: true }} accounts={[Number(process.env.NEXT_PUBLIC_YM_ACCOUNT_ID)]} version="2" />
			<Component {...pageProps} />
		</>
	);
}
