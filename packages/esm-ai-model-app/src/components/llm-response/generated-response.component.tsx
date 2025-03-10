import React from 'react';
import { Tile } from '@carbon/react';
import styles from './generated-response.scss';
import { Edit } from '@carbon/react/icons';

interface GeneratedResponseProps {
	toggleEditMode: () => void
}

const GeneratedResponse: React.FC<GeneratedResponseProps> = ({ toggleEditMode }) => {
	return (
		<Tile>
			<div className={styles.generated}>
				This is the generated text from the LLM
				<div className={styles.editButton} onClick={toggleEditMode}>
					<Edit aria-label="Edit response" size={20} />
				</div>
			</div>
		</Tile>
	)
}

export default GeneratedResponse