import React, {Dispatch, SetStateAction} from "react";
import {Form, FormGroup, Modal, TextInput} from "@carbon/react";
import styles from "../styles/modals.scss"

const DownloadModalComponent:
  React.FC<{ isOpen: boolean, setOpen: Dispatch<SetStateAction<boolean>> }> = ({isOpen, setOpen}) => {

  const handleSubmit = () => {
    setOpen(false);
  }

  return (
    <Modal
      open={isOpen}
      onRequestSubmit={handleSubmit}
      onRequestClose={() => setOpen(false)}
      modalHeading="Download this backup"
      modalLabel="Download"
      primaryButtonText="Download"
      secondaryButtonText="Cancel"
    >
      <div className={styles.modalBody}>
        <Form>
          <FormGroup controlId="form">
            <TextInput placeholder="File name" labelText="Insert File Name"/>
          </FormGroup>
        </Form>
      </div>
    </Modal>
  );
};


export default DownloadModalComponent;
