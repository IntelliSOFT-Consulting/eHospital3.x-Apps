import React, { useState } from "react";
import styles from './ai-model.scss'
import { 
	Button
} from "@carbon/react";
import { SendAlt } from "@carbon/react/icons";
import PrimaryButton from "../components/primary-button.component";
import { useLaunchWorkspaceRequiringVisit } from "@openmrs/esm-patient-common-lib";
import CustomTextArea from "../components/text-area.component";
import GeneratedResponse from "../components/generated-response.component";
import Feedback from "../components/feedback.component";


const AIModel: React.FC = () => {
	const [isEditMode, setEditMode] = useState(false);
	const [isRegenerated, setRegenerated] = useState(false);
	const launchAiModelGeneratedWorkSpace = useLaunchWorkspaceRequiringVisit('ai-model-generated');

	const toggleEditMode = () => {
		setEditMode(true);
	}

	const toggleRegenerate = () => {
		setRegenerated(true)
	}

  return (
		<div className={styles.container}>
			<div className={styles.body}>
				<div className={styles.summary}>
					<p>Hey there, here is a summary of this encounter</p>
					<section>
						<p>This section will contain a summary of biometrics and diagnosis</p>
					</section>
					<section>
						<p>
							This section will contain a summary of patient's diagnosis according to the last visit.
							It will also give a summary of how the medical practitioner reached to the conclusion mentioned above.
						</p>
					</section>
					<section>
						<p>
							This section will show the common medications and recommendations for each diagnosis given above.
						</p>
					</section>
				</div>

				<Button
					renderIcon={SendAlt}
					kind="secondary"
					size="sm"
				>
					Generate Message
				</Button>
			</div>

			<div className={styles.chat}>

				{!isEditMode && <GeneratedResponse toggleEditMode={toggleEditMode} />}

				{isEditMode && <CustomTextArea />}

				<div className={styles.actions}>
					<PrimaryButton onClick={launchAiModelGeneratedWorkSpace}>Approve</PrimaryButton>
					<PrimaryButton onClick={toggleRegenerate}>Regenerate</PrimaryButton>
				</div>
			</div>

			{isRegenerated && <Feedback title="Reason for Regeneration" />}
			{isEditMode && <Feedback title="Reason for Edit" />}
		</div>
	)
}

export default AIModel