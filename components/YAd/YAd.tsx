import { useEffect } from 'react';
import { YAdProps } from './YAd.props';

export const YAd = ({ id }: YAdProps) => {
	useEffect(() => {
		const script = document.createElement('script');
		script.defer = true;
		script.async = true;
		script.innerHTML = `
		window.yaContextCb.push(()=>{
			Ya.Context.AdvManager.render({
				"blockId": "${id}",
				"renderTo": "yandex_rtb_${id}"
			})
		})
		`;

		setTimeout(() => document.body.appendChild(script), 5000);

		return () => {
			try {
				document.body.removeChild(script);
			} catch (error) {
				/** empty */
			}
		};
	}, [id]);

	return <div id={`yandex_rtb_${id}`} />;
};
