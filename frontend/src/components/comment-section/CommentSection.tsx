import React, { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import imageCompression from 'browser-image-compression';
import LoadingSpinner from '../general/LoadingSpinner';
import AttachmentsCarousel from './AttachmentCarousel';
import ReviewStars from '../item-page/ReviewStars';

interface CommentData {
    name: string;
    surname?: string;
    rating: number;
    content: string;
    images: string[];
}

interface CommentSectionProps {
    onSubmit: (data: CommentData) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ onSubmit }) => {
    const { t } = useTranslation();
    const { addToast } = useToast();

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [isCompressing, setIsCompressing] = useState(false);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const validateAndSubmit = () => {
        if (!name.trim()) return addToast(t('comments.name_required'), 'error');
        if (rating === 0) return addToast(t('comments.rating_required_error'), 'error');
        if (!content.trim()) return addToast(t('comments.comment_empty_error'), 'error');

        onSubmit({
            name: name.trim(),
            surname: surname.trim() || undefined,
            rating,
            content,
            images,
        });

        setName('');
        setSurname('');
        setRating(0);
        setContent('');
        setImages([]);
        addToast(t('comments.thank_you_review'), 'success');
    };

    const compressFiles = async (files: File[]) => {
        try {
            setIsCompressing(true);

            const compressed = await Promise.all(
                files.map(async (file) => {
                    if (!file.type.startsWith('image/')) throw new Error(t('comments.only_images_allowed'));
                    if (file.size > 1024 * 1024) throw new Error(t('comments.image_too_large'));

                    const compressedFile = await imageCompression(file, { maxSizeMB: 0.5, maxWidthOrHeight: 1200 });
                    return new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            if (e.target?.result && typeof e.target.result === 'string') resolve(e.target.result);
                            else reject(new Error(t('comments.compression_error')));
                        };
                        reader.readAsDataURL(compressedFile);
                    });
                })
            );

            setImages((prev) => [...prev, ...compressed]);
        } catch (error: any) {
            addToast(error.message || t('comments.compression_error'), 'error');
        } finally {
            setIsCompressing(false);
        }
    };

    const handleImageUpload = () => {
        if (images.length >= 5) return addToast(t('comments.upload_limit_reached'), 'error');

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.click();
        input.onchange = () => input.files && compressFiles(Array.from(input.files).slice(0, 5 - images.length));
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(false);
        if (isCompressing) return;

        const dropped = Array.from(e.dataTransfer.files).slice(0, 5 - images.length);
        if (dropped.length < e.dataTransfer.files.length) addToast(t('comments.upload_limit_reached'), 'error');
        compressFiles(dropped);
    };

    const modules = {
        toolbar: {
            container: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
                ['clean'],
            ],
            handlers: { image: handleImageUpload },
        },
    };

    useEffect(() => {
        const toolbar = document.querySelector('.ql-toolbar button.ql-image') as HTMLButtonElement | null;
        if (toolbar) toolbar.disabled = images.length >= 5;
    }, [images]);

    return (
        <>
            {isCompressing && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            )}
            <div className="w-full max-w-4xl mx-auto p-4 bg-white text-black rounded-xl shadow-lg my-8 space-y-8">
                <h2 className="text-2xl font-semibold">{t('comments.leave_a_comment')}</h2>

                <input
                    type="text"
                    placeholder={t('comments.your_name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mb-4 p-2 rounded border border-gray-300 focus:ring-green-400"
                />

                <input
                    type="text"
                    placeholder={t('comments.your_surname')}
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="w-full mb-4 p-2 rounded border border-gray-300 focus:ring-green-400"
                />

                <div className="flex items-center mb-4">
                    <p className="mr-4">{t('comments.rating_required')}</p>
                    <ReviewStars rating={rating} readOnly={false} size="md" onChange={setRating} />
                </div>

                <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    formats={['header', 'bold', 'italic', 'underline', 'strike', 'list', 'link', 'image']}
                    placeholder={t('comments.write_comment_placeholder')}
                />

                <div
                    className={`w-full pt-6 space-y-2 border-2 rounded-xl p-4 transition ${isDraggingOver ? 'border-green-500 bg-green-50 animate-pulse' : 'border-gray-400 border-dashed hover:bg-gray-100'}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                    onDragLeave={() => setIsDraggingOver(false)}
                    onDrop={handleDrop}
                >
                    <h3 className="text-lg font-semibold">{t('comments.attachments_label')}</h3>
                    <AttachmentsCarousel images={images} setImages={setImages} />
                </div>

                <button
                    onClick={validateAndSubmit}
                    className="mt-4 cursor-pointer bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg transition-all"
                >
                    {t('comments.submit_button')}
                </button>
            </div>
        </>
    );
};

export default CommentSection;