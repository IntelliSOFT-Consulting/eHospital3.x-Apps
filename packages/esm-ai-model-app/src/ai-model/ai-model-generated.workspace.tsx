import React, { useEffect, useState } from "react";
import styles from './ai-model.scss'
import { useObservations } from "../hooks/useObservations";
import { Button, Tile} from "@carbon/react";
import LoadingState from "../components/loading-state/loading-state.component";
import { getPatientUuidFromStore } from "@openmrs/esm-patient-common-lib";

const AIModelResponse: React.FC = () => {
	const patientUuid = getPatientUuidFromStore();
	const { sendMessageViaSMS, isSending, fetchLatestMessage, latestMessage } = useObservations(patientUuid);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchMessage = async () => {
			setIsLoading(true);
			await fetchLatestMessage();
			setIsLoading(false);
		};
		fetchMessage();
	}, [fetchLatestMessage]);

	if (isLoading) {
		return <LoadingState message="Fetching latest message..." />;
	}

	return (
		<div className={styles.container}>
			<div className={styles.body}>
				<div className={styles.summary}>
					<p>This will be the final message to be sent to the client:</p>
					<Tile className={styles.messageTile}>{latestMessage || "No message available"}</Tile>
				</div>

				<div className={styles.actions}>
					<Button
						kind="primary"
						size="sm"
						onClick={() => sendMessageViaSMS(latestMessage)}
						disabled={isSending || !latestMessage}
					>
						{isSending ? "Sending SMS..." : "Send via SMS"}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default AIModelResponse;