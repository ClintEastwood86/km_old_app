import { DetailedHTMLProps, InputHTMLAttributes, ReactNode } from 'react';
import { FieldError } from 'react-hook-form';

export interface CheckboxProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
	id: string;
	children: ReactNode;
	error?: FieldError;
	title?: string;
}
