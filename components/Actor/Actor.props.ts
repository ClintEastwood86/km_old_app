import { IActorShort } from '@/interfaces/actor.interface';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface ActorProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	actor: IActorShort;
}
