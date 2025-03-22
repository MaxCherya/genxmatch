import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from "react-i18next";

const generateUsername = (): string => {
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    const vowels = 'aeiou';

    const randomFrom = (chars: string) =>
        chars[Math.floor(Math.random() * chars.length)];

    const makeSyllable = () =>
        randomFrom(consonants) + randomFrom(vowels);

    const syllableCount = Math.floor(Math.random() * 2) + 2;
    let base = '';
    for (let i = 0; i < syllableCount; i++) {
        base += makeSyllable();
    }

    if (Math.random() > 0.5) {
        base += Math.floor(Math.random() * 1000);
    }

    if (Math.random() > 0.7) {
        const middle = Math.floor(base.length / 2);
        base = base.slice(0, middle) + '_' + base.slice(middle);
    }

    return `@${base}`;
};

const OrderNotification: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [show, setShow] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        let mounted = true;

        const updateUser = () => {
            const newUsername = generateUsername();
            setShow(false);
            setTimeout(() => {
                if (!mounted) return;
                setUsername(newUsername);
                setShow(true);
            }, 500);
        };

        updateUser();

        const interval = setInterval(updateUser, Math.floor(Math.random() * (15000 - 7000 + 1)) + 7000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, []);

    if (!username) return null;

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.4 }}
                    className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 max-w-[90vw] sm:max-w-xs bg-white shadow-xl rounded-xl px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base text-black z-50"
                >
                    <span className="font-semibold">{username}</span> {t('just_ordered_this_item')}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OrderNotification;