import React from 'react';
import { useTranslation } from 'react-i18next';
import { Location, UserFollow } from '@carbon/react/icons';
import { useSession } from '@openmrs/esm-framework';
import MessageIllustration from './message-illustration.component';;
import styles from './messages-header.scss';

interface MessagesHeaderProps {
  title: string;
}

const MessagesHeader: React.FC<MessagesHeaderProps> = ({ title }) => {
  const { t } = useTranslation();
  const session = useSession();
  const location = session?.sessionLocation?.display;

  return (
    <div className={styles.header} data-testid="messages-header">
      <div className={styles['left-justified-items']}>
        <MessageIllustration />
        <div className={styles['page-labels']}>
          <p>{t('messages', 'Messages')}</p>
          <p className={styles['page-name']}>{title}</p>
        </div>
      </div>
      <div className={styles['right-justified-items']}>
        <div className={styles.userContainer}>
          <p>{session?.user?.person?.display}</p>
          <UserFollow size={16} className={styles.userIcon} />
        </div>
        <div className={styles['date-and-location']}>
          <Location size={16} />
          <span className={styles.value}>{location}</span>
          <span className={styles.middot}>&middot;</span>
        </div>
      </div>
    </div>
  );
};

export default MessagesHeader;
