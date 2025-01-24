import React from 'react';
import { TextArea } from '@carbon/react';
import { SendAltFilled } from '@carbon/icons-react'; // Import the Send icon

const CustomTextArea = () => {
  return (
    <div style={{ position: 'relative' }}>
      <TextArea
        id="custom-textarea"
        labelText=""
        placeholder="Message eChat"
        style={{
          paddingRight: '40px',
          paddingBottom: '40px',
        }}
      />
      <SendAltFilled
        style={{
          position: 'absolute',
          right: '10px',
          bottom: '10px',
          cursor: 'pointer',
          color: '#0f62fe',
          width: '30px',
          height: '30px',
        }}
      />
    </div>
  );
};

export default CustomTextArea;
