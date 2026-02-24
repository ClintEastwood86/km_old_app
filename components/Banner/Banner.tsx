import Link from 'next/link';
import { BannerProps } from './Banner.props';
import Image from 'next/image';
import cn from 'classnames';
import styles from './Banner.module.css';
import { bannerImages } from './banners.constants';

export const Banner = ({ type, className, ...props }: BannerProps) => {
	const getImage = (): JSX.Element => {
		switch (type) {
			case 'long':
				return (
					<Image unoptimized loader={() => bannerImages.long} src={bannerImages.long} alt="Партнер" loading="eager" fill priority />
				);
			case 'fullscreen':
				return (
					<Image
						unoptimized
						loader={() => bannerImages.fullscreen}
						src={bannerImages.fullscreen}
						alt="Партнер"
						loading="eager"
						fill
						priority
					/>
				);
			default:
				return <></>;
		}
	};

	return (
		<div {...props} className={cn(className, styles.banner, styles[type])}>
			<Link target="_blank" href={process.env.NEXT_PUBLIC_FONBET_LINK || ''}>
				{getImage()}
			</Link>
		</div>
	);
};
