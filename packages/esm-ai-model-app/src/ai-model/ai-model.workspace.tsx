import React, { useState } from "react";
import styles from './ai-model.scss'
import { Button} from "@carbon/react";
import { SendAlt, Close, Checkmark } from "@carbon/react/icons";
import { getPatientUuidFromStore, useLaunchWorkspaceRequiringVisit } from "@openmrs/esm-patient-common-lib";
import CustomTextArea from "../components/ui/text-area.component";
import GeneratedResponse from "../components/llm-response/generated-response.component";
import Feedback from "../components/feedback.component";
import { useObservations } from "../hooks/useObservations";
import Observation from "../components/observations/observation.component";
import Actions from "../components/props/action.component";
import LoadingState from "../components/loading-state/loading-state.component";

const AIModel: React.FC = () => {
	const [isEditMode, setEditMode] = useState(false);
	const [isRegenerated, setRegenerated] = useState(false);
	const [editedText, setEditedText] = useState('');
	const [savedText, setSavedText] = useState('');
	const [showFeedback, setShowFeedback] = useState(false);
	const [editReason, setEditReason] = useState(null);
	const [regenerateReason, setRegeneratedReason] = useState(null);
	const launchAiModelGeneratedWorkSpace = useLaunchWorkspaceRequiringVisit('ai-model-generated');
	const patientUuid = getPatientUuidFromStore();
  
	const { data: observations, generateLlmMessage, isGenerating, llmResponse } = useObservations(patientUuid);

	const toggleEditMode = () => {
		setEditMode(true);
		setShowFeedback(false);
		setEditedText(savedText || llmResponse || '');
	};

	const cancelEdit = () => {
		setEditMode(false);
		setShowFeedback(false);
		setEditedText(savedText || llmResponse || '');
		setRegenerated(false);
		setEditReason(null);
	};

	const saveEdit = () => {
		if (!editReason) {
			setShowFeedback(true);
			return;
		}
		setEditMode(false);
		setSavedText(editedText);
		setShowFeedback(false);
	};

	const toggleRegenerate = () => setRegenerated(true);

	if (!observations) return <LoadingState />;
  
	return (
		<div className={styles.container}>
			<div className={styles.body}>
				<div className={styles.summary}>
					<h1 className={styles.title}>Patient Encounter Summary</h1>
					{observations.map((obs, index) => (
						<Observation key={index} obs={obs} />
					))}
					<Button
						renderIcon={SendAlt}
						kind="secondary"
						size="sm"
						onClick={generateLlmMessage}
						disabled={isGenerating}
					>
						{isGenerating ? "Generating..." : "Generate Message"}
					</Button>
				</div>
			</div>

			{llmResponse && (
				<div className={styles.chat}>
					{!isEditMode && (
						<GeneratedResponse
							toggleEditMode={toggleEditMode}
							llmResponse={savedText || llmResponse}
						/>
					)}

					{isEditMode && (
						<div className={styles.editContainer}>
							<CustomTextArea
								initialText={editedText}
								onChange={setEditedText}
							/>
							<div className={styles.editActions}>
								<Button kind="danger--ghost" size="sm" onClick={cancelEdit} renderIcon={Close}>
									Cancel
								</Button>

								<Button kind="primary" size="sm" onClick={saveEdit} renderIcon={Checkmark}>
									Save
								</Button>
							</div>
						</div>
					)}

					{!isEditMode && (
						<Actions
							onApprove={launchAiModelGeneratedWorkSpace}
							onRegenerate={toggleRegenerate}
						/>
					)}
				</div>
			)}

			{showFeedback && (
				<Feedback title="Reason for Edit" onReasonSelect={setEditReason} />
			)}

			{isRegenerated && <Feedback title="Reason for Regeneration" onReasonSelect={setRegeneratedReason} />}
		</div>
	);
};

export default AIModel;