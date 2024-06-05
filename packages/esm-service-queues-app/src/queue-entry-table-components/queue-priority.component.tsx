import React from 'react';
import {DefinitionTooltip, Tag} from '@carbon/react';
import styles from './queue-priority.scss';
import {type PriorityConfig} from '../config-schema';
import {type Concept} from '../types';

interface QueuePriorityProps {
  priority: Concept;
  priorityComment?: string;
  priorityConfigs: PriorityConfig[];
}

const QueuePriority: React.FC<QueuePriorityProps> = ({priority, priorityComment, priorityConfigs}) => {
  const priorityVariant = priority.display === "Not Urgent" ? "notUrgentTag" : priority.display === "Emergency" ? "emergencyTag" : priority.display === "Urgent" ? "urgentTag" : "tag"
  return (
    <>
      {priorityComment ? (
        <DefinitionTooltip className={styles.tooltip} align="bottom-left" definition={priorityComment}>
          <Tag
            role="tooltip"
            className={styles[priorityVariant]}>
            {priority.display}
          </Tag>
        </DefinitionTooltip>
      ) : (
        <Tag
          className={styles[priorityVariant]}>
          {priority.display}
        </Tag>
      )}
    </>
  );
};

export default QueuePriority;
