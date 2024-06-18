import { UserProps } from './User.props';
import styles from './User.module.css';
import cn from 'classnames';
import Image from 'next/image';
import { AvatarEmpty } from '../AvatarEmpty/AvatarEmpty';
import { Htag, P } from '..';
import parse from 'html-react-parser';
import { useRanks } from '@/hooks/ranks.hook';
import Link from 'next/link';
import { myLoader } from '@/helpers/loader';

export const User = ({ appearance = 'primary', user, className, ...props }: UserProps): JSX.Element => {
	const ranks = useRanks();

	const setAvatar = (src: string | undefined, alt: string): JSX.Element => {
		if (!src) {
			return <AvatarEmpty />;
		}
		return <Image src={process.env.NEXT_PUBLIC_DOMAIN + src} unoptimized loader={myLoader} alt={alt} fill />;
	};

	return (
		<Link href={`/user/${user.id}`} {...props} className={cn(className, styles.user, { [styles.black]: appearance == 'black' })}>
			<div className={styles.avatar}>{setAvatar(user.avatar, user.login)}</div>
			<div className={styles.wrapper}>
				<div className={styles.login}>
					<Htag color="secondary" tag="h3">
						{user.login}
					</Htag>
					{user.awardSelected && parse(user.awardSelected.icon)}
				</div>
				<P className={styles.rank} color="white" size="s">
					{ranks.find((rank) => rank.id == user.rankId)?.name || 'Новичок'}
				</P>
			</div>
		</Link>
	);
};
