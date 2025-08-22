import React from "react";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import axios from "axios";

// const page = 1;

const Product = () => {
  // const [product, setProduct] = useState([]);

  // const fetchData = async () => {
  //   try {
  //     const url = `${import.meta.env.VITE_API_URL}product/get-product`;
  //     const response = await axios.get(url, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
  //       },
  //       params: {
  //         page,
  //       },
  //     });
  //     const { data: responseData } = response;
  //     if (responseData.success) {
  //       setProduct(responseData.data);
  //     }
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };
  return <div>Product</div>;
};

export default Product;
