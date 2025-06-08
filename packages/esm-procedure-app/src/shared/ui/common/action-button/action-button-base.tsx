import React from "react";
import { Button } from "@carbon/react";
import { useTranslation } from "react-i18next";

const ActionButtonBase: React.FC<{
  actionName: string;
  onClick: () => void;
  kind?: 'primary' | 'tertiary' | 'danger';
  className?: string;
}> = ({ actionName, onClick, kind = 'tertiary', className = '' }) => {
  const { t } = useTranslation();
  const label = t(
    actionName.replace(/-/g, ''),
    actionName
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace('Modal', '')
  );

  return (
    <Button kind={kind} onClick={onClick} size="md" className={className}>
      {label}
    </Button>
  );
};

  export default ActionButtonBase;