import { NextRouter } from 'next/router';

export interface RouteProps {
	route: string;
	router: NextRouter;
	component: JSX.Element;
}
