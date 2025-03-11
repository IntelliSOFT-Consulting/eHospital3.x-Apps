import React from 'react';
import { Tile } from '@carbon/react';
import styles from './generated-response.scss';
import { Edit } from '@carbon/react/icons';

interface GeneratedResponseProps {
	toggleEditMode: () => void;
	llmResponse: string | null;
}

const GeneratedResponse: React.FC<GeneratedResponseProps> = ({ toggleEditMode, llmResponse }) => {
	return (
		<Tile>
			<div className={styles.generated}>
				<p>{llmResponse || "No generated text available."}</p>
				<div className={styles.editButton} onClick={toggleEditMode}>
					<Edit aria-label="Edit response" size={20} />
				</div>
			</div>
		</Tile>
	);
};

export default GeneratedResponse;