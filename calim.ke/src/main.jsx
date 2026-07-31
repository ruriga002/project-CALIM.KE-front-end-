// main.jsx is the React application entry point.
// It initializes the React root and renders the App component
// inside React.StrictMode for best-practice warnings.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
