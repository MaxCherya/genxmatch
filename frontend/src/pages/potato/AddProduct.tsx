import React from "react";

const AddProduct: React.FC = () => {
    return (
        <div className="w-screen h-screen bg-amber-200">

            <div className="flex flex-col items-center p-2">

                <div className="flex flex-col items-center mt-20 w-full gap-1">
                    <h1 className="text-black text-3xl font-bold underline mb-4">Basic Info</h1>
                    <input placeholder="name_ukr" className="bg-white w-full p-1 rounded-xl" />
                    <input placeholder="name_eng" className="bg-white w-full p-1 rounded-xl" />
                    <input placeholder="name_rus" className="bg-white w-full p-1 rounded-xl mb-2" />

                    <input placeholder="short_description_ukr" className="bg-white w-full p-1 rounded-xl" />
                    <input placeholder="short_description_eng" className="bg-white w-full p-1 rounded-xl" />
                    <input placeholder="short_description_rus" className="bg-white w-full p-1 rounded-xl" />
                </div>

            </div>

        </div>
    )
}

export default AddProduct;