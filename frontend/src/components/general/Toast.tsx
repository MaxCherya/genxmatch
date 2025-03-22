// src/components/Toast.tsx
import React from 'react';
import { useToast } from '../../contexts/ToastContext';

const Toast: React.FC = () => {
    const { toasts, removeToast } = useToast();

    const toastStyles = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500',
    };

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`${toastStyles[toast.type]
                        } text-white px-4 py-2 rounded-md shadow-lg flex items-center justify-between min-w-[200px] max-w-[300px] animate-slide-in`}
                    onClick={() => removeToast(toast.id)}
                >
                    <span className="break-words">{toast.message}</span>
                    <button
                        className="ml-2 text-xl font-bold hover:text-gray-200 focus:outline-none"
                        onClick={() => removeToast(toast.id)}
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Toast;