export const adBlockIsEnabled = async (): Promise<boolean> => {
	try {
		const domain = process.env.NEXT_PUBLIC_TEST_ADS_DOMAIN;
		if (!domain) {
			return true;
		}
		await fetch(domain, { method: 'HEAD' });
		return false;
	} catch (error) {
		return true;
	}
};
