import { useEffect } from 'react';

export const useScript = (url: string, async = false, inHead = false, timeout?: number) => {
	useEffect(() => {
		const script = document.createElement('script');
		script.src = url;
		script.async = async;
		setTimeout(() => {
			document[inHead ? 'head' : 'body'].appendChild(script);
		}, timeout);
		return () => {
			try {
				document[inHead ? 'head' : 'body'].removeChild(script);
			} catch (error) {
				/* empty */
			}
		};
	}, [url, async, inHead, timeout]);
};
