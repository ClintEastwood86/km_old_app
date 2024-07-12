export const adBlockIsEnabled = async (): Promise<boolean> => {
	const sleep = (ms: number) => {
		return new Promise((res) => {
			setTimeout(() => res(null), ms);
		});
	};

	try {
		const domain = process.env.NEXT_PUBLIC_TEST_ADS_DOMAIN;
		if (!domain) {
			return true;
		}
		for (let i = 0; i <= 3; i++) {
			await sleep(1000);
			await fetch(domain, { method: 'HEAD' });
		}
		return false;
	} catch (error) {
		console.log('error', error);
		return true;
	}
};
