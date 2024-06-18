import { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';

export interface InputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
	label?: string;
	placeholder?: string;
	id: string;
	isPassword?: boolean;
	error?: FieldError;
}
