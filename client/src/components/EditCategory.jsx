import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import toast from "react-hot-toast";
// import uploadImage from "../utils/UploadImage";
const EditCategory = ({ close, fetchData, data: CategoryData }) => {
  const [data, setData] = useState({
    _id: CategoryData._id,
    name: CategoryData.name,
    image: CategoryData.image,
  });

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const authToken = localStorage.getItem("accesstoken");
      if (!authToken) {
        toast.error("Authentication token not found. Please log in.");
        setUploadingImage(false);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}file/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const { data: imageResponse } = response;
      if (imageResponse && imageResponse.data && imageResponse.data.url) {
        setData((prev) => ({
          ...prev,
          image: imageResponse.data.url,
        }));
        toast.success("Image uploaded successfully");
      } else {
        toast.error(
          "Image upload failed: Unexpected response format from server."
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to upload image. Please try again."
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.name || !data.image) {
      toast.error("Name and image are required");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("accesstoken");

      if (!token) {
        toast.error("Authentication token not found. Please log in.");
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}category/update-category`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        close();
        fetchData();
      } else {
        toast.error(responseData.message || "Failed to update category");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-800 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white max-w-4xl w-full p-4 rounded shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">Update Category</h1>
          <button onClick={close} className="w-fit block ml-auto">
            <IoClose size={25} />
          </button>
        </div>

        <form className="my-3 grid gap-2" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="categoryName">Name</label>
            <input
              type="text"
              id="categoryName"
              placeholder="Enter category name"
              value={data.name}
              name="name"
              onChange={handleOnChange}
              className="bg-blue-50 p-2 border border-blue-100 focus-within:border-yellow-400 outline-none rounded"
            />
          </div>

          <div className="grid gap-1">
            <p>Image</p>
            <div className="flex gap-4 flex-col lg:flex-row items-center">
              <div className="border bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center rounded overflow-hidden">
                {data.image ? (
                  <img
                    alt="category"
                    src={data.image}
                    className="w-full h-full object-scale-down"
                  />
                ) : (
                  <p className="text-sm text-neutral-500">No Image</p>
                )}
              </div>

              <label htmlFor="uploadCategoryImage">
                <div
                  className={`${
                    uploadingImage
                      ? "bg-gray-300"
                      : "border-yellow-400 hover:bg-yellow-300"
                  } px-4 py-2 rounded cursor-pointer border font-medium`}
                >
                  {uploadingImage ? "Uploading..." : "Upload Image"}
                </div>
              </label>
              <input
                disabled={uploadingImage}
                onChange={handleUploadCategoryImage}
                type="file"
                id="uploadCategoryImage"
                className="hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!data.name || !data.image || loading || uploadingImage}
            className={`${
              data.name && data.image && !loading && !uploadingImage
                ? "bg-yellow-400 hover:bg-yellow-300"
                : "bg-gray-300"
            } py-2 font-semibold rounded`}
          >
            {loading ? "Updating..." : "Update Category"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditCategory;
