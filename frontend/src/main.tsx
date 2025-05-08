import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './fonts.css'
import 'react-phone-number-input/style.css';
import './utils/i18n';
import App from './App.tsx'
import Toast from './components/general/Toast.tsx';
import { ToastProvider } from './contexts/ToastContext.tsx';
import { CartProvider } from './contexts/CartContext.tsx';
import { AuthProvider } from './contexts/authContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <App />
          <Toast />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
