export interface IViewportConfig {
	viewport: number;
	elements: number;
}

// с меньшего к большему
export const displayedCollectionsConfig: IViewportConfig[] = [
	{
		viewport: 640,
		elements: 3
	},
	{
		viewport: 960,
		elements: 6
	},
	{
		viewport: 1000,
		elements: 8
	},
	{
		viewport: 1250,
		elements: 6
	}
];

export const displayedMoviesConfig: IViewportConfig[] = [
	{
		viewport: 560,
		elements: 6
	},
	{
		viewport: 1250,
		elements: 4
	}
];
