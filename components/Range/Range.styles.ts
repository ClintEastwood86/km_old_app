import { CSSProperties } from 'react';

const rail: CSSProperties = {
	height: '9px',
	borderRadius: '19px'
};
const track: CSSProperties = {
	height: '9px',
	borderRadius: '19px',
	background: 'var(--secondary)'
};

const handle: CSSProperties = {
	width: '15px',
	height: '15px',
	borderRadius: '50%',
	background: 'var(--secondary)',
	border: '1px solid var(--secondary)',
	marginTop: '-3px',
	opacity: 1,
	boxShadow: 'rgba(0, 0, 0, 0.3) 0px 0px 3px 2px'
};

export const rangeStyles = {
	handle,
	track,
	rail
};
