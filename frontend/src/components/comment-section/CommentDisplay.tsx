import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import ReviewStars from '../item-page/ReviewStars';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { motion } from 'framer-motion';

interface CommentDisplayProps {
    content: string;
    name: string;
    surname?: string;
    rating: number;
    images: string[];
    createdAt?: string;
}

const CommentDisplay: React.FC<CommentDisplayProps> = ({
    content,
    name,
    surname,
    rating,
    images,
    createdAt
}) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const handleOpenLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    };

    return (
        <motion.div
            className="w-full bg-white rounded-xl shadow-md p-6 mb-8 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Top: Name, Rating, Date */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-4">
                    <div className="text-lg font-semibold text-black">
                        {name} {surname && surname}
                    </div>
                    <ReviewStars rating={rating} size="md" readOnly />
                </div>
                {createdAt && (
                    <div className="text-sm text-gray-500">
                        {formatDate(createdAt)}
                    </div>
                )}
            </div>

            {/* Content */}
            <div
                className="text-gray-800 text-base leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
            />

            {/* Attachments */}
            {images.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                    {images.map((src, idx) => (
                        <img
                            key={idx}
                            src={src}
                            alt={`attachment-${idx}`}
                            className="w-32 h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                            onClick={() => handleOpenLightbox(idx)}
                        />
                    ))}
                </div>
            )}

            {/* Lightbox */}
            {lightboxOpen && (
                <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    slides={images.map((src) => ({ src }))}
                    index={lightboxIndex}
                    plugins={[Zoom]}
                />
            )}
        </motion.div>
    );
};

export default CommentDisplay;