import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type FAQ = {
    question: string;
    answer: string;
};

type Props = {
    faqs: FAQ[];
};

const FAQAccordion: React.FC<Props> = ({ faqs }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
                <div
                    key={index}
                    className="border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                >
                    <button
                        onClick={() => toggle(index)}
                        className="w-full flex justify-between items-center px-4 py-3 text-left font-medium text-gray-800 hover:bg-gray-50"
                    >
                        <span>{faq.question}</span>
                        <ChevronDown
                            className={`w-5 h-5 transform transition-transform ${openIndex === index ? 'rotate-180' : ''
                                }`}
                        />
                    </button>
                    <div
                        className={`px-4 pb-4 text-sm text-gray-600 transition-all duration-300 ${openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                            }`}
                    >
                        {faq.answer}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FAQAccordion;