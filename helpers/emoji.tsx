import { P } from '@/components';
import { regExp } from './regexp';

const getEmoji = (unified: string, key: string | number): JSX.Element => (
	<img
		key={key}
		src={`https://cdn.jsdelivr.net/npm/emoji-datasource-google/img/google/64/${unified}.png`}
		style={{ fontSize: 17, height: 24, width: 24 }}
		alt="emoji"
		loading="eager"
		className="__EmojiPicker__ epr-emoji-img emoji_custom"
	/>
);

export const pasteEmoji = (comment: string): JSX.Element | JSX.Element[] => {
	const emojiCodes = comment.match(regExp.findCodeEmoji);
	if (!emojiCodes || !emojiCodes.length)
		return (
			<P key={comment + Math.random()} color="white">
				{comment}
			</P>
		);
	return comment.split(regExp.findCodeEmoji).reduce<JSX.Element[]>(
		(str, word, index) =>
			str.concat([
				word == '' ? (
					<p key={index + str.length + Math.random()}></p>
				) : (
					<P key={index + str.length + Math.random()} color="white">
						{word}
					</P>
				),
				index < emojiCodes.length ? (
					getEmoji(emojiCodes[index].substring(2, emojiCodes[index].length - 2), index * (Date.now() / 100000))
				) : (
					<p key={index + str.length + Math.random()}></p>
				)
			]),
		[]
	);
};
