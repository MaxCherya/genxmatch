import React, { useState } from 'react';
import { X } from 'lucide-react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { useSortable, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import imageCompression from 'browser-image-compression';

interface AttachmentsCarouselProps {
    images: string[];
    setImages: (images: string[]) => void;
}

const DraggableImage: React.FC<{
    src: string;
    index: number;
    onDelete: (index: number) => void;
    onClick: (index: number) => void;
}> = ({ src, index, onDelete, onClick }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: index });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="relative flex justify-center items-center bg-gray-100 rounded-lg p-2 mx-2 cursor-move"
        >
            {/* Delete button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(index);
                }}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 z-10"
                title="Remove"
            >
                <X size={16} />
            </button>

            {/* Image */}
            <img
                src={src}
                alt={`attachment-${index}`}
                className="object-contain max-h-[400px] cursor-pointer"
                onClick={() => onClick(index)}
            />
        </div>
    );
};

const AttachmentsCarousel: React.FC<AttachmentsCarouselProps> = ({ images, setImages }) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over) return;

        const oldIndex = active.id;
        const newIndex = over.id;

        if (oldIndex !== newIndex) {
            const updatedImages = [...images];
            const [moved] = updatedImages.splice(oldIndex, 1);
            updatedImages.splice(newIndex, 0, moved);
            setImages(updatedImages);
        }
    };

    const handleDelete = (index: number) => {
        const updatedImages = images.filter((_, idx) => idx !== index);
        setImages(updatedImages);
    };

    const handleOpenLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(false);

        const droppedFiles = Array.from(e.dataTransfer.files);

        const availableSlots = 5 - images.length;
        const filesToProcess = droppedFiles.slice(0, availableSlots);

        if (filesToProcess.length < droppedFiles.length) {
            alert(`You can only upload ${availableSlots} more image(s).`);
        }

        try {
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
            const updatedImages = [...images, ...compressedImages];
            setImages(updatedImages);
        } catch (error: any) {
            console.error('Image compression error:', error);
            alert(error.message || 'Failed to compress images.');
        }
    };

    return (
        <>
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingOver(true);
                }}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={handleDrop}
                className={`flex overflow-x-auto gap-4 p-2 rounded-lg transition-all ${isDraggingOver ? 'border-2 border-green-500 bg-green-50 animate-pulse' : 'border-2 border-gray-400 border-dashed'
                    }`}
            >
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext
                        items={images.map((_, index) => index)}
                        strategy={horizontalListSortingStrategy}
                    >
                        {images.map((src, idx) => (
                            <DraggableImage
                                key={idx}
                                src={src}
                                index={idx}
                                onDelete={handleDelete}
                                onClick={handleOpenLightbox}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>

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
        </>
    );
};

export default AttachmentsCarousel;