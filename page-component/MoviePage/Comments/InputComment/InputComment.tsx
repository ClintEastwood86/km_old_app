import { AvatarEmpty, EmojiPickerCustom } from '@/components';
import styles from './InputComment.module.css';
import { FormEvent, ForwardedRef, KeyboardEventHandler, forwardRef, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { InputCommentProps } from './InputComment.props';
import cn from 'classnames';
import Image from 'next/image';
import SendIcon from './SendIcon.svg';
import { myLoader } from '@/helpers/loader';
import { AppContext } from '@/contexts/app.context';
import { InputCommentValidateConfig } from './InputCommentValidate.config';
import EmojiSmile from './EmojiSmile.svg';
import { useOutsideClick } from '@/hooks/outsideClick.hook';
import { regExp } from '@/helpers/regexp';
import { API } from '@/helpers/api';
import { CommentCreateDto } from '@/interfaces/comment.interface';
import { isHttpError } from '@/typeguards/error.typeguard';
import { UserContext } from '@/contexts/user.context';

export const InputComment = forwardRef(
	({ parentId, movieId, user, className, ...props }: InputCommentProps, ref: ForwardedRef<HTMLDivElement>) => {
		const [text, setText] = useState<string>('');
		const textarea = useRef<HTMLTextAreaElement>(null);
		const emojiPicker = useRef<HTMLDivElement>(null);
		const { addNotification } = useContext(AppContext);
		const { isAuth } = useContext(UserContext);
		const [isOpenEmojiPicker, setIsOpenEmojiPicker, trigger] = useOutsideClick(emojiPicker);

		const handleSubmit = useCallback(() => {
			if (!isAuth) {
				return addNotification({
					title: 'Авторизируйтесь',
					description: 'Чтобы оставлять комментарии, нужно пройти авторизацию',
					key: 'sendComment'
				});
			}
			const validateResult = validateInput(
				text
					.trim()
					.split(' ')
					.filter((word) => word !== '')
					.join(' ')
			);
			if (!validateResult.status) {
				return;
			}
			sendRequest(text);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [text]);

		const sendRequest = async (content: string) => {
			const body: CommentCreateDto = {
				content,
				movieId,
				parentId
			};
			const response = await fetch(API.comments.create, {
				credentials: 'include',
				method: 'post',
				body: JSON.stringify(body),
				headers: { 'Content-Type': 'application/json' }
			});
			const comment: unknown = await response.json();
			if (isHttpError(comment)) {
				console.error(comment);
				return addNotification({ title: comment.message, description: comment.data.error, key: (Date.now() / 100).toString() });
			}
			setText('');
			addNotification({
				title: 'Комментарий принят на проверку',
				description: 'Комментарий будет опубликован, после проверки модерацией',
				key: (Date.now() / 100).toString()
			});
		};

		useEffect(() => {
			if (!textarea.current) return;
			const onKeydown = (e: KeyboardEvent) => {
				if ((e.code == 'Enter' && e.shiftKey) || e.code !== 'Enter') {
					return;
				}
				if (e.code == 'Enter') {
					e.preventDefault();
					handleSubmit();
				}
			};
			textarea.current.addEventListener('keydown', onKeydown);
			// eslint-disable-next-line react-hooks/exhaustive-deps
			return () => textarea.current?.removeEventListener('keydown', onKeydown);
		}, [handleSubmit]);

		const addEmoji = (unified: string): void => {
			setText((text) => text + `(:${unified}:)`);
			textarea.current?.focus();
		};

		const validateInput = (value: string): { status: boolean; value: string } => {
			const lengthWithoutEmoji = value.replaceAll(regExp.findCodeEmoji, ' ').length;
			setText(value);
			if (lengthWithoutEmoji > InputCommentValidateConfig.maxLength) {
				addNotification({
					title: 'Превышена допустимая длина комментария',
					description: `Ваш комментарий превышает допустимую длину на ${lengthWithoutEmoji - InputCommentValidateConfig.maxLength}`,
					key: (Math.random() * Math.random()).toString()
				});
				return { status: false, value: '' };
			}

			if (lengthWithoutEmoji < InputCommentValidateConfig.minLength) {
				addNotification({
					title: `Минимальная длина комментария – ${InputCommentValidateConfig.minLength} символов`,
					key: (Math.random() * Math.random()).toString()
				});
				return { status: false, value: '' };
			}

			return { status: true, value };
		};

		const onInput = (e: FormEvent<HTMLTextAreaElement>) => {
			if (!(e.target instanceof HTMLTextAreaElement)) return;
			setText(e.target.value);
		};

		const onKeyDownTextArea: KeyboardEventHandler = (key) => {
			if (key.code !== 'Backspace' || !textarea.current || textarea.current.value.slice(-2) !== ':)') return;
			const lastEmoji = textarea.current.value.match(regExp.findCodeEmoji)?.at(-1);
			if (!lastEmoji || textarea.current.value.slice(lastEmoji.length * -1) !== lastEmoji) {
				return;
			}
			key.preventDefault();
			setText(textarea.current.value.slice(0, lastEmoji.length * -1));
		};

		return (
			<div ref={ref} {...props} className={cn(styles.inputComment, className)}>
				<div className={styles.avatar}>
					{user.isAuth && user.avatar ? (
						<Image
							unoptimized
							loader={myLoader}
							fill
							priority={true}
							src={process.env.NEXT_PUBLIC_DOMAIN + user.avatar}
							alt={user.login}
						/>
					) : (
						<AvatarEmpty />
					)}
				</div>
				<div className={styles.wrapper}>
					<div className={styles.inputWrapper}>
						<textarea
							rows={4}
							placeholder="Ваш отзыв о фильме..."
							className={styles.input}
							ref={textarea}
							value={text}
							onInput={onInput}
							onKeyDown={onKeyDownTextArea}
						/>
						<button onClick={() => setIsOpenEmojiPicker((v) => !v)} ref={trigger} className={styles.emojiButton}>
							<EmojiSmile />
						</button>
						{isOpenEmojiPicker && (
							<div ref={emojiPicker} className={styles.emojiPicker}>
								<EmojiPickerCustom onClick={addEmoji} />
							</div>
						)}
					</div>
					<button onClick={handleSubmit} title="Отправить комментарий" className={styles.send}>
						<SendIcon />
					</button>
				</div>
			</div>
		);
	}
);
