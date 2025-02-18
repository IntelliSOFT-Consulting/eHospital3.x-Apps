import React from 'react';
import styles from './empty-state.scss'
import EmptyStateIllustration from './empty-state-illustration.component';

const EmptyState = () => {
	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<EmptyStateIllustration />
				<p className={styles.text}>There are no messages to display</p>
			</div>
		</div>
	)
}

export default EmptyState