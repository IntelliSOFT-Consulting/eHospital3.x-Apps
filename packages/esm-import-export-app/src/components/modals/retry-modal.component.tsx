import React, {Dispatch, SetStateAction} from "react";
import { Modal } from "@carbon/react";

const RetryModal:
  React.FC<{ isOpen: boolean, setOpen: Dispatch<SetStateAction<boolean>> }> = ({isOpen, setOpen}) => {

  const handleSubmit = () => {
    setOpen(false);
  }

  return (
    <Modal
      open={isOpen}
      onRequestSubmit={handleSubmit}
      onRequestClose={() => setOpen(false)}
      modalHeading="Retry this backup?"
      modalLabel="New Backup"
      primaryButtonText="Retry"
      secondaryButtonText="Cancel"
    >
    </Modal>
  );
};


export default RetryModal;
