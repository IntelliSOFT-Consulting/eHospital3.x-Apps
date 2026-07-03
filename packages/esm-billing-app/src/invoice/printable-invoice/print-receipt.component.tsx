import React, { useState } from 'react';
import { Button } from '@carbon/react';
import { Printer } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import styles from './print-receipt.scss';
import { apiBasePath } from '../../constants';

interface PrintReceiptProps {
  billUuid: string;
  receiptNumber: string;
}
const PrintReceipt: React.FC<PrintReceiptProps> = ({ billUuid, receiptNumber }) => {
  const { t } = useTranslation();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const baseUrl = new URL(window.location.href);

  const handlePrintReceiptClick = () => {
    setIsRedirecting(true);
    setTimeout(() => {
      const pdfUrl = `${baseUrl.origin}/openmrs${apiBasePath}receipt?billUuid=${billUuid}`;
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `receipt_${receiptNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsRedirecting(false);
    }, 1000);
  };

  return (
    <Button
      kind="secondary"
      className={styles.button}
      size="md"
      renderIcon={(props) => <Printer size={24} {...props} />}
      onClick={handlePrintReceiptClick}
      disabled={isRedirecting}>
      {isRedirecting ? t('loading', 'Loading') : t('printReceipt', 'Print receipt')}
    </Button>
  );
};

export default PrintReceipt;
