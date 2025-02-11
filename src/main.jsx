// main.jsx

import React from 'react'; // <-- Add this line if it's missing
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Create root and render App component
createRoot(document.getElementById('root')).render(
  
    <App />
  
);
