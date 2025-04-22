import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './fonts.css'
import 'react-phone-number-input/style.css';
import './utils/i18n';
import App from './App.tsx'
import Toast from './components/general/Toast.tsx';
import { ToastProvider } from './contexts/ToastContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <App />
      <Toast />
    </ToastProvider>
  </StrictMode>,
)
