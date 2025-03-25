import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from "react-i18next";
import clsx from 'clsx';

type Theme = 'light' | 'dark' | 'auto';

const generateUsername = (): string => {
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    const vowels = 'aeiou';
    const randomFrom = (chars: string) => chars[Math.floor(Math.random() * chars.length)];
    const makeSyllable = () => randomFrom(consonants) + randomFrom(vowels);
    const syllableCount = Math.floor(Math.random() * 2) + 2;
    let base = '';
    for (let i = 0; i < syllableCount; i++) base += makeSyllable();
    if (Math.random() > 0.5) base += Math.floor(Math.random() * 1000);
    if (Math.random() > 0.7) {
        const mid = Math.floor(base.length / 2);
        base = base.slice(0, mid) + '_' + base.slice(mid);
    }
    return `@${base}`;
};

type OrderMessage = {
    id: number;
    username: string;
};

type Props = {
    theme?: Theme;
};

let messageId = 0;

const OrderFeed: React.FC<Props> = ({ theme = 'auto' }) => {
    const [messages, setMessages] = useState<OrderMessage[]>([]);
    const { t } = useTranslation();

    const MAX_MESSAGES = 5;

    const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);

    const addMessage = () => {
        const newMessage: OrderMessage = {
            id: messageId++,
            username: generateUsername(),
        };

        setMessages((prev) => {
            const updated = [newMessage, ...prev];
            if (updated.length > MAX_MESSAGES) {
                updated.pop();
            }
            return updated;
        });
    };

    useEffect(() => {
        for (let i = 0; i < MAX_MESSAGES; i++) {
            addMessage();
        }

        const loop = () => {
            addMessage();
            const delay = Math.floor(Math.random() * (15000 - 7000 + 1)) + 7000;
            setTimeout(loop, delay);
        };

        const timeout = setTimeout(loop, 7000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div
            className={clsx(
                'rounded-xl p-4 shadow w-full max-w-[100%]',
                isDark ? 'bg-[#111] text-white' : 'bg-white text-gray-800'
            )}
        >
            <h3 className="font-bold text-lg mb-3">{t('latest_orders_live')}</h3>
            <div className="space-y-2 min-h-[15.5rem] max-h-[15.5rem] overflow-hidden">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className={clsx(
                                'text-sm rounded px-3 py-2 h-[2.5rem]',
                                isDark ? 'bg-[#222] text-white' : 'bg-gray-100 text-gray-800'
                            )}
                        >
                            <span className="font-medium">{msg.username}</span> {t('just_ordered_this_item')}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default OrderFeed;