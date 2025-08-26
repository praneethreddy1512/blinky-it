import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import CardLoading from "./CardLoading";
import CardProduct from "./CardProduct";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { valideURLConvert } from "../utils/valideURLConvert";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CategoryWiseProductDisplay = ({ id, name }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef();
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const loadingCardNumber = new Array(6).fill(null);
  const navigate = useNavigate();

  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}product/get-product-by-category`,
        {
          id: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          },
        }
      );

      const { data: responseData } = response;

      if (responseData.success) {
        setData(responseData.data);
      }
      console.log(responseData.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryWiseProduct();
  }, [1]);

  const handleScrollRight = () => {
    containerRef.current.scrollLeft += 200;
  };

  const handleScrollLeft = () => {
    containerRef.current.scrollLeft -= 200;
  };

  const handleRedirectProductListpage = () => {
    const subcategory = subCategoryData.find((sub) =>
      sub.category.some((c) => c._id === id)
    );
    if (!subcategory) return "/"; // fallback route
    const url = `/${valideURLConvert(name)}-${id}/${valideURLConvert(
      subcategory.name
    )}-${subcategory._id}`;
    return url;
  };

  const redirectURL = handleRedirectProductListpage();
  return (
    <div>
      <div className="container mx-auto p-4 flex items-center justify-between gap-4">
        <h3 className="font-semibold text-lg md:text-xl">{name}</h3>
        <button
          className="text-green-600 hover:text-green-400"
          onClick={() => navigate(redirectURL)}
        >
          see all
        </button>
      </div>
      <div className="relative flex items-center ">
        <div
          className=" flex gap-4 md:gap-6 lg:gap-8 container mx-auto px-4 overflow-x-scroll scrollbar-none scroll-smooth"
          ref={containerRef}
        >
          {loading &&
            loadingCardNumber?.map((_, index) => {
              return (
                <CardLoading key={"CategorywiseProductDisplay123" + index} />
              );
            })}

          {data?.map((p, index) => {
            return (
              <CardProduct
                data={p}
                key={p._id + "CategorywiseProductDisplay" + index}
              />
            );
          })}
        </div>
        <div className="w-full left-0 right-0 container mx-auto  px-2  absolute hidden lg:flex justify-between">
          <button
            onClick={handleScrollLeft}
            className="z-10 relative bg-white hover:bg-gray-100 shadow-lg text-lg p-2 rounded-full"
          >
            <FaAngleLeft />
          </button>
          <button
            onClick={handleScrollRight}
            className="z-10 relative  bg-white hover:bg-gray-100 shadow-lg p-2 text-lg rounded-full"
          >
            <FaAngleRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryWiseProductDisplay;
