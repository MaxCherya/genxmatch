import React from 'react';
import './BubbleGradient.css';

interface BubbleBackgroundProps {
    className?: string; // Optional className for additional styling
    style?: React.CSSProperties; // Optional inline styles
}

const BubbleBackground: React.FC<BubbleBackgroundProps> = ({ className = '', style }) => {
    return (
        <div className={`bubble-background ${className}`} style={style}>
            {/* Bubbles */}
            <div className="bubble" />
            <div className="bubble" />
            <div className="bubble" />
            <div className="bubble" />
        </div>
    );
};

export default BubbleBackground;