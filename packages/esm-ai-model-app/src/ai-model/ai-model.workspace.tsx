import React, { useState } from "react";
import styles from './ai-model.scss'
import { Button} from "@carbon/react";
import { SendAlt } from "@carbon/react/icons";
import { getPatientUuidFromStore, useLaunchWorkspaceRequiringVisit } from "@openmrs/esm-patient-common-lib";
import CustomTextArea from "../components/text-area.component";
import GeneratedResponse from "../components/generated-response.component";
import Feedback from "../components/feedback.component";
import { useObservations } from "../hooks/useObservations";
import Observation from "../components/observations/observation.component";
import Actions from "../components/props/action.component";
import LoadingState from "../components/loading-state/loading-state.component";

const AIModel: React.FC = () => {
	const [isEditMode, setEditMode] = useState(false);
	const [isRegenerated, setRegenerated] = useState(false);
	const launchAiModelGeneratedWorkSpace = useLaunchWorkspaceRequiringVisit('ai-model-generated');
	const patientUuid = getPatientUuidFromStore();
  
	const { data: observations } = useObservations(patientUuid);
  
	const toggleEditMode = () => setEditMode(true);
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
			<Button renderIcon={SendAlt} kind="secondary" size="sm">
			  Generate Message
			</Button>
		  </div>
  
		  <div className={styles.chat}>
			{!isEditMode && <GeneratedResponse toggleEditMode={toggleEditMode} />}
			{isEditMode && <CustomTextArea />}
			<Actions
			  onApprove={launchAiModelGeneratedWorkSpace}
			  onRegenerate={toggleRegenerate}
			/>
		  </div>
		</div>
  
		{isRegenerated && <Feedback title="Reason for Regeneration" />}
		{isEditMode && <Feedback title="Reason for Edit" />}
	  </div>
	);
  };
  
  export default AIModel;