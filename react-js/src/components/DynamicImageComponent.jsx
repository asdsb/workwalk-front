import React from 'react';

const IframeComponent = () => {
  return (
    <div style={{ width: '100%', height: '80vh', overflow: 'hidden' }}>
      <iframe
        src="/topics_visualization.html"
        style={{ width: '100%', height: '80vh', border: '0' }}
        title="Dynamic Visualization"
      ></iframe>
    </div>
  );
};

export default IframeComponent;
