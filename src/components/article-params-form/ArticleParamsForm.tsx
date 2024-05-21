import { useState, useRef, useEffect } from 'react';
import { ArrowButton } from 'components/arrow-button';
import { Button } from 'components/button';
import { Text } from 'components/text';
import { Select } from 'components/select';
import { RadioGroup } from 'components/radio-group';
import { Separator } from 'components/separator';
import {
	OptionType,
	ArticleStateType,
	backgroundColors,
	fontColors,
	fontFamilyOptions,
	fontSizeOptions,
	contentWidthArr,
} from 'src/constants/articleProps';

import clsx from 'clsx';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	defaultSettings: ArticleStateType;
	onApply: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	defaultSettings,
	onApply,
}: ArticleParamsFormProps) => {
	const rootRef = useRef<HTMLDivElement | null>(null);
	const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
	const [formState, setFormState] = useState<ArticleStateType>(defaultSettings);

	useEffect(() => {
		if (isFormOpen) {
			document.addEventListener('click', handleClickOutside);
			return () => {
				document.removeEventListener('click', handleClickOutside);
			};
		}
	}, [isFormOpen]);

	const handleClickOutside = (event: MouseEvent) => {
		if (event.target instanceof HTMLElement) {
			const isOutside =
				document.contains(event.target) &&
				!rootRef.current?.contains(event.target);
			if (isOutside) {
				setIsFormOpen(false);
			}
		}
	};

	const toggleFormOpen = () => {
		setIsFormOpen(!isFormOpen);
	};

	const handleChange = (prop: keyof ArticleStateType, value: OptionType) => {
		setFormState((prevState) => ({ ...prevState, [prop]: value }));
	};

	return (
		<div ref={rootRef}>
			<ArrowButton onClick={toggleFormOpen} isOpen={isFormOpen} />
			<aside
				className={clsx(styles.container, {
					[styles.container_open]: isFormOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={(e) => {
						e.preventDefault();
						onApply(formState);
					}}>
					<Text as='h2' size={31} weight={800} uppercase>
						Задайте параметры
					</Text>
					<Select
						title='Шрифт'
						options={fontFamilyOptions}
						selected={formState.fontFamilyOption}
						onChange={(option) => handleChange('fontFamilyOption', option)}
					/>
					<RadioGroup
						title='Размер шрифта'
						name='fontSize'
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						onChange={(option) => handleChange('fontSizeOption', option)}
					/>
					<Select
						title='Цвет шрифта'
						options={fontColors}
						selected={formState.fontColor}
						onChange={(option) => handleChange('fontColor', option)}
					/>
					<Separator />
					<Select
						title='Цвет фона'
						options={backgroundColors}
						selected={formState.backgroundColor}
						onChange={(option) => handleChange('backgroundColor', option)}
					/>
					<Select
						title='Ширина контента'
						options={contentWidthArr}
						selected={formState.contentWidth}
						onChange={(option) => handleChange('contentWidth', option)}
					/>
					<div className={styles.bottomContainer}>
						<Button
							title='Сбросить'
							type='reset'
							onClick={() => {
								setFormState(defaultSettings);
								onApply(defaultSettings);
								//setIsOpen(false);
							}}
						/>
						<Button title='Применить' type='submit' />
					</div>
				</form>
			</aside>
		</div>
	);
};
