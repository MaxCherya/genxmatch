import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import ReviewStars from '../item-page/ReviewStars';
import imageCompression from 'browser-image-compression';
import LoadingSpinner from '../general/LoadingSpinner';
import AttachmentsCarousel from './AttachmentCarousel';
import { useToast } from '../../contexts/ToastContext';

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
    const { addToast } = useToast(); // 🆕 Toast hook

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [isCompressing, setIsCompressing] = useState(false);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const handleSubmit = () => {
        if (!name.trim()) {
            addToast('Name is required.', 'error');
            return;
        }
        if (rating === 0) {
            addToast('Rating is required.', 'error');
            return;
        }
        if (content.trim() === '') {
            addToast('Comment cannot be empty.', 'error');
            return;
        }

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
        addToast('Thank you for your review!', 'success'); // 🆕 Success toast after submit
    };

    const imageHandler = () => {
        if (images.length >= 5) {
            addToast('You can upload up to 5 attachments only.', 'error');
            return;
        }

        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.setAttribute('multiple', 'multiple');
        input.click();

        input.onchange = async () => {
            if (!input.files) return;

            const selectedFiles = Array.from(input.files);
            const availableSlots = 5 - images.length;
            const filesToProcess = selectedFiles.slice(0, availableSlots);

            if (filesToProcess.length < selectedFiles.length) {
                addToast(`You can only upload ${availableSlots} more image(s).`, 'error');
            }

            try {
                setIsCompressing(true);

                const compressedImagesPromises = filesToProcess.map(async (file) => {
                    if (!file.type.startsWith('image/')) {
                        throw new Error('Only images are allowed!');
                    }
                    if (file.size > 1024 * 1024) {
                        throw new Error('Image too large. Max 1MB.');
                    }

                    const options = {
                        maxSizeMB: 0.5,
                        maxWidthOrHeight: 1200,
                        useWebWorker: true,
                    };
                    const compressedFile = await imageCompression(file, options);

                    return new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            if (e.target?.result && typeof e.target.result === 'string') {
                                resolve(e.target.result);
                            } else {
                                reject(new Error('Failed to read image.'));
                            }
                        };
                        reader.readAsDataURL(compressedFile);
                    });
                });

                const compressedImages = await Promise.all(compressedImagesPromises);
                setImages((prev) => [...prev, ...compressedImages]);
            } catch (error: any) {
                console.error('Image compression error:', error);
                addToast(error.message || 'Failed to compress images.', 'error');
            } finally {
                setIsCompressing(false);
            }
        };
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(false);

        if (isCompressing) return;

        const droppedFiles = Array.from(e.dataTransfer.files);
        const availableSlots = 5 - images.length;
        const filesToProcess = droppedFiles.slice(0, availableSlots);

        if (filesToProcess.length < droppedFiles.length) {
            addToast(`You can only upload ${availableSlots} more image(s).`, 'error');
        }

        try {
            setIsCompressing(true);

            const compressedImagesPromises = filesToProcess.map(async (file) => {
                if (!file.type.startsWith('image/')) {
                    throw new Error('Only images are allowed!');
                }
                if (file.size > 1024 * 1024) {
                    throw new Error('Image too large. Max 1MB.');
                }

                const options = {
                    maxSizeMB: 0.5,
                    maxWidthOrHeight: 1200,
                    useWebWorker: true,
                };
                const compressedFile = await imageCompression(file, options);

                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        if (e.target?.result && typeof e.target.result === 'string') {
                            resolve(e.target.result);
                        } else {
                            reject(new Error('Failed to read image.'));
                        }
                    };
                    reader.readAsDataURL(compressedFile);
                });
            });

            const compressedImages = await Promise.all(compressedImagesPromises);
            setImages((prev) => [...prev, ...compressedImages]);
        } catch (error: any) {
            console.error('Image compression error:', error);
            addToast(error.message || 'Failed to compress images.', 'error');
        } finally {
            setIsCompressing(false);
        }
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
            handlers: {
                image: imageHandler,
            },
        },
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list',
        'link', 'image'
    ];

    useEffect(() => {
        const toolbar = document.querySelector('.ql-toolbar');
        if (!toolbar) return;

        const imageButton = toolbar.querySelector('button.ql-image') as HTMLButtonElement | null;
        if (imageButton) {
            if (images.length >= 5) {
                imageButton.disabled = true;
                imageButton.classList.add('cursor-not-allowed', 'opacity-50');
            } else {
                imageButton.disabled = false;
                imageButton.classList.remove('cursor-not-allowed', 'opacity-50');
            }
        }
    }, [images]);

    return (
        <>
            {isCompressing &&
                <div className='w-screen h-screen overflow-hidden'>
                    <LoadingSpinner />
                </div>
            }
            <div className="w-full max-w-4xl mx-auto p-4 text-black bg-white rounded-xl shadow-lg my-8 space-y-8">
                <h2 className="text-2xl font-semibold mb-4 text-black">Leave a Comment</h2>

                {/* Form Inputs */}
                <input
                    type="text"
                    placeholder="Your Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mb-4 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                />

                <input
                    type="text"
                    placeholder="Your Surname (optional)"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="w-full mb-4 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                />

                <div className="flex items-center mb-4">
                    <p className="text-black mr-4">Rating *</p>
                    <ReviewStars
                        rating={rating}
                        size="md"
                        readOnly={false}
                        onChange={(value: any) => setRating(value)}
                    />
                </div>

                {/* Text Editor */}
                <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    formats={formats}
                    placeholder="Write your comment here..."
                />

                {/* Attachments */}
                {images.length >= 0 && (
                    <div
                        className={`w-full pt-6 space-y-2 border-2 rounded-xl p-4 transition cursor-pointer ${isDraggingOver ? 'border-green-500 bg-green-50 animate-pulse' : 'border-gray-400 border-dashed hover:bg-gray-100'
                            }`}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDraggingOver(true);
                        }}
                        onDragLeave={() => setIsDraggingOver(false)}
                        onDrop={handleDrop}
                    >
                        <h3 className="text-lg font-semibold mb-2 text-black">
                            Attachments (drag to reorder):
                        </h3>
                        <AttachmentsCarousel images={images} setImages={setImages} />
                    </div>
                )}

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    className="mt-4 bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg transition-all"
                >
                    Submit
                </button>
            </div>
        </>
    );
};

export default CommentSection;