import React from "react";
import styles from "./full-message.scss";

interface FullMessageProps {
  message: string;
  timestamp: string;
}

const FullMessageComponent: React.FC<FullMessageProps> = ({
  message,
  timestamp,
}) => {
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Message Details</h4>
      <p className={styles.text}>
        <span className={styles.bold}>Sent on</span>: {timestamp}
      </p>
      <p className={styles.text}>
        <span className={styles.bold}>Message</span>:{" "}
        {message || "No message available"}
      </p>
    </div>
  );
};

export default FullMessageComponent;
