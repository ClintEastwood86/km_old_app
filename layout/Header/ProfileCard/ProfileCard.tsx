import { ProfileCardProps } from './ProfileCard.props';
import styles from './ProfileCard.module.css';
import stylesHeader from '../Header.module.css';
import cn from 'classnames';
import { AvatarEmpty, Htag, P } from '@/components';
import { useEffect, useState } from 'react';
import { ProfileMenu } from '../ProfileMenu/ProfileMenu';
import Image from 'next/image';
import parse from 'html-react-parser';
import { myLoader } from '@/helpers/loader';

export const ProfileCard = ({ icon, className, login, rank, avatar, ...props }: ProfileCardProps): JSX.Element => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const closeCard = (e: MouseEvent) => {
		!document.querySelector('.' + stylesHeader.header)?.innerHTML.includes((e.target as Element).innerHTML) && setIsOpen(false);
	};

	useEffect(() => {
		isOpen && window.addEventListener('click', closeCard);

		return () => {
			window.removeEventListener('click', closeCard);
		};
	}, [isOpen]);

	return (
		<>
			<div {...props} onClick={() => setIsOpen((state) => !state)} className={cn(className, styles.profileCard)}>
				<div className={styles.avatar}>
					{avatar ? (
						<Image unoptimized loader={myLoader} fill priority={true} src={process.env.NEXT_PUBLIC_DOMAIN + avatar} alt={login} />
					) : (
						<AvatarEmpty />
					)}
				</div>
				<div className={styles.content}>
					<div className={styles.wrapper}>
						<div className={styles.loginWrapper}>
							<Htag color="secondary" tag="h3">
								{login}
							</Htag>
							{icon && parse(icon)}
						</div>
						<button style={{ transition: '.3s all ease' }} className={cn({ [styles.rotate]: !isOpen })}>
							<svg xmlns="http://www.w3.org/2000/svg" width="11" height="6" viewBox="0 0 11 6" fill="none">
								<path
									d="M2.38419e-07 5.30818C2.38419e-07 5.13603 0.0691824 4.983 0.207547 4.8491L5.01078 0.20085C5.14915 0.0669498 5.30728 0 5.48518 0C5.66307 0 5.83109 0.0669498 5.98922 0.20085L10.7925 4.8491C10.9308 4.983 11 5.14559 11 5.33688C11 5.52816 10.9308 5.68119 10.7925 5.79596C10.6541 5.91073 10.496 5.97768 10.3181 5.99681C10.1402 6.01594 9.98203 5.94899 9.84367 5.79596L5.51482 1.6068L1.18598 5.79596C1.04762 5.92986 0.879605 5.99681 0.681941 5.99681C0.484277 5.99681 0.326146 5.92986 0.207547 5.79596C0.0691824 5.6238 2.38419e-07 5.46121 2.38419e-07 5.30818Z"
									fill="#DEDEDE"
								/>
							</svg>
						</button>
					</div>
					<P className={styles.rating} color="grayLight" size="s">
						{rank}
					</P>
				</div>
			</div>
			{isOpen && <ProfileMenu className={styles.profileMenu} />}
		</>
	);
};
