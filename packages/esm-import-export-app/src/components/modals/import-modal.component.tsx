import React, { Dispatch, SetStateAction } from "react";
import { Form, FormGroup, Modal, FileUploader } from "@carbon/react";
import styles from "../styles/modals.scss";

const ImportModalComponent: React.FC<{
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ isOpen, setOpen }) => {
  const handleSubmit = () => {
    setOpen(false);
  };
  return (
    <Modal
      open={isOpen}
      onRequestSubmit={handleSubmit}
      onRequestClose={() => setOpen(false)}
      modalHeading="Import"
      modalLabel="Import"
      primaryButtonText="Import"
      secondaryButtonText="Cancel"
    >
      <div className={styles.importBody}>
        <Form>
          <FormGroup controlId="form">
            <FileUploader
              buttonLabel="Choose the file"
              labelTitle="Choose Import File"
              buttonKind="primary"
              filenameStatus="edit"
              accept={[".jpg", ".png"]}
              multiple={true}
              disabled={false}
              name=""
            />
          </FormGroup>
        </Form>
      </div>
    </Modal>
  );
};

export default ImportModalComponent;
