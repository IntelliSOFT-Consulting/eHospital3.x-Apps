import React, { useState } from 'react';
import styles from '../ai-model/ai-model.scss'
import { Tile, Dropdown } from '@carbon/react';
import { TextInput } from '@carbon/react';

interface FeedbackProps {
	title: string;
	onReasonSelect: (reason: string | null) => void;
}

const Feedback: React.FC<FeedbackProps> = ({ title, onReasonSelect }) => {
	const [selectedItem, setSelectedItem] = useState(null);
	const [otherReason, setOtherReason] = useState("");

	const items = [
		{ text: 'Dissatisfied with the response' },
		{ text: 'Missing information' },
		{ text: "Other" }
	];

	const handleSelection = ({ selectedItem }) => {
		setSelectedItem(selectedItem);
		if (selectedItem.text !== "Other") {
			onReasonSelect(selectedItem.text);
		} else {
			onReasonSelect(null);
		}
	};

	const handleOtherReasonChange = (e) => {
		const value = e.target.value;
		setOtherReason(value);
		onReasonSelect(value.trim() ? value : null);
	};

	return (
		<div>
			<Tile className={styles.feedback}>
				<h1 className={styles.title}>{title}</h1>
				<Dropdown
					items={items}
					itemToString={item => item ? item.text : ''}
					label="Select"
					onChange={handleSelection}
				/>

				{selectedItem?.text === 'Other' && (
					<TextInput 
						placeholder="Type other reason here"
						value={otherReason}
						onChange={handleOtherReasonChange}
					/>
				)}
			</Tile>
		</div>
	);
};

export default Feedback;