import React, { Dispatch, SetStateAction } from "react";
import { Modal } from "@carbon/react";
import styles from "../styles/modals.scss";
import { dummyBackupTableData } from "../../data/dummy";
import { CheckmarkFilled, Misuse } from "@carbon/react/icons";

const InfoModalComponent: React.FC<{
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  rowId: string;
}> = ({ isOpen, setOpen, rowId }) => {
  const row = dummyBackupTableData.find((row) => row.id === rowId);

  if (!row) return null;
  return (
    <Modal
      open={isOpen}
      onRequestClose={() => setOpen(false)}
      // modalHeading="Info Module"
      // modalLabel="Info"
      passiveModal={true}
    >
      <div key={row.id}>
        {row.status === "completed" ? (
          <div className={styles.infoBody}>
            <CheckmarkFilled size={80} />
            <h3>Success</h3>
            <p>
              The file can be found on <strong>{row.downloadPath} </strong>
            </p>
          </div>
        ) : (
          <div className={styles.infoBody}>
            <Misuse size={80} />
            <h3 className={styles.infoBody}>Failed</h3>
            <p>
              Error:
              <p style={{ color: "red" }}>
                <strong>{row.errorMessage} </strong>{" "}
              </p>
              Try Again!!{" "}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default InfoModalComponent;
