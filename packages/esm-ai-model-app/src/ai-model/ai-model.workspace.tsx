import React, { useState, useEffect } from "react";
import styles from './ai-model.scss'
import { Button} from "@carbon/react";
import { SendAlt, Close, Checkmark, WarningAlt } from "@carbon/react/icons";
import { getPatientUuidFromStore, useLaunchWorkspaceRequiringVisit } from "@openmrs/esm-patient-common-lib";
import CustomTextArea from "../components/ui/text-area.component";
import GeneratedResponse from "../components/llm-response/generated-response.component";
import Feedback from "../components/feedback.component";
import { useObservations, useLlmConsent } from "../hooks/useObservations";
import Observation from "../components/observations/observation.component";
import Actions from "../components/props/action.component";
import LoadingState from "../components/loading-state/loading-state.component";
import Modal from "../components/modal/modal.component";

const MAX_CHAR_LIMIT = 320;

const ConsentDeniedMessage: React.FC = () => (
    <div className={styles.consentDeniedContainer}>
        <WarningAlt size={32} />
        <h2>Consent Not Given</h2>
        <p>Patient has not given consent for LLM Message generation.</p>
    </div>
);

const AIModel: React.FC = () => {
	const [isEditMode, setEditMode] = useState(false);
	const [isRegenerated, setRegenerated] = useState(false);
	const [editedText, setEditedText] = useState('');
	const [savedText, setSavedText] = useState('');
	const [editReason, setEditReason] = useState<string | null>(null);
	const [regenerateReason, setRegenerateReason] = useState<string | null>(null);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showRegenerateModal, setShowRegenerateModal] = useState(false);
	const [hasEdits, setHasEdits] = useState(false);
	const [hasRegeneration, setHasRegeneration] = useState(false);
	const [llmError, setLlmError] = useState<string | null>(null);
	const [showToast, setShowToast] = useState(false);

	const launchAiModelGeneratedWorkSpace = useLaunchWorkspaceRequiringVisit('ai-model-generated');
	const patientUuid = getPatientUuidFromStore();
	const { consentStatus, isLoading: isConsentLoading, error: consentError } = useLlmConsent(patientUuid);
	const { data: observations, generateLlmMessage, isGenerating, llmResponse, saveMessage, isSaving } = useObservations(patientUuid, consentStatus === 'Yes');

	const hasRelevantData = observations?.some(obs => 
        obs.diagnosis || (obs.medications && obs.medications.length > 0) || 
        (obs.condition && obs.condition.length > 0) || 
        (obs.tests && obs.tests.length > 0)
    ) ?? false;

	const handleGenerateMessage = async () => {
		setLlmError(null);
		try {
			await generateLlmMessage();
		} catch (error: any) {
			console.error("LLM message generation failed:", error);
			setLlmError(error.message || "Failed to generate message. Please try again.");
			setShowToast(true);

			setTimeout(() => {
				setShowToast(false);
			}, 5000);
		}
	};

	const toggleEditMode = () => {
		setEditMode(true);
		setEditedText(savedText || llmResponse || '');
	};

	const handleSaveEditClick = () => {
		if (!editedText.trim()) return;
		setShowEditModal(true);
	};

	const confirmSaveEdit = () => {
		if (!editReason) return;

		setSavedText(editedText);
		setHasEdits(true);
		setEditMode(false);
		setShowEditModal(false);
	};

	const toggleRegenerate = () => {
		setShowRegenerateModal(true);
	};

	const confirmRegenerate = async () => {
		if (!regenerateReason) return;

		setShowRegenerateModal(false);
		setRegenerated(true);
		setHasRegeneration(true);
		await generateLlmMessage();
	};

	const approveMessage = async () => {
		if (!savedText && !llmResponse) {
			alert("No message available to approve.");
			return;
		}

		try {
			await saveMessage(
				savedText || llmResponse,
				hasEdits,
				editReason || "",
				hasRegeneration,
				regenerateReason || "",
				() => launchAiModelGeneratedWorkSpace()
			);
		} catch (error) {
			console.error("Error saving message:", error);
		}
	};

	 if (isConsentLoading) {
        return <LoadingState message="Checking Patient Consent..." />;
    }

    if (consentError) {
        return <ConsentDeniedMessage />;
    }

    if (consentStatus === 'No') {
        return <ConsentDeniedMessage />;
    }

	if (!observations) return <LoadingState message="Fetching Patient Data..." />;

	return (
		<div className={styles.container}>
			<div className={styles.body}>
				<div className={styles.summary}>
					<h1 className={styles.title}>Patient Encounter Summary</h1>
					{observations.map((obs, index) => (
						<Observation key={index} obs={obs} />
					))}

					{hasRelevantData && (
						<Button
							renderIcon={SendAlt}
							kind="secondary"
							size="sm"
							onClick={handleGenerateMessage}
							disabled={!!llmResponse || isGenerating}
						>
							{llmResponse ? "Message Generated" : isGenerating ? "Generating LLM response..." : "Generate Message"}
						</Button>
					)}

					{llmError && <p className={styles.errorMessage}>{llmError}</p>}
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
									<Button kind="danger--ghost" size="sm" onClick={() => setEditMode(false)}>
										Cancel
									</Button>
									<Button kind="primary" size="sm" onClick={handleSaveEditClick}>
										Save
									</Button>
								</div>
							</div>
						)}

						{!isEditMode && (
							<Actions
								onApprove={approveMessage}
								onRegenerate={toggleRegenerate}
							/>
						)}
					</div>
				)}

				{(hasEdits || hasRegeneration) && (
					<div>
						{hasEdits && <p><strong>Edited:</strong> {editReason}</p>}
						{hasRegeneration && <p><strong>Regenerated:</strong> {regenerateReason}</p>}
					</div>
				)}

				{isSaving && <LoadingState message="Processing Message for SMS..." />}
			</div>

			{showToast && (
				<div className={styles.toastError}>
					<WarningAlt size={16} className={styles.warningIcon} />
					<span>{llmError}</span>
				</div>
			)}

			{/* Edit Reason Modal */}
			<Modal
				title="Provide a reason for editing"
				isOpen={showEditModal}
				onClose={() => setShowEditModal(false)}
				onConfirm={confirmSaveEdit}
				disableConfirm={!editReason}
			>
				<Feedback title="Select a reason" onReasonSelect={setEditReason} />
			</Modal>

			{/* Regenerate Reason Modal */}
			<Modal
				title="Provide a reason for regenerating"
				isOpen={showRegenerateModal}
				onClose={() => setShowRegenerateModal(false)}
				onConfirm={confirmRegenerate}
				disableConfirm={!regenerateReason}
			>
				<Feedback title="Select a reason" onReasonSelect={setRegenerateReason} />
			</Modal>
		</div>
	);
};

export default AIModel;