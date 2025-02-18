import React from 'react';
import { Button } from '@carbon/react';

interface PrimaryButtonProps {
	children: React.ReactNode
	onClick?: () => void
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, onClick }) => {
  return (
		<Button
			size="sm"
			style={{paddingRight: '1.2rem'}}
			onClick={onClick}
		>
			{children}
		</Button>
	)
}

export default PrimaryButton