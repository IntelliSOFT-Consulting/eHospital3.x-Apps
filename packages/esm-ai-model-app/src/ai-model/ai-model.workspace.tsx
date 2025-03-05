import React, { useState } from "react";
import styles from './ai-model.scss'
import { 
	Button,
	Loading
} from "@carbon/react";
import { SendAlt } from "@carbon/react/icons";
import PrimaryButton from "../components/primary-button.component";
import { getPatientUuidFromUrl, useLaunchWorkspaceRequiringVisit } from "@openmrs/esm-patient-common-lib";
import CustomTextArea from "../components/text-area.component";
import GeneratedResponse from "../components/generated-response.component";
import Feedback from "../components/feedback.component";
import { useObservations } from "../hooks/useObservations";


const AIModel: React.FC = () => {
	const [isEditMode, setEditMode] = useState(false);
	const [isRegenerated, setRegenerated] = useState(false);
	const launchAiModelGeneratedWorkSpace = useLaunchWorkspaceRequiringVisit('ai-model-generated');
	const patientUuid = getPatientUuidFromUrl()
	const {
		data: observations,
		llmResponse,
		isGenerating,
		generateLlmMessage
	} = useObservations(patientUuid);

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
					{observations && <h1 className={styles.title}>Patient Encounter Summary</h1>}

					{!observations && (
						<div className={styles.loading}>
							<Loading 
								small 
								withOverlay={false} 
							/>
							<p>Loading observations...</p>
						</div>
					)}
					{observations?.map((obs, index) => (
            <div key={index} className={styles.observation}>
              <div>
								<p>Sex: {obs.sex}</p>
								<p>Age: {obs.age}</p>
								<p>Weight: {obs.weight}</p>
								<p>Height: {obs.height}</p>
								<p>BMI: {obs.bmi}</p>
								<p>Blood Pressure: {obs.bloodPressure}</p>
								<p>Heart Rate: {obs.heartRate}</p>
								<p>Temperature: {obs.temperature}</p>
								<p>Diagnosis: {obs.diagnosis}</p>
							</div>
              {obs.medication && obs.medication.length > 0 && (
								<>
									<p>Medications: </p>
                	<p>{obs.medication.join(", ")}</p>
								</>
              )}
              {obs.tests && obs.tests.length > 0 && (
                <div>
                  <p>Tests:</p>
                  {obs.tests.map((test, testIndex) => (
                    <div key={testIndex}>
                      <strong>{test.test_name}</strong>
                      {test.test_results?.map((result, resultIndex) => (
                        <div key={resultIndex}>
                          {result.parameter}: {result.value}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              {obs.condition && obs.condition.length > 0 && (
                <>
									<p>Conditions: </p>
									<p>{obs.condition.join(", ")}</p>
								</>
              )}
            </div>
          ))}
				</div>

				{observations && (<Button
					renderIcon={SendAlt}
					kind="secondary"
					size="sm"
				>
					Generate Message
				</Button>)}
			</div>

			<div className={styles.chat}>

				{!isEditMode && observations && <GeneratedResponse toggleEditMode={toggleEditMode} />}

				{isEditMode && observations && <CustomTextArea />}

				{observations && (<div className={styles.actions}>
					<PrimaryButton onClick={launchAiModelGeneratedWorkSpace}>Approve</PrimaryButton>
					<PrimaryButton onClick={toggleRegenerate}>Regenerate</PrimaryButton>
				</div>)}
			</div>

			{isRegenerated && <Feedback title="Reason for Regeneration" />}
			{isEditMode && <Feedback title="Reason for Edit" />}
		</div>
	)
}

export default AIModel