import { UserModelShort } from '@/interfaces/user.interface';
import { AnchorHTMLAttributes } from 'react';

export interface UserProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'ref'> {
	user: UserModelShort;
	appearance?: 'primary' | 'black';
}
