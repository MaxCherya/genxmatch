import React, { useEffect, useState } from "react";
import { getSuppliers, SuppliersBackend, createItem, getCategories } from "../../endpoints/potato";
import DynamicList from "../../components/potato/DynamicList";
import DynamicCharacteristics from "../../components/potato/DynamicCharateristics";
import CategoriesSelector from "../../components/potato/CategoriesSelector";
import CTAButton from "../../components/btns/CTAButton";
import { CategoriesBackend } from "../../endpoints/potato";
import { checkIsPotato } from "../../endpoints/routing";
import { useNavigate } from "react-router-dom";

export type Photos = {
    alt: string,
    src: string
};

export type Characteristic = {
    key_ua: string;
    key_eng: string;
    key_rus: string;
    value_ua: string;
    value_eng: string;
    value_rus: string;
};

export type ProductFormData = {
    name_ua: string;
    name_eng: string;
    name_rus: string;
    short_description_ua: string;
    short_description_eng: string;
    short_description_rus: string;
    supplier: string;
    artiqul: string;
    sold: number;
    price_original_uah: number;
    price_uah: number;
    min_price_uah: number;
    old_price_uah: string;
    item_length: number;
    item_height: number;
    item_weight: number;
    item_width: number;
    description_p1_ua: string;
    description_p1_eng: string;
    description_p1_rus: string;
    description_p2_ua: string;
    description_p2_eng: string;
    description_p2_rus: string;
    feature_header_1_ua: string;
    feature_header_1_eng: string;
    feature_header_1_rus: string;
    feature_1_ua: string;
    feature_1_eng: string;
    feature_1_rus: string;
    feature_header_2_ua: string;
    feature_header_2_eng: string;
    feature_header_2_rus: string;
    feature_2_ua: string;
    feature_2_eng: string;
    feature_2_rus: string;
    feature_header_3_ua: string;
    feature_header_3_eng: string;
    feature_header_3_rus: string;
    feature_3_ua: string;
    feature_3_eng: string;
    feature_3_rus: string;
    feature_header_4_ua: string;
    feature_header_4_eng: string;
    feature_header_4_rus: string;
    feature_4_ua: string;
    feature_4_eng: string;
    feature_4_rus: string;
    main_image_url: string;
    video_url: string;
    video_poster_url: string;
};

