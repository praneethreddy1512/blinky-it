import React from "react";
import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../utils/UploadImage";
import Loading from "../components/Loading";
import ViewImage from "../components/ViewImage";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import AddFieldComponent from "../components/AddFieldComponent";
import axios from "axios";
import toast from "react-hot-toast";

const UploadProduct = () => {
  const [Imageloading, setImageloading] = useState(false);
  const [viewImageURL, setViewImageURL] = useState("");
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: 0,
    price: 0,
    discount: 0,
    description: "",
    more_details: {},
  });
  const allCategory = useSelector((state) => state.product.allCategory);
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const allSubCategory = useSelector((state) => state.product.allSubCategory);

  const [openMoreDetails, setOpenMoreDetails] = useState(false);
  const [fieldName, setFieldName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    setImageloading(true);
    const response = await uploadImage(file);
    const { data: ImageResponse } = response;
    console.log(response);

    const imageURL = ImageResponse.data.url;
    setData((prevData) => ({
      ...prevData,
      image: [...prevData.image, imageURL],
    }));
    setImageloading(false);
  };

  const handleDeleteImage = async (index) => {
    data.image.splice(index, 1);
    setData((preve) => {
      return {
        ...preve,
      };
    });
  };

  const handleRemoveCategory = async (index) => {
    data.category.splice(index, 1);
    setData((preve) => {
      return {
        ...preve,
      };
    });
  };

  const handleRemoveSubCategory = async (index) => {
    data.subCategory.splice(index, 1);
    setData((preve) => {
      return {
        ...preve,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const authToken = localStorage.getItem("accesstoken");
      if (!authToken) {
        toast.error("Authentication token not found. Please log in.");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}product/upload-product`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Product Uploaded Successfully");
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: 0,
          price: 0,
          discount: 0,
          description: "",
          more_details: {},
        });
      }
    } catch {
      toast.error("Failed to Upload Product");
    }
  };
  return (
    <section className="">
      <div className="p-2 bg-white shadow-md flex items-center justify-between mt-2 mr-2">
        <h2 className="font-semibold">Upload Product</h2>
      </div>
      <div className="p-4 rounded-md">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter Product Name"
              value={data.name}
              onChange={handleChange}
              required
              className="border border-gray-300 bg-blue-50 outline-none focus-within:border-yellow-400 rounded-md p-2 w-full"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              type="text"
              name="description"
              placeholder="Enter Product Description"
              value={data.description}
              onChange={handleChange}
              required
              multiple
              rows={3}
              className="border border-gray-300 bg-blue-50 outline-none focus-within:border-yellow-400 rounded-md p-2 w-full resize-none"
            />
          </div>
          <div className="grid gap-2">
            <p className="font-medium">Image</p>
            <label
              htmlFor="image"
              className="bg-neutral-100 rounded-md h-24 p-2 w-full flex items-center justify-center cursor-pointer"
            >
              <div className="flex text-center justify-center items-center gap-2 flex-col">
                {Imageloading ? (
                  <Loading />
                ) : (
                  <>
                    <FaCloudUploadAlt className="text-2xl text-gray-500" />
                    <p className="text-gray-500">Upload Image</p>
                  </>
                )}
              </div>
              <input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            <div className="flex flex-wrap gap-4">
              {data?.image?.map((image, index) => {
                return (
                  <div
                    key={image + index}
                    className="h-20 w-20 mt-1 min-w-20 bg-blue-50 border relative group"
                  >
                    <img
                      src={image}
                      alt="product"
                      className="w-full h-full object-scale-down"
                      onClick={() => setViewImageURL(image)}
                    />
                    <div
                      className="absolute bottom-0 right-0 p-1 rounded bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white hidden group-hover:block"
                      onClick={(index) => handleDeleteImage(index)}
                    >
                      <MdDelete style={{ fontSize: 20 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <label>Category</label>
            <select
              name="category"
              value={selectCategory}
              onChange={(e) => {
                const value = e.target.value;
                const category = allCategory.find((cat) => cat._id === value);

                setData((preve) => {
                  return {
                    ...preve,
                    category: [...preve.category, category],
                  };
                });
                setSelectCategory("");
              }}
              className="border border-gray-300 bg-blue-50 outline-none focus-within:border-yellow-400 rounded-md p-2 w-full"
            >
              <option value="">Select Category</option>
              {allCategory?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="flex flex-wrap gap-3">
              {data?.category?.map((cat, index) => {
                return (
                  <div
                    key={index}
                    className="text-sm flex items-center gap-1 bg-blue-50 mt-2"
                  >
                    <span>{cat.name}</span>
                    <div
                      className="hover:text-red-500 cursor-pointer"
                      onClick={() => handleRemoveCategory(index)}
                    >
                      <IoClose size={20} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-4">
            <label>Sub Category</label>
            <select
              name="subCategory"
              value={selectSubCategory}
              onChange={(e) => {
                const value = e.target.value;
                const subCategory = allSubCategory.find(
                  (cat) => cat._id === value
                );

                setData((preve) => {
                  return {
                    ...preve,
                    subCategory: [...preve.subCategory, subCategory],
                  };
                });
                setSelectSubCategory("");
              }}
              className="border border-gray-300 bg-blue-50 outline-none focus-within:border-yellow-400 rounded-md p-2 w-full"
            >
              <option value="">Select Sub Category</option>
              {allSubCategory?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="flex flex-wrap gap-3">
              {data?.subCategory.map((cat, index) => {
                return (
                  <div
                    key={index}
                    className="text-sm flex items-center gap-1 bg-blue-50 mt-2"
                  >
                    <span>{cat.name}</span>
                    <div
                      className="hover:text-red-500 cursor-pointer"
                      onClick={() => handleRemoveSubCategory(index)}
                    >
                      <IoClose size={20} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="unit" className="font-medium">
              Unit
            </label>
            <input
              id="unit"
              type="text"
              placeholder="Enter product unit"
              name="unit"
              value={data.unit}
              onChange={handleChange}
              required
              className="border border-gray-300 bg-blue-50 outline-none focus-within:border-yellow-400 rounded-md p-2 w-full"
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="stock" className="font-medium">
              Number of Stock
            </label>
            <input
              id="stock"
              type="text"
              placeholder="Enter product stock"
              name="stock"
              value={data.stock}
              onChange={handleChange}
              required
              className="border border-gray-300 bg-blue-50 outline-none focus-within:border-yellow-400 rounded-md p-2 w-full"
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="price">Price</label>
            <input
              id="price"
              type="text"
              name="price"
              placeholder="Enter Product Price"
              value={data.price}
              onChange={handleChange}
              required
              className="border border-gray-300 bg-blue-50 outline-none focus-within:border-yellow-400 rounded-md p-2 w-full"
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="discount" className="font-medium">
              Discount
            </label>
            <input
              id="discount"
              type="number"
              placeholder="Enter product discount"
              name="discount"
              value={data.discount}
              onChange={handleChange}
              required
              className="border border-gray-300 bg-blue-50 outline-none focus-within:border-yellow-400 rounded-md p-2 w-full"
            />
          </div>

          <div>
            {Object?.keys(data?.more_details)?.map((k) => {
              return (
                <div className="grid gap-1">
                  <label htmlFor={k} className="font-medium">
                    {k}
                  </label>
                  <input
                    id={k}
                    type="text"
                    value={data?.more_details[k]}
                    onChange={(e) => {
                      const value = e.target.value;
                      setData((preve) => {
                        return {
                          ...preve,
                          more_details: {
                            ...preve.more_details,
                            [k]: value,
                          },
                        };
                      });
                    }}
                    required
                    className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
                  />
                </div>
              );
            })}
          </div>

          <div
            onClick={() => setOpenMoreDetails(true)}
            className="bg-white hover:bg-yellow-400 py-1 px-3 w-32 text-center font-semibold border border-yellow-400  hover:text-neutral-800 cursor-pointer rounded mt-2"
          >
            Add Fields
          </div>

          <button
            type="submit"
            className="bg-yellow-400 hover:bg-white py-1 px-3 w-full text-center font-semibold border outline-none border-yellow-400  hover:text-neutral-800 cursor-pointer rounded mt-2"
          >
            Submit
          </button>
        </form>
      </div>

      {viewImageURL && (
        <ViewImage url={viewImageURL} onClose={() => setViewImageURL("")} />
      )}

      {openMoreDetails && (
        <AddFieldComponent
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          submit={() => {
            setData((prev) => ({
              ...prev,
              more_details: { ...prev.more_details, [fieldName]: "" },
            }));
            setFieldName("");
            setOpenMoreDetails(false);
          }}
          close={() => setOpenMoreDetails(false)}
        />
      )}
    </section>
  );
};

export default UploadProduct;
