import React, { useEffect, useState } from "react";
import styles from './ai-model.scss'
import { useObservations } from "../hooks/useObservations";
import { Button, ToastNotification, Tile} from "@carbon/react";
import { getPatientUuidFromStore } from "@openmrs/esm-patient-common-lib";

const AIModelResponse: React.FC = () => {
	const patientUuid = getPatientUuidFromStore();
	const { sendMessageViaSMS, isSending, fetchLatestMessage, latestMessage } = useObservations(patientUuid);
	const [message, setMessage] = useState<string | null>(null);
	const [toast, setToast] = useState<{ type: "success" | "error"; show: boolean }>({ type: "success", show: false });

	useEffect(() => {
		const fetchMessage = async () => {
			const fetchedMessage = await fetchLatestMessage();
			setMessage(fetchedMessage);
		};
		fetchMessage();
	}, []);

	const handleSendSMS = async () => {
		try {
			await sendMessageViaSMS(message);
			setToast({ type: "success", show: true });
		} catch (error) {
			setToast({ type: "error", show: true });
		}

		setTimeout(() => {
			setToast({ type: "success", show: false });
		}, 3000);
	};

	if (!message) {
		return <p>Loading latest message...</p>;
	}

	return (
		<div className={styles.container}>
			<div className={styles.body}>
				<div className={styles.summary}>
					<h5 className={styles.messageHeader}>This will be the final message to be sent to the client:</h5>
					<div className={styles.messageTile}>{message || "No message available"}</div>
				</div>

				<div className={styles.actions}>
					<Button
						kind="primary"
						size="sm"
						onClick={handleSendSMS}
						disabled={isSending || !message}
					>
						{isSending ? "Sending SMS..." : "Send via SMS"}
					</Button>
				</div>

				{toast.show && toast.type === "success" && (
					<ToastNotification
						kind="success"
						title="Message Sent"
						subtitle="The message was successfully sent to the patient."
						caption=""
						timeout={5000}
					/>
				)}

				{toast.show && toast.type === "error" && (
					<ToastNotification
						kind="error"
						title="Message Not Sent"
						subtitle="There was an error sending the message. Please try again."
						caption=""
						timeout={5000}
					/>
				)}
			</div>
		</div>
	);
};

export default AIModelResponse;