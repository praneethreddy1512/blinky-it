import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import axios from 'axios';

const UploadSubCategoryModel = ({ close, fetchData }) => {
    const [subCategoryData, setSubCategoryData] = useState({
        name: "",
        image: "",
        category: []
    });
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const allCategory = useSelector(state => state.product.allCategory);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSubCategoryData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUploadSubCategoryImage = async (e) => {
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

            const response = await axios.post("http://localhost:8800/api/file/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authToken}`
                }
            });

            const { data: imageResponse } = response;
            setSubCategoryData((prev) => ({
                ...prev,
                image: imageResponse.data.url
            }));

            toast.success("Image uploaded successfully!");
        } catch (error) {
            console.error("Client-side image upload error:", error);
            toast.error(error.response?.data?.message || "Failed to upload image. Please try again.");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleRemoveCategorySelected = (categoryId) => {
        setSubCategoryData((prev) => ({
            ...prev,
            category: prev.category.filter(cat => cat._id !== categoryId)
        }));
    };

    const handleSubmitSubCategory = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const authToken = localStorage.getItem('accesstoken');
            if (!authToken) {
                toast.error("Authentication token not found. Please log in.");
                setLoading(false);
                return;
            }

            const payload = {
                ...subCategoryData,
                category: subCategoryData.category.map(cat => cat._id),
            };

            const response = await axios.post(
                "http://localhost:8800/api/subcategory/create",
                payload,
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
                toast.error(responseData.message || "Failed to add sub category");
            }
        } catch (error) {
            console.error("Client-side sub category submit error:", error);
            toast.error(error.response?.data?.message || "Failed to add sub category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='fixed top-0 right-0 bottom-0 left-0 bg-neutral-800 bg-opacity-70 z-50 flex items-center justify-center p-4'>
        <div className='w-full max-w-5xl bg-white p-4 rounded'>
            <div className='flex items-center justify-between gap-3'>
                <h1 className='font-semibold'>Add Sub Category</h1>
                <button onClick={close}>
                    <IoClose size={25}/>
                </button>
            </div>
            <form className='my-3 grid gap-3' onSubmit={handleSubmitSubCategory}>
                    <div className='grid gap-1'>
                        <label htmlFor='name'>Name</label>
                        <input 
                            id='name'
                            name='name'
                            value={subCategoryData.name}
                            onChange={handleChange}
                            className='p-3 bg-blue-50 border outline-none focus-within:border-yellow-400 rounded '
                        />
                    </div>
                    <div className='grid gap-1'>
                        <p>Image</p>
                        <div className='flex flex-col lg:flex-row items-center gap-3'>
                            <div className='border h-36 w-full lg:w-36 bg-blue-50 flex items-center justify-center'>
                                {
                                    !subCategoryData.image ? (
                                        <p className='text-sm text-neutral-400'>No Image</p>
                                    ) : (
                                        <img
                                            alt='subCategory'
                                            src={subCategoryData.image}
                                            className='w-full h-full object-scale-down'
                                        />
                                    )
                                }
                            </div>
                            <label htmlFor='uploadSubCategoryImage'>
                                <div className={`
                                    ${!subCategoryData.name || uploadingImage ? "bg-yellow-300 hover:bg-yellow-400 border-amber-200 text-white"   : "border-yellow-400 hover:bg-yellow-300"}  
                                    px-4 py-2 rounded cursor-pointer border font-medium
                                `}>
                                    {uploadingImage ? "Uploading..." : "Upload Image"}
                                </div>
                                <input
                                disabled={uploadingImage}
                                onChange={handleUploadSubCategoryImage}
                                type='file'
                                id='uploadSubCategoryImage'
                                className='hidden'
                                />
                            </label>
                            
                        </div>
                    </div>
                    <div className='grid gap-1'>
                        <label>Select Category</label>
                        <div className='border focus-within:border-yellow-400 rounded'>
                            <div className='flex flex-wrap gap-2'>
                                {
                                    subCategoryData.category.map((cat,index)=>{
                                        return(
                                            <p key={cat._id+"selectedValue"} className='bg-white shadow-md px-1 m-1 flex items-center gap-2'>
                                                {cat.name}
                                                <div className='cursor-pointer hover:text-red-600' onClick={()=>handleRemoveCategorySelected(cat._id)}>
                                                    <IoClose size={20}/>
                                                </div>
                                            </p>
                                        )
                                    })
                                }
                            </div>

                            <select
                                className='w-full p-2 bg-transparent outline-none border'
                                onChange={(e)=>{
                                    const value = e.target.value
                                    const categoryDetails = allCategory.find(el => el._id == value)
                                    
                                    setSubCategoryData((preve)=>{
                                        return{
                                            ...preve,
                                            category : [...preve.category,categoryDetails]
                                        }
                                    })
                                }}
                            >
                                <option value={""}>Select Category</option>
                                {
                                    allCategory.map((category,index)=>{
                                        return(
                                            <option value={category?._id} key={category._id+"subcategory"}>{category?.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>

                  <button
                        type="submit"
                        disabled={!subCategoryData.name || !subCategoryData.image || uploadingImage || loading}
                        className={`
                            ${subCategoryData.name && subCategoryData.image && !uploadingImage ? "bg-yellow-400 hover:bg-yellow-300" : "bg-gray-300 "}
                            py-2 font-semibold rounded
                        `}
                    >
                        {loading ? "Adding..." : "Add Category"}
                    </button>
            </form>
        </div>
    </section>
  )
};

export default UploadSubCategoryModel;
