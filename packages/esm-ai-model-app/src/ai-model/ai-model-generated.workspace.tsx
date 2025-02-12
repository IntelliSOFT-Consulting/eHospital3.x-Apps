import React from "react";
import styles from './ai-model.scss'
import PrimaryButton from "../components/primary-button.component";

const AIModelResponse: React.FC = () => {
	return (
		<div className={styles.container}>
			<div className={styles.body}>
				<div className={styles.summary}>
					<p>This will be the final message to be sent to the client</p>
				</div>

				<div className={styles.actions}>
					<PrimaryButton>Send via SMS</PrimaryButton>
					<PrimaryButton>Send via Email</PrimaryButton>
					<PrimaryButton>Send via WhatsApp</PrimaryButton>
				</div>
			</div>
		</div>
	)
}

export default AIModelResponse