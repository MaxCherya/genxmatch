export type Characteristic = {
    key_ua: string;
    key_eng: string;
    key_rus: string;
    value_ua: string;
    value_eng: string;
    value_rus: string;
};

interface Params {
    characteristics: Characteristic[];
    setCharacteristics: React.Dispatch<React.SetStateAction<Characteristic[]>>;
}

const DynamicCharacteristics: React.FC<Params> = ({
    characteristics,
    setCharacteristics,
}) => {
    const handleAdd = () => {
        setCharacteristics([
            ...characteristics,
            {
                key_ua: "",
                key_eng: "",
                key_rus: "",
                value_ua: "",
                value_eng: "",
                value_rus: "",
            },
        ]);
    };

    const handleRemove = (index: number) => {
        const updated = [...characteristics];
        updated.splice(index, 1);
        setCharacteristics(updated);
    };

    const handleChange = (
        index: number,
        field: keyof Characteristic,
        value: string
    ) => {
        const updated = [...characteristics];
        updated[index][field] = value;
        setCharacteristics(updated);
    };

    return (
        <div className="max-w-3xl w-full mx-auto p-6 bg-white rounded-2xl shadow-md space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Charateristics info</h2>
            <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
                Add Characteristic
            </button>

            {characteristics.map((item, index) => (
                <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-100 p-4 rounded-xl"
                >
                    <input
                        placeholder="key_ua"
                        value={item.key_ua}
                        onChange={(e) => handleChange(index, "key_ua", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded"
                    />
                    <input
                        placeholder="key_eng"
                        value={item.key_eng}
                        onChange={(e) => handleChange(index, "key_eng", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded"
                    />
                    <input
                        placeholder="key_rus"
                        value={item.key_rus}
                        onChange={(e) => handleChange(index, "key_rus", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded"
                    />

                    <input
                        placeholder="value_ua"
                        value={item.value_ua}
                        onChange={(e) => handleChange(index, "value_ua", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded"
                    />
                    <input
                        placeholder="value_eng"
                        value={item.value_eng}
                        onChange={(e) => handleChange(index, "value_eng", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded"
                    />
                    <input
                        placeholder="value_rus"
                        value={item.value_rus}
                        onChange={(e) => handleChange(index, "value_rus", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded"
                    />

                    <div className="col-span-full flex justify-end">
                        <button
                            onClick={() => handleRemove(index)}
                            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DynamicCharacteristics;