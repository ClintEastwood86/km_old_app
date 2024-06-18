import { Dispatch, Ref, RefObject, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

export const useOutsideClick = <Trigger extends HTMLElement = HTMLButtonElement, Exceptions extends HTMLElement = HTMLDivElement>(
	...exceptions: RefObject<Exceptions>[]
): [boolean, Dispatch<SetStateAction<boolean>>, Ref<Trigger>] => {
	const trigger = useRef<Trigger>(null);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleClose = useCallback(
		(e: MouseEvent) => {
			if (!trigger.current) {
				return;
			}
			if (!isOpen) {
				return;
			}
			if (!(e.target instanceof Node)) {
				return;
			}
			if (trigger.current.contains(e.target)) {
				return;
			}
			for (const exc of exceptions) {
				if (!exc.current) continue;
				if (exc.current.contains(e.target)) {
					return;
				}
			}
			setIsOpen(false);
		},
		[exceptions, isOpen, trigger]
	);

	useEffect(() => {
		document.addEventListener('click', handleClose);
		return () => document.removeEventListener('click', handleClose);
	}, [handleClose]);

	return [isOpen, setIsOpen, trigger];
};
