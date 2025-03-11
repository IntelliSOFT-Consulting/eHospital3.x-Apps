import React, { useState } from "react";
import styles from './ai-model.scss'
import { Button} from "@carbon/react";
import { SendAlt } from "@carbon/react/icons";
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
	const launchAiModelGeneratedWorkSpace = useLaunchWorkspaceRequiringVisit('ai-model-generated');
	const patientUuid = getPatientUuidFromStore();
  
	const { data: observations, generateLlmMessage, isGenerating, llmResponse } = useObservations(patientUuid);
  
	const toggleEditMode = () => {
		setEditMode(true);
		setEditedText(llmResponse || '');
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
							llmResponse={llmResponse}
						/>
					)}

					{isEditMode && (
						<CustomTextArea
							initialText={editedText}
							onChange={setEditedText}
						/>
					)}

					<Actions
						onApprove={launchAiModelGeneratedWorkSpace}
						onRegenerate={toggleRegenerate}
					/>
				</div>
			)}
  
			{isRegenerated && <Feedback title="Reason for Regeneration" />}
			{isEditMode && <Feedback title="Reason for Edit" />}
		</div>
	);
};

export default AIModel;