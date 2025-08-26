import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import Divider from "../components/Divider";
import image1 from "../assets/minute_delivery.png";
import image2 from "../assets/Best_Prices_Offers.png";
import image3 from "../assets/Wide_Assortment.png";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import AddToCartButton from "../components/AddToCartButton";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ProductDisplayPage = () => {
  const params = useParams();
  let productId = params?.product?.split("-")?.slice(-1)[0];

  // Fallback: try to extract productId from different patterns
  if (!productId || productId.length !== 24) {
    // Try to find a 24-character string that looks like MongoDB ObjectId
    const productParam = params?.product || "";
    const objectIdPattern = /[a-fA-F0-9]{24}/;
    const match = productParam.match(objectIdPattern);
    if (match) {
      productId = match[0];
      console.log("Extracted productId using regex:", productId);
    } else {
      console.error(
        "Could not extract valid productId from URL:",
        productParam
      );
      productId = null;
    }
  }

  const [data, setData] = useState({
    name: "",
    image: [],
  });
  const [image, setImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const imageContainer = useRef();

  const fetchProductDetails = async () => {
    if (!productId) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}product/get-product-details`,
        {
          productId: productId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        }
      );

      const { data: responseData } = response;

      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      // Silently handle errors, just keep loading state
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      console.log("Fetching product details for ID:", productId);

      // Test server connectivity first
      const testServerConnection = async () => {
        try {
          const testResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}`,
            { timeout: 5000 }
          );
          console.log("Server is reachable:", testResponse.status);
          fetchProductDetails();
        } catch (error) {
          console.error("Server connectivity test failed:", error);
          // Silently proceed with fetch attempt even if connectivity test fails
          fetchProductDetails();
        }
      };

      testServerConnection();
    }
  }, [productId]);

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100;
  };
  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100;
  };
  console.log("product data", data);

  if (loading || !data || !data._id) {
    return (
      <>
        <Header />
        <section className="container mx-auto p-4 grid lg:grid-cols-2">
          <div className="animate-pulse">
            <div className="bg-gray-200 lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full"></div>
            <div className="flex items-center justify-center gap-3 my-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-gray-200 w-3 h-3 lg:w-5 lg:h-5 rounded-full"
                ></div>
              ))}
            </div>
          </div>
          <div className="p-4 lg:pl-7 space-y-4">
            <div className="bg-gray-200 h-6 w-32 rounded"></div>
            <div className="bg-gray-200 h-8 w-48 rounded"></div>
            <div className="bg-gray-200 h-4 w-24 rounded"></div>
            <div className="bg-gray-200 h-12 w-32 rounded"></div>
            {loading && (
              <div className="flex items-center gap-2 text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                <span className="text-sm">Loading product details...</span>
              </div>
            )}
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <section className="container mx-auto p-4 grid lg:grid-cols-2 ">
        <div className="">
          <div className="bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full">
            <img
              src={data?.image[image]}
              className="w-full h-full object-scale-down"
            />
          </div>
          <div className="flex items-center justify-center gap-3 my-2">
            {data?.image?.map((img, index) => {
              return (
                <div
                  key={img + index + "point"}
                  className={`bg-slate-200 w-3 h-3 lg:w-5 lg:h-5 rounded-full ${
                    index === image && "bg-slate-300"
                  }`}
                ></div>
              );
            })}
          </div>
          <div className="grid relative">
            <div
              ref={imageContainer}
              className="flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none"
            >
              {data?.image?.map((img, index) => {
                return (
                  <div
                    className="w-20 h-20 min-h-20 min-w-20 scr cursor-pointer shadow-md"
                    key={img + index}
                  >
                    <img
                      src={img}
                      alt="min-product"
                      onClick={() => setImage(index)}
                      className="w-full h-full object-scale-down"
                    />
                  </div>
                );
              })}
            </div>
            <div className="w-full -ml-3 h-full hidden lg:flex justify-between absolute  items-center">
              <button
                onClick={handleScrollLeft}
                className="z-10 bg-white relative p-1 rounded-full shadow-lg"
              >
                <FaAngleLeft />
              </button>
              <button
                onClick={handleScrollRight}
                className="z-10 bg-white relative p-1 rounded-full shadow-lg"
              >
                <FaAngleRight />
              </button>
            </div>
          </div>
          <div></div>

          <div className="my-4  hidden lg:grid gap-3 ">
            <div>
              <p className="font-semibold">Description</p>
              <p className="text-base">{data?.description}</p>
            </div>
            <div>
              <p className="font-semibold">Unit</p>
              <p className="text-base">{data?.unit}</p>
            </div>
            {data?.more_details &&
              Object.keys(data?.more_details)?.map((element) => {
                return (
                  <div>
                    <p className="font-semibold">{element}</p>
                    <p className="text-base">{data?.more_details[element]}</p>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="p-4 lg:pl-7 text-base lg:text-lg">
          <p className="bg-green-300 w-fit px-2 rounded-full">10 Min</p>
          <h2 className="text-lg font-semibold lg:text-3xl">{data?.name}</h2>
          <p className="">{data?.unit}</p>
          <Divider />
          <div>
            <p className="">Price</p>
            <div className="flex items-center gap-2 lg:gap-4">
              <div className="border border-green-600 px-4 py-2 rounded bg-green-50 w-fit">
                <p className="font-semibold text-lg lg:text-xl">
                  {DisplayPriceInRupees(
                    pricewithDiscount(data?.price, data?.discount)
                  )}
                </p>
              </div>
              {data?.discount && (
                <p className="line-through">
                  {DisplayPriceInRupees(data?.price)}
                </p>
              )}
              {data?.discount && (
                <p className="font-bold text-green-600 lg:text-2xl">
                  {data?.discount}%{" "}
                  <span className="text-base text-neutral-500">Discount</span>
                </p>
              )}
            </div>
          </div>

          {data?.stock === 0 ? (
            <p className="text-lg text-red-500 my-2">Out of Stock</p>
          ) : (
            // <button className='my-4 px-4 py-1 bg-green-600 hover:bg-green-700 text-white rounded'>Add</button>
            <div className="my-4">
              <AddToCartButton data={data} />
            </div>
          )}

          <h2 className="font-semibold">Why shop from binkeyit? </h2>
          <div>
            <div className="flex  items-center gap-4 my-4">
              <img
                src={image1}
                alt="superfast delivery"
                className="w-20 h-20"
              />
              <div className="text-sm">
                <div className="font-semibold">Superfast Delivery</div>
                <p>
                  Get your orer delivered to your doorstep at the earliest from
                  dark stores near you.
                </p>
              </div>
            </div>
            <div className="flex  items-center gap-4 my-4">
              <img
                src={image2}
                alt="Best prices offers"
                className="w-20 h-20"
              />
              <div className="text-sm">
                <div className="font-semibold">Best Prices & Offers</div>
                <p>
                  Best price destination with offers directly from the
                  nanufacturers.
                </p>
              </div>
            </div>
            <div className="flex  items-center gap-4 my-4">
              <img src={image3} alt="Wide Assortment" className="w-20 h-20" />
              <div className="text-sm">
                <div className="font-semibold">Wide Assortment</div>
                <p>
                  Choose from 5000+ products across food personal care,
                  household & other categories.
                </p>
              </div>
            </div>
          </div>

          {/****only mobile */}
          <div className="my-4 grid gap-3 ">
            <div>
              <p className="font-semibold">Description</p>
              <p className="text-base">{data?.description}</p>
            </div>
            <div>
              <p className="font-semibold">Unit</p>
              <p className="text-base">{data?.unit}</p>
            </div>
            {data?.more_details &&
              Object.keys(data?.more_details)?.map((element) => {
                return (
                  <div>
                    <p className="font-semibold">{element}</p>
                    <p className="text-base">{data?.more_details[element]}</p>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ProductDisplayPage;
