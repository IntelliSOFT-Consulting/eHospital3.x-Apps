import React from 'react';
import { TextArea } from '@carbon/react';

const CustomTextArea = () => {
  return (
    <div style={{ position: 'relative' }}>
      <TextArea
        id="custom-textarea"
        labelText=""
        placeholder="Message eChat"
      />
    </div>
  );
};

export default CustomTextArea;
