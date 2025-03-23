import React from 'react';
import ReviewStars from './ReviewStars';

type Testimonial = {
    name: string;
    text: string;
    rating?: number; // 1–5
    avatarUrl?: string;
};

type Props = {
    testimonials: Testimonial[];
};

const TestimonialsGrid: React.FC<Props> = ({ testimonials }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
                <div
                    key={index}
                    className="bg-white p-4 rounded-xl shadow-md text-gray-800 flex flex-col gap-2"
                >
                    <div className="flex items-center gap-3">
                        {t.avatarUrl ? (
                            <img
                                src={t.avatarUrl}
                                alt={t.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-white">
                                {t.name.charAt(0)}
                            </div>
                        )}
                        <div className="font-semibold">{t.name}</div>
                    </div>

                    <p className="text-sm text-gray-700">{t.text}</p>

                    {t.rating !== undefined && (
                        <ReviewStars rating={t.rating} size="sm" />
                    )}
                </div>
            ))}
        </div>
    );
};

export default TestimonialsGrid;
