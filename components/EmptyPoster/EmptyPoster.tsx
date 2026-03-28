import { emptyPosterPhrase } from '@/constants/empty-poster.constants';
import { Htag } from '../Htag/Htag';
import styles from './EmptyPoster.module.css';
import { useState, useEffect } from 'react';
import cn from 'classnames';
import { IsTruthy } from '..';
import { EmptyPosterProps } from './EmptyPoster.props';

export const EmptyPoster = ({ appearance = 'primary', size = 'default', usePhrases = true, className, ...props }: EmptyPosterProps) => {
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		setHydrated(true);
	}, []);

	if (!hydrated) return <></>;

	const getRandomPhrase = () => {
		const index = Math.floor(Math.random() * emptyPosterPhrase.length);
		return emptyPosterPhrase[index] ?? emptyPosterPhrase[0];
	};

	return (
		<div {...props} style={size == 'small' ? { height: '100%' } : {}} className={cn(styles.poster, className, styles[appearance])}>
			<svg
				className={cn({ [styles.smallSvg]: size == 'small' })}
				xmlns="http://www.w3.org/2000/svg"
				width="233"
				height="244"
				viewBox="0 0 233 244"
				fill="none">
				<g filter="url(#filter0_d_1926_157)">
					<path
						d="M68.9976 52.3737L58.4002 48.8335C57.8591 48.6527 57.3394 48.4133 56.8504 48.1195C51.6369 44.9873 45 48.8311 45 54.9132V77.9002V103.609V110.446C45 116.563 45.5453 122.668 46.6294 128.688C47.6817 134.532 49.4281 140.229 51.8316 145.658L53.2484 148.859C56.1306 155.369 59.7829 161.562 64.0777 167.241C67.0519 171.174 70.3584 174.885 73.9265 178.289L75.5317 179.82C78.9127 183.044 82.61 185.92 86.5676 188.403C90.6228 190.948 94.9299 193.067 99.4203 194.727L107.395 197.675L108.633 198.014C113.591 199.371 118.838 199.254 123.73 197.675L129.321 195.204C133.797 193.226 138.091 190.857 142.153 188.126C145.577 185.825 148.825 183.272 151.872 180.49L159.882 173.175L163.328 169.114C169.217 162.174 174.155 154.481 178.013 146.237L178.674 144.823C180.959 139.942 182.779 134.857 184.111 129.634C185.807 122.988 186.834 116.189 187.177 109.338L187.464 103.609L188 86.6716V68.2215V51.2837C188 46.7347 183.057 43.9077 179.136 46.2142L175.731 48.2174C175.342 48.4464 174.934 48.6426 174.512 48.804L167.683 51.4166C161.606 53.7416 155.307 55.4416 148.885 56.4904L136.316 58.5427L124.913 59.4918C115.587 60.2679 106.203 59.9494 96.9513 58.5427L84.4894 56.3203C79.2363 55.3835 74.0586 54.0645 68.9976 52.3737Z"
						stroke="#B5B5B5"
						strokeOpacity="0.32"
						strokeWidth="4"
					/>
					<path
						d="M130.851 98.4805L132.558 95.1677C133.797 92.7618 135.55 90.6581 137.694 89.0059V89.0059C139.439 87.6605 141.428 86.6339 143.534 85.9847V85.9847C145.311 85.437 147.173 85.1543 149.032 85.1543H149.175C151.129 85.1543 153.091 85.4529 154.958 86.0285V86.0285C156.97 86.6489 158.892 87.5922 160.609 88.8103L160.865 88.9913C163.214 90.6569 165.209 92.7715 166.736 95.2129L168.78 98.4805"
						stroke="#B5B5B5"
						strokeOpacity="0.32"
						strokeWidth="4"
						strokeLinecap="round"
					/>
					<path
						d="M85.7473 162.036L87.004 160.401C89.6967 156.897 93.1863 154.087 97.1831 152.203V152.203C99.5421 151.091 102.046 150.317 104.621 149.903L108.108 149.343C110.734 148.921 113.389 148.709 116.049 148.709H117.796C120.385 148.709 122.965 149 125.489 149.576V149.576C128.254 150.207 130.932 151.177 133.461 152.462L133.644 152.555C136.923 154.222 139.929 156.378 142.56 158.95L145.715 162.036"
						stroke="#B5B5B5"
						strokeOpacity="0.32"
						strokeWidth="4"
						strokeLinecap="round"
					/>
					<path
						d="M62.1702 98.4805L63.8764 95.1677C65.1156 92.7618 66.8692 90.6581 69.0127 89.0059V89.0059C70.7583 87.6605 72.7471 86.6339 74.8532 85.9847V85.9847C76.6296 85.437 78.4917 85.1543 80.3506 85.1543H80.4936C82.4474 85.1543 84.4094 85.4529 86.2764 86.0285V86.0285C88.2888 86.6489 90.2104 87.5922 91.9282 88.8103L92.1835 88.9913C94.5324 90.6569 96.528 92.7715 98.0549 95.2129L100.098 98.4805"
						stroke="#B5B5B5"
						strokeOpacity="0.32"
						strokeWidth="4"
						strokeLinecap="round"
					/>
					<path
						d="M81.1344 125.645C81.1344 128.476 78.8397 130.77 76.009 130.77C73.1783 130.77 70.8835 128.476 70.8835 125.645C70.8835 122.814 74.4714 114.882 76.009 110.781C78.0592 115.907 81.1344 122.814 81.1344 125.645Z"
						fill="#B5B5B5"
						fillOpacity="0.32"
					/>
				</g>
				<defs>
					<filter
						id="filter0_d_1926_157"
						x="0"
						y="0.390137"
						width="233"
						height="243.562"
						filterUnits="userSpaceOnUse"
						colorInterpolationFilters="sRGB">
						<feFlood floodOpacity="0" result="BackgroundImageFix" />
						<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
						<feOffset />
						<feGaussianBlur stdDeviation="21.5" />
						<feComposite in2="hardAlpha" operator="out" />
						<feColorMatrix type="matrix" values="0 0 0 0 0.12549 0 0 0 0 0.129412 0 0 0 0 0.27451 0 0 0 0.25 0" />
						<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1926_157" />
						<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1926_157" result="shape" />
					</filter>
				</defs>
			</svg>
			<IsTruthy condition={usePhrases}>
				<Htag tag="h3" className={cn(styles.phrase, styles[size])}>
					{getRandomPhrase()}
				</Htag>
			</IsTruthy>
		</div>
	);
};
