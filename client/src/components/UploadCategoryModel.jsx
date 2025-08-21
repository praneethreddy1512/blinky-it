import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const UploadCategoryModel = ({ close, fetchData }) => {
    const [data, setData] = useState({
        name: "",
        image: ""
    });
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUploadCategoryImage = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        try {
            setUploadingImage(true);
            
            const formData = new FormData();
            formData.append('image', file);
    
            const authToken = localStorage.getItem('accesstoken');
    
            if (!authToken) {
                toast.error("Authentication token not found. Please log in.");
                setUploadingImage(false);
                return;
            }

            const response = await axios.post("https://blinkyit.onrender.com/api/file/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authToken}`
                },
            });

            const { data: imageResponse } = response;
            setData((prev) => ({ ...prev, image: imageResponse.data.url }));
            toast.success("Image uploaded successfully!");

        } catch (error) {
            console.error("Client-side image upload error:", error);
            toast.error(error.response?.data?.message || "Failed to upload image. Please try again.");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const authToken = localStorage.getItem('accesstoken');
            
            if (!authToken) {
                toast.error("Authentication token not found. Please log in.");
                setLoading(false);
                return;
            }

            const response = await axios.post(
                "https://blinkyit.onrender.com/api/category/add-category",
                data, 
                { 
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${authToken}` 
                    } 
                }
            );

            const { data: responseData } = response;

            if (responseData.success) {
                toast.success(responseData.message);
                close();
                fetchData();
            } else {
                toast.error(responseData.message || "Failed to add category");
            }
        } catch (error) {
            console.error("Client-side category submit error:", error);
            toast.error(error.response?.data?.message || "Failed to add category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-800 bg-opacity-60 flex items-center justify-center'>
            <div className='bg-white max-w-4xl w-full p-4 rounded'>
                <div className='flex items-center justify-between'>
                    <h1 className='font-semibold'>Category</h1>
                    <button onClick={close} className='w-fit block ml-auto'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                </div>
                <form className='my-3 grid gap-2' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor='categoryName'>Name</label>
                        <input
                            type='text'
                            id='categoryName'
                            placeholder='Enter category name'
                            value={data.name}
                            name='name'
                            onChange={handleOnChange}
                            className='bg-blue-50 p-2 border border-blue-200 focus-within:border-yellow-400 outline-none rounded'
                        />
                    </div>
                    <div className='grid gap-1'>
                        <p>Image</p>
                        <div className='flex gap-4 flex-col lg:flex-row items-center'>
                            <div className='border bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center rounded'>
                                {data.image ? (
                                    <img
                                        alt='category'
                                        src={data.image}
                                        className='w-full h-full object-scale-down'
                                    />
                                ) : (
                                    <p className='text-sm text-neutral-500'>No Image</p>
                                )}
                            </div>
                            <label htmlFor='uploadCategoryImage'>
                                <div className={`
                                    ${!data.name || uploadingImage ? "bg-yellow-300 hover:bg-yellow-400 border-amber-200 text-white"   : "border-yellow-400 hover:bg-yellow-300"}  
                                    px-4 py-2 rounded cursor-pointer border font-medium
                                `}>
                                    {uploadingImage ? "Uploading..." : "Upload Image"}
                                </div>
                                <input
                                disabled={uploadingImage}
                                onChange={handleUploadCategoryImage}
                                type='file'
                                id='uploadCategoryImage'
                                className='hidden'
                                />
                            </label>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={!data.name || !data.image || uploadingImage || loading}
                        className={`
                            ${data.name && data.image && !uploadingImage ? "bg-yellow-400 hover:bg-yellow-300" : "bg-gray-300 "}
                            py-2 font-semibold rounded
                        `}
                    >
                        {loading ? "Adding..." : "Add Category"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default UploadCategoryModel;