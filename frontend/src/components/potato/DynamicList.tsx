import React, { useEffect, useState } from "react";
import { Photos } from "../../pages/potato/AddProduct";

interface Params {
    setPhotos: (photos: Photos[]) => void;
}

const DynamicList: React.FC<Params> = ({ setPhotos }) => {
    const [elements, setElements] = useState<number>(0);
    const [photoInputs, setPhotoInputs] = useState<string[]>([""]);

    const handleAdd = () => {
        setPhotoInputs([...photoInputs, ""])
        setElements(elements + 1);
    };

    const handleRemove = (index: number) => {
        const newInputs = [...photoInputs];
        newInputs.splice(index, 1);
        setPhotoInputs(newInputs);
        if (elements > 0) setElements(elements - 1);
    };

    const handleChange = (index: number, value: string) => {
        const newInputs = [...photoInputs];
        newInputs[index] = value;
        setPhotoInputs(newInputs)
    }

    useEffect(() => {
        const structuredPhotos: Photos[] = photoInputs.map((url, idx) => ({
            alt: `Img ${idx + 1}`,
            src: url,
        }))
        setPhotos(structuredPhotos);
    }, [photoInputs])

    return (
        <div className="max-w-3xl w-full mx-auto p-6 bg-white rounded-2xl shadow-md space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Photos Upload</h2>

            <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
                Add Photo
            </button>

            <div className="space-y-3">
                {photoInputs.map((value, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center gap-4 p-3 bg-gray-100 rounded-xl"
                    >
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => handleChange(index, e.target.value)}
                            placeholder={`Photo URL ${index + 1}`}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={() => handleRemove(index)}
                            className="px-3 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DynamicList;