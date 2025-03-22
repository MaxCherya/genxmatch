import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from "react-i18next";

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

let messageId = 0;

const OrderFeed: React.FC = () => {
    const [messages, setMessages] = useState<OrderMessage[]>([]);
    const { t } = useTranslation();

    const MAX_MESSAGES = 5;

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
        <div className="bg-white rounded-xl p-4 shadow w-full max-w-[100%]">
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
                            className="text-sm text-gray-800 bg-gray-100 rounded px-3 py-2 h-[2.5rem]"
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