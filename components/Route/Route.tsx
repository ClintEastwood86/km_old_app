import { RouteProps } from './Route.props';

export const Route = ({ route, router, component }: RouteProps): JSX.Element => {
	if (router.asPath == route) {
		return component;
	}
	return <></>;
};
