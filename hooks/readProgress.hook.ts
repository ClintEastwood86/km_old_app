import { useEffect, useState } from 'react';

export const useProgress = () => {
	const [progress, setProgress] = useState<number>(0);

	const handleScroll = () => {
		setProgress((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
	};

	useEffect(() => {
		document.addEventListener('scroll', handleScroll, { passive: true, capture: true });

		return () => {
			document.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return progress;
};
