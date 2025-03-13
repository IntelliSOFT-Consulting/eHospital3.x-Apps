import React from "react";
import styles from "./modal.scss";
import { Button } from "@carbon/react";
import { WarningAlt } from "@carbon/react/icons";

interface ModalProps {
	title: string;
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	children: React.ReactNode;
	disableConfirm?: boolean;
}

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, onConfirm, children, disableConfirm }) => {
	if (!isOpen) return null;

	return (
		<>
			<div className={styles.modalOverlay} />
			<div className={styles.modal}>
				<div className={styles.modalContent}>
					<h4><WarningAlt className={styles.warningIcon} /> {title}</h4>
					{children}
					<div className={styles.modalActions}>
						<Button kind="danger--ghost" size="sm" onClick={onClose}>
							Cancel
						</Button>
						<Button kind="primary" size="sm" onClick={onConfirm} disabled={disableConfirm}>
							Confirm
						</Button>
					</div>
				</div>
			</div>
		</>
	);
};

export default Modal;