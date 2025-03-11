import React, { useState, useEffect } from 'react';
import { TextArea } from '@carbon/react';

interface CustomTextAreaProps {
	initialText: string;
	onChange: (text: string) => void;
}

const CustomTextArea: React.FC<CustomTextAreaProps> = ({ initialText, onChange }) => {
	const [text, setText] = useState(initialText);

	useEffect(() => {
		setText(initialText);
	}, [initialText]);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const inputText = e.target.value;
		if (inputText.length <= 200) {
			setText(inputText);
			onChange(inputText);
		}
	};

	return (
		<div>
			<TextArea
				labelText="Edit Response"
				value={text}
				onChange={handleChange}
				maxLength={200}
				helperText={`${text.length}/200 characters`}
			/>
		</div>
	);
};

export default CustomTextArea;