const AddProduct: React.FC = () => {
    const [suppliers, setSuppliers] = useState<SuppliersBackend[]>([]);
    const [photos, setPhotos] = useState<Photos[]>([]);
    const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
    const [categories, setCategories] = useState<number[]>([]);
    const [allCategories, setAllCategories] = useState<CategoriesBackend[]>([]);
    const [useJsonMode, setUseJsonMode] = useState(false);
    const [jsonInput, setJsonInput] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const addButton = async () => {
            const res = await checkIsPotato();
            if (res.success) {
                return
            }
            else {
                navigate('/catalog')
            }
        }

        addButton()
    }, [])

    const renderCategoryList = (cats: CategoriesBackend[], indent: number = 0): React.ReactNode =>
        cats.map((cat) => (
            <div key={cat.id} style={{ paddingLeft: `${indent * 20}px` }}>
                <span className="text-sm text-gray-700">{cat.name_ua} (ID: {cat.id})</span>
                {cat.subcategories?.length > 0 && renderCategoryList(cat.subcategories, indent + 1)}
            </div>
        ));

    const renderSupplierList = (): React.ReactNode => (
        <div className="space-y-1">
            {suppliers.map((s) => (
                <div key={s.id}>
                    <span className="text-sm text-gray-700">{s.name} (ID: {s.id})</span>
                </div>
            ))}
        </div>
    );


    const [productData, setProductData] = useState<ProductFormData>({
        name_ua: "",
        name_eng: "",
        name_rus: "",
        short_description_ua: "",
        short_description_eng: "",
        short_description_rus: "",
        supplier: "",
        artiqul: "",
        sold: 0,
        price_original_uah: 0,
        price_uah: 0,
        min_price_uah: 0,
        old_price_uah: "",
        item_length: 0,
        item_height: 0,
        item_weight: 0,
        item_width: 0,
        description_p1_ua: "",
        description_p1_eng: "",
        description_p1_rus: "",
        description_p2_ua: "",
        description_p2_eng: "",
        description_p2_rus: "",
        feature_header_1_ua: "",
        feature_header_1_eng: "",
        feature_header_1_rus: "",
        feature_1_ua: "",
        feature_1_eng: "",
        feature_1_rus: "",
        feature_header_2_ua: "",
        feature_header_2_eng: "",
        feature_header_2_rus: "",
        feature_2_ua: "",
        feature_2_eng: "",
        feature_2_rus: "",
        feature_header_3_ua: "",
        feature_header_3_eng: "",
        feature_header_3_rus: "",
        feature_3_ua: "",
        feature_3_eng: "",
        feature_3_rus: "",
        feature_header_4_ua: "",
        feature_header_4_eng: "",
        feature_header_4_rus: "",
        feature_4_ua: "",
        feature_4_eng: "",
        feature_4_rus: "",
        main_image_url: "",
        video_url: "",
        video_poster_url: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [suppliersData, categoriesData] = await Promise.all([
                    getSuppliers(),
                    getCategories()
                ]);
                setSuppliers(suppliersData);
                setAllCategories(categoriesData);
            } catch (err) {
                console.error("Init data fetch error", err);
            }
        };
        fetchData();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setProductData((prev) => ({
            ...prev,
            [name]: name === "old_price_uah" ? value : typeof prev[name as keyof ProductFormData] === 'number' ? Number(value) : value,
        }));
    };

    const handleSubmit = async () => {
        for (const [key, value] of Object.entries(productData)) {
            if (key !== "old_price_uah" && value === "") {
                alert(`Field '${key}' is required and must be filled.`);
                return;
            }
        }
        if (productData.price_uah <= 0 || productData.min_price_uah <= 0) {
            alert("Prices must be greater than 0.");
            return;
        }
        if (productData.price_original_uah >= productData.price_uah) {
            alert("Original price must be less than sale price.");
            return;
        }
        if (categories.length === 0) {
            alert("Please select at least one category.");
            return;
        }
        if (photos.length === 0) {
            alert("Please add at least one photo.");
            return;
        }

        try {
            const payload = {
                ...productData,
                old_price_uah: productData.old_price_uah ? Number(productData.old_price_uah) : 0,
                gallery: photos,
                categories,
                characteristics,
            };
            const result = await createItem(payload);
            alert(`Item created successfully with ID: ${result.id}`);
        } catch (err: any) {
            alert(`Failed to create item: ${err.message}`);
        }
    };

    const handleJsonSubmit = async () => {
        let parsed: any[];
        try {
            parsed = JSON.parse(jsonInput);
            if (!Array.isArray(parsed)) throw new Error("Input must be a JSON array.");
        } catch (err: any) {
            return alert(`Invalid JSON: ${err.message}`);
        }

        for (const item of parsed) {
            try {
                const payload = {
                    ...item,
                    old_price_uah: item.old_price_uah ? Number(item.old_price_uah) : 0,
                    gallery: item.gallery || [],
                    categories: item.categories || [],
                    characteristics: item.characteristics || [],
                };
                await createItem(payload);
            } catch (err: any) {
                console.error("Error submitting item", item, err);
                alert(`Failed to create one of the items: ${err.message}`);
            }
        }

        alert("Bulk creation from JSON completed.");
    };

    const formatLabel = (key: string) => key.split("_").join(" ");

    return (
        <div className="w-[99svw] min-h-screen bg-amber-200 p-4">
            <div className="flex flex-col items-center gap-4 mt-20">
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => setUseJsonMode((prev) => !prev)}
                >
                    {useJsonMode ? "Switch to Form Mode" : "Paste JSON Instead"}
                </button>

                {useJsonMode ? (
                    <div className="w-full max-w-4xl space-y-4">
                        <p className="text-lg font-semibold">📥 Bulk JSON Format</p>
                        <div className="w-full max-w-4xl">
                            <h2 className="text-lg font-semibold">🧩 Available Categories</h2>
                            <div className="bg-gray-100 rounded p-3 mb-4 text-sm">
                                {renderCategoryList(allCategories)}
                            </div>
                            <h2 className="text-lg font-semibold">🏷️ Available Suppliers</h2>
                            <div className="bg-gray-100 rounded p-3 mb-6 text-sm">
                                {renderSupplierList()}
                            </div>
                        </div>
                        <pre className="bg-gray-100 text-sm p-3 rounded-lg overflow-x-auto">
                            {`[
  {
    "name_ua": "Назва товару",
    "name_eng": "Product Name",
    "name_rus": "Название товара",
    "short_description_ua": "Короткий опис",
    "short_description_eng": "Short description",
    "short_description_rus": "Краткое описание",
    "supplier": "1",
    "artiqul": "SKU123",
    "sold": 0,
    "price_original_uah": 100,         // Must be < price_uah
    "price_uah": 200,                  // Required
    "min_price_uah": 150,             // Required
    "old_price_uah": 180,             // Optional
    "item_length": 10,                // cm
    "item_height": 5,                 // cm
    "item_weight": 0.3,               // kg
    "item_width": 5,                  // cm
    "description_p1_ua": "Опис абзац 1",
    "description_p1_eng": "Description paragraph 1",
    "description_p1_rus": "Описание абзац 1",
    "description_p2_ua": "Опис абзац 2",
    "description_p2_eng": "Description paragraph 2",
    "description_p2_rus": "Описание абзац 2",
    
    "feature_header_1_ua": "Заголовок 1",
    "feature_header_1_eng": "Header 1",
    "feature_header_1_rus": "Заголовок 1",
    "feature_1_ua": "Перевага 1",
    "feature_1_eng": "Feature 1",
    "feature_1_rus": "Преимущество 1",

    "feature_header_2_ua": "Заголовок 2",
    "feature_header_2_eng": "Header 2",
    "feature_header_2_rus": "Заголовок 2",
    "feature_2_ua": "Перевага 2",
    "feature_2_eng": "Feature 2",
    "feature_2_rus": "Преимущество 2",

    "feature_header_3_ua": "Заголовок 3",
    "feature_header_3_eng": "Header 3",
    "feature_header_3_rus": "Заголовок 3",
    "feature_3_ua": "Перевага 3",
    "feature_3_eng": "Feature 3",
    "feature_3_rus": "Преимущество 3",

    "feature_header_4_ua": "Заголовок 4",
    "feature_header_4_eng": "Header 4",
    "feature_header_4_rus": "Заголовок 4",
    "feature_4_ua": "Перевага 4",
    "feature_4_eng": "Feature 4",
    "feature_4_rus": "Преимущество 4",

    "main_image_url": "https://example.com/main.jpg",
    "video_url": "https://example.com/video.mp4",
    "video_poster_url": "https://example.com/poster.jpg",

    "gallery": [
      { "alt": "Photo 1", "src": "https://example.com/img1.jpg" },
      { "alt": "Photo 2", "src": "https://example.com/img2.jpg" }
    ],

    "categories": [1, 2],
    "characteristics": [
      {
        "key_ua": "Матеріал",
        "key_eng": "Material",
        "key_rus": "Материал",
        "value_ua": "Пластик",
        "value_eng": "Plastic",
        "value_rus": "Пластик"
      },
      {
        "key_ua": "Колір",
        "key_eng": "Color",
        "key_rus": "Цвет",
        "value_ua": "Білий",
        "value_eng": "White",
        "value_rus": "Белый"
      }
    ]
  }
]`}
                        </pre>
                        <textarea
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            className="w-full h-96 bg-white p-4 rounded-xl"
                            placeholder="Paste JSON array of items here..."
                        />
                    </div>
                ) : (
                    <>
                        {Object.entries(productData).map(([key, value]) => {
                            if (key === "supplier") return null;
                            return (
                                <div className="w-full lg:w-3xl" key={key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {formatLabel(key)}
                                    </label>
                                    <input
                                        name={key}
                                        value={value}
                                        onChange={handleChange}
                                        className="bg-white w-full p-1 rounded-xl"
                                        type={typeof value === "number" && key !== "old_price_uah" ? "number" : "text"}
                                    />
                                </div>
                            );
                        })}

                        <select
                            name="supplier"
                            value={productData.supplier}
                            onChange={handleChange}
                            className="bg-white w-full lg:w-3xl p-1 rounded-xl mb-2"
                        >
                            <option value="">Select supplier</option>
                            {suppliers.map((supplier) => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                </option>
                            ))}
                        </select>

                        <DynamicCharacteristics
                            characteristics={characteristics}
                            setCharacteristics={setCharacteristics}
                        />

                        <CategoriesSelector
                            selected={categories}
                            onChange={setCategories}
                        />

                        <DynamicList setPhotos={setPhotos} />
                    </>
                )}

                <div className="w-full max-w-3xl">
                    <CTAButton
                        fullWidth
                        label="Submit"
                        onClick={useJsonMode ? handleJsonSubmit : handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
};

export default AddProduct;