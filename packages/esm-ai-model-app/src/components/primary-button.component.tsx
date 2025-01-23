import React from 'react';
import { Button } from '@carbon/react';

interface PrimaryButtonProps {
	children: React.ReactNode
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children }) => {
  return (
		<Button
			size="sm"
			style={{paddingRight: '1.2rem'}}
		>
			{children}
		</Button>
	)
}

export default PrimaryButton