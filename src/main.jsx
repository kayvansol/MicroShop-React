import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@shared/assets/css/App.css'
import App from '@app/App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
