import React, { useState, useEffect } from 'react';
import { TextArea } from '@carbon/react';
import { WarningAlt } from "@carbon/react/icons";
import styles from "./text-area.scss";

interface CustomTextAreaProps {
	initialText: string;
	onChange: (text: string) => void;
}
  
const MAX_CHAR_LIMIT = 320;
  
const CustomTextArea: React.FC<CustomTextAreaProps> = ({ initialText, onChange }) => {
	const [text, setText] = useState(initialText);
	const [isOverLimit, setIsOverLimit] = useState(false);

	useEffect(() => {
		setText(initialText);
		setIsOverLimit(initialText.length > MAX_CHAR_LIMIT);
	}, [initialText]);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const inputText = e.target.value;
		setText(inputText);
		onChange(inputText);
		setIsOverLimit(inputText.length > MAX_CHAR_LIMIT);
	};

	return (
		<div className={styles.container}>
		<TextArea
			labelText="Edit Response"
			value={text}
			onChange={handleChange}
			invalid={isOverLimit}
			invalidText={
			isOverLimit ? (
				<div className={styles.errorMessage}>
				<WarningAlt size={16} className={styles.warningIcon} />
				<span>Character limit exceeded ({text.length}/{MAX_CHAR_LIMIT})</span>
				</div>
			) : ""
			}
		/>
		{!isOverLimit && (
			<p className={styles.characterCount}>{text.length}/{MAX_CHAR_LIMIT} characters</p>
		)}
		</div>
	);
};
  
export default CustomTextArea;