import React from 'react';
import ReactDOM from 'react-dom/client'; // For React 18+
import './index.css'; // You can leave this empty or add global styles
import App from './App'; // Import your main App component

// Get the root element from your public/index.html file
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render your App component inside the root element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
