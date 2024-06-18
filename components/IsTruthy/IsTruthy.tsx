import { IsTruthyProps } from './IsTruthy.props';

export const IsTruthy = ({ children, condition }: IsTruthyProps): JSX.Element => (condition ? <>{children}</> : <></>);
