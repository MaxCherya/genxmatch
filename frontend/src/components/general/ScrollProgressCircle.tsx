import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ScrollProgressCircleProps = {
    scrollContainerId?: string; // Optional scrollable container
};

const ScrollProgressCircle: React.FC<ScrollProgressCircleProps> = ({
    scrollContainerId,
}) => {
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const el = scrollContainerId
            ? document.getElementById(scrollContainerId)
            : document.documentElement;

        const onScroll = () => {
            if (!el) return;

            const scrollTop = scrollContainerId ? el.scrollTop : window.scrollY;
            const scrollHeight = scrollContainerId
                ? el.scrollHeight - el.clientHeight
                : document.documentElement.scrollHeight - window.innerHeight;

            const percent = Math.min((scrollTop / scrollHeight) * 100, 100);
            setProgress(percent);

            // Hide if at top or scrolling up
            if (scrollTop <= 50 || scrollTop < lastScrollY) {
                setVisible(false);
            } else {
                setVisible(true);
            }

            setLastScrollY(scrollTop);
        };

        const listener = () => requestAnimationFrame(onScroll);

        const scrollTarget = scrollContainerId
            ? document.getElementById(scrollContainerId)
            : window;

        (scrollTarget as any)?.addEventListener("scroll", listener);
        return () => {
            (scrollTarget as any)?.removeEventListener("scroll", listener);
        };
    }, [scrollContainerId, lastScrollY]);

    // Circle setup
    const radius = 30;
    const stroke = 5;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset =
        circumference - (progress / 100) * circumference;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-1 left-1 z-50"
                >
                    <svg height={radius * 2} width={radius * 2}>
                        <circle
                            stroke="#e5e7eb"
                            fill="transparent"
                            strokeWidth={stroke}
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                        />
                        <circle
                            stroke="#10b981"
                            fill="transparent"
                            strokeWidth={stroke}
                            strokeLinecap="round"
                            strokeDasharray={`${circumference} ${circumference}`}
                            strokeDashoffset={strokeDashoffset}
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                            style={{ transition: "stroke-dashoffset 0.3s ease" }}
                        />
                    </svg>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ScrollProgressCircle;