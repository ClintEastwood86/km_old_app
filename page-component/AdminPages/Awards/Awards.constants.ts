import { ConditionSetter } from '@/components/ConditionSetter/ConditionSetter';
import { TypeConditionConfigItem } from '@/components/ObjectConstructor/ObjectConstructor.props';

export const userConditionModelConfig: TypeConditionConfigItem = {
	id: {
		equals: ConditionSetter.Number,
		gt: ConditionSetter.Number,
		gte: ConditionSetter.Number,
		lt: ConditionSetter.Number,
		lte: ConditionSetter.Number,
		not: ConditionSetter.Number
	},
	createdAt: {
		equals: ConditionSetter.Date,
		gt: ConditionSetter.Date,
		gte: ConditionSetter.Date,
		lt: ConditionSetter.Date,
		lte: ConditionSetter.Date,
		not: ConditionSetter.Date
	},
	email: {
		equals: ConditionSetter.String,
		startsWith: ConditionSetter.String,
		endsWith: ConditionSetter.String,
		contains: ConditionSetter.String,
		not: ConditionSetter.String
	},
	login: {
		equals: ConditionSetter.String,
		startsWith: ConditionSetter.String,
		endsWith: ConditionSetter.String,
		contains: ConditionSetter.String,
		not: ConditionSetter.String
	},
	avatar: {
		isNull: ConditionSetter.Checkbox,
		isNotNull: ConditionSetter.Checkbox
	},
	notification: {
		equals: ConditionSetter.Checkbox
	},
	varified: {
		equals: ConditionSetter.Checkbox
	},
	userPoints: {
		lte: ConditionSetter.Number,
		gte: ConditionSetter.Number
	},
	rank: {
		id: {
			equals: ConditionSetter.Number,
			gt: ConditionSetter.Number,
			gte: ConditionSetter.Number,
			lt: ConditionSetter.Number,
			lte: ConditionSetter.Number,
			not: ConditionSetter.Number
		},
		name: {
			equals: ConditionSetter.String,
			startsWith: ConditionSetter.String,
			endsWith: ConditionSetter.String,
			contains: ConditionSetter.String,
			not: ConditionSetter.String
		},
		points: {
			equals: ConditionSetter.Number,
			gt: ConditionSetter.Number,
			gte: ConditionSetter.Number,
			lt: ConditionSetter.Number,
			lte: ConditionSetter.Number,
			not: ConditionSetter.Number
		},
		watchedMinutes: {
			equals: ConditionSetter.Number,
			gt: ConditionSetter.Number,
			gte: ConditionSetter.Number,
			lt: ConditionSetter.Number,
			lte: ConditionSetter.Number,
			not: ConditionSetter.Number
		}
	}
};
