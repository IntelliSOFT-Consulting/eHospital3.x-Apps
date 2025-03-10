import React from 'react';
import PrimaryButton from "../primary-button.component";
import styles from './action.scss';

interface ActionsProps {
  onApprove: () => void;
  onRegenerate: () => void;
}

const Actions: React.FC<ActionsProps> = ({ onApprove, onRegenerate }) => (
  <div className={styles.actions}>
    <PrimaryButton onClick={onApprove}>Approve</PrimaryButton>
    <PrimaryButton onClick={onRegenerate}>Regenerate</PrimaryButton>
  </div>
);

export default Actions;