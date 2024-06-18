import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PropsWithChildren } from 'react';

export const SortableItem = <T extends { id: number }>({ props, children }: PropsWithChildren<{ props: T }>) => {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	};

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			{children}
		</div>
	);
};
