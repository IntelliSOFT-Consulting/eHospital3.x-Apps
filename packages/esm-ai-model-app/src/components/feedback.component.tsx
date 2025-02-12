import React, { useState } from 'react';
import styles from '../ai-model/ai-model.scss'
import { Tile, Dropdown } from '@carbon/react';
import { TextInput } from '@carbon/react';

interface FeedbackProps {
	title: string,
}

const Feedback: React.FC<FeedbackProps> = ({ title }) => {
	const [selectedItem, setSelectedItem] = useState(null);

	const items = [
		{text: 'Dissatisfied with the response'},
		{text: 'Missing information'},
		{text: "Other"}
	]

	return (
		<div>
			<Tile className={styles.feedback}>
				<h1 className={styles.title}>{title}</h1>
				<Dropdown
					items={items}
					itemToString={item => item ? item.text : ''}
					label="Select"
					onChange={({ selectedItem }) => setSelectedItem(selectedItem)}
				/>

				{selectedItem?.text === 'Other' && (
					<TextInput 
						placeholder="Type other reason here"
					/>
				)}
			</Tile>
		</div>
	)
}

export default Feedback