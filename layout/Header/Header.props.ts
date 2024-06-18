import { UserModelShort } from '@/interfaces/user.interface';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface HeaderProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	containerClassStyle: string;
	user: UserModelShort | null;
	header: 'default' | 'admin';
}
