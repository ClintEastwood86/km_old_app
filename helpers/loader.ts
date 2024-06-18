import { ImageLoaderProps } from 'next/image';

export const myLoader = ({ src }: ImageLoaderProps) => {
	return process.env.NEXT_PUBLIC_DOMAIN + src;
};
