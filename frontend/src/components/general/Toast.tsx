// src/components/Toast.tsx
import React from 'react';
import { useToast } from '../../contexts/ToastContext';
import { AnimatePresence, motion } from 'framer-motion';

const Toast: React.FC = () => {
    const { toasts, removeToast } = useToast();

    const toastStyles = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500',
    };

    // Animation variants for the toast
    const toastVariants = {
        initial: {
            opacity: 0,
            y: 50,
            scale: 0.3,
        },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: "easeOut",
            },
        },
        exit: {
            opacity: 0,
            scale: 0.5,
            transition: {
                duration: 0.3,
                ease: "easeIn",
            },
        },
    };

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        variants={toastVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className={`${toastStyles[toast.type]} text-white px-4 py-2 rounded-md shadow-lg flex items-center justify-between min-w-[200px] max-w-[300px]`}
                        onClick={() => removeToast(toast.id)}
                    >
                        <span className="break-words">{toast.message}</span>
                        <button
                            className="ml-2 text-xl font-bold hover:text-gray-200 focus:outline-none hover:cursor-pointer"
                            onClick={() => removeToast(toast.id)}
                        >
                            ×
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default Toast;