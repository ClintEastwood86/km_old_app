import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import { EmojiPickerProps } from './EmojiPicker.props';

export const EmojiPickerCustom = ({ onClick }: EmojiPickerProps) => {
	return (
		<EmojiPicker
			searchDisabled
			onEmojiClick={(info) => onClick(info.unified, info.emoji)}
			emojiStyle={EmojiStyle.GOOGLE}
			skinTonesDisabled
		/>
	);
};
