import React, {Dispatch, SetStateAction} from "react";
import { Modal } from "@carbon/react";

const DeleteModalComponent:
  React.FC<{ isOpen: boolean, setOpen: Dispatch<SetStateAction<boolean>> }> = ({isOpen, setOpen}) => {

  const handleSubmit = () => {
    setOpen(false);
  }

  return (
    <Modal
      open={isOpen}
      onRequestSubmit={handleSubmit}
      onRequestClose={() => setOpen(false)}
      modalHeading="Are you sure you need to delete this backup?"
      modalLabel="Delete"
      primaryButtonText="Delete"
      secondaryButtonText="Cancel"
    >
    </Modal>
  );
};


export default DeleteModalComponent;
