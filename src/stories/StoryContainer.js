import React from 'react';
import {
  BrowserRouter as Router
} from 'react-router-dom';


const StoryContainer = ({ bg, children }) => (
  <Router>
    <div style={{ padding: '30px', minHeight: '100vh', background: bg || '#f2f2f5' }}>
      {children}
    </div>
  </Router>
);

export default StoryContainer;
