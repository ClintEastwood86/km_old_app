import { Input } from '..';
import { TypeConditionItemComponent } from '../ObjectConstructor/ObjectConstructor.props';
import { KeysConditionSetter } from './ConditionSetter.interface';

export const ConditionSetter: Record<KeysConditionSetter, TypeConditionItemComponent> = {
	Number: (onChange) => <Input style={{ marginTop: 0 }} placeholder="Число" type="number" id="number" onChange={onChange} />,
	String: (onChange) => <Input style={{ marginTop: 0 }} placeholder="Строка" type="text" id="text" onChange={onChange} />,
	Date: (onChange) => <Input style={{ marginTop: 0 }} type="date" id="date" onChange={onChange} />,
	Checkbox: (onChange) => <Input style={{ marginTop: 0 }} type="checkbox" id="checkbox" onChange={onChange} />
};
