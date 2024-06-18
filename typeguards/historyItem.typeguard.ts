import { HistoryItemNotUsedTemplate, HistoryItemUsesTemplate } from '@/interfaces/rank.interface';

export const isHistoryItemUsesTemplate = (
	historyItem: HistoryItemNotUsedTemplate | HistoryItemUsesTemplate
): historyItem is HistoryItemUsesTemplate => {
	return 'pointsItemId' in historyItem && !!historyItem.pointsItemId;
};
