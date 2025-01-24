import React from "react";
import styles from './ai-model.scss'
import { 
	Button 
} from "@carbon/react";
import { Save } from "@carbon/react/icons";
import PrimaryButton from "../components/primary-button.component";
import { TextArea } from "@carbon/react";
import { SendAltFilled } from "@carbon/react/icons";
import CustomTextArea from "../components/text-area.component";

const AIModel: React.FC = () => {
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
					renderIcon={Save}
					kind="secondary"
				>
					Save
				</Button>

				<div className={styles.actions}>
					<PrimaryButton>Send via SMS</PrimaryButton>
					<PrimaryButton>Send via Email</PrimaryButton>
					<PrimaryButton>Send via WhatsApp</PrimaryButton>
				</div>
			</div>

			<div className={styles.chat}>
				<p>Type any question or request to improve the summary if not accurate</p>

				<CustomTextArea />
			</div>
		</div>
	)
}

export default AIModel