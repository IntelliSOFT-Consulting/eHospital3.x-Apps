import React, { Dispatch, SetStateAction } from "react";
import { Modal } from "@carbon/react";
import { Misuse, NotSentFilled } from "@carbon/react/icons";
import { useDateFilterContext } from "../../filters/useFilterContext";
import styles from "../messages-table.scss";

interface InfoModalProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  rowId: string;
}
const InfoModalComponent: React.FC<InfoModalProps> = ({
  isOpen,
  setOpen,
  rowId,
}) => {
  const { messages } = useDateFilterContext();

  // const { message } = useMessages();

  // // const row =
  // //   activeTab === 0
  // //     ? messages.find((row) => `${row.id} - ${row.date}` === rowId)
  // //     : message.find((row) => row.id === rowId);

  const row = messages.find((row) => `${row.id} - ${row.date}` === rowId);

  if (!row) return null;

  return (
    <Modal
      open={isOpen}
      onRequestClose={() => setOpen(false)}
      passiveModal={true}
    >
      <div key={row.id}>
        {row.status === "NOT SENT" && (
          <div className={styles.infoBody}>
            <NotSentFilled size={80} />
            <h3>Not Sent</h3>
            <p>The message has not been sent</p>
          </div>
        )}
        {row.status === "FAILED" && (
          <div className={styles.infoBody}>
            <Misuse size={80} />
            <h3 className={styles.infoBody}>Failed</h3>
            <p>
              Error:
              <p style={{ color: "red" }}>Failed</p>
              Try Again!!
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default InfoModalComponent;
