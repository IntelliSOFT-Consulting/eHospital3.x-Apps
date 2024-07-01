import React, {Dispatch, SetStateAction} from "react";
import { Modal } from "@carbon/react";

const NewBackupModal:
  React.FC<{ isOpen: boolean, setOpen: Dispatch<SetStateAction<boolean>> }> = ({isOpen, setOpen}) => {

  const handleSubmit = () => {
    setOpen(false);
  }

  return (
    <Modal
      open={isOpen}
      onRequestSubmit={handleSubmit}
      onRequestClose={() => setOpen(false)}
      modalHeading="Create a new backup?"
      modalLabel="New Backup"
      primaryButtonText="Create"
      secondaryButtonText="Cancel"
    >
    </Modal>
  );
};


export default NewBackupModal;
