import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { IoSearchOutline } from "react-icons/io5";
import Loading from "../components/Loading";
import ProductCardAdmin from "../components/ProductCardAdmin";
const ProductAdmin = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [totalpage, setTotalpage] = useState(1);
  const fetchData = async () => {
    try {
      setLoading(true);
      const url = `${import.meta.env.VITE_API_URL}product/get-product`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
        params: {
          page,
          limit: 12,
          search,
        },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        setTotalpage(responseData.totalNoPage);
        setProducts(responseData.data);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const { value } = e.target;
    setSearch(value);
    setPage(1);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handelNext = () => {
    if (page !== totalpage) {
      setPage(page + 1);
    }
  };
  const handelPrevious = () => {
    if (page !== totalpage - 1) {
      setPage(page - 1);
    }
  };
  useEffect(() => {
    let flag = true;

    const interval = setTimeout(() => {
      if (flag) {
        fetchData();
        flag = false;
      }
    }, 300);

    return () => {
      clearTimeout(interval);
    };
  }, [search]);

  return (
    <section className="">
      <div className="p-2 bg-white shadow-md flex items-center justify-center gap-4">
        <h2 className="font-semibold">Products</h2>
        <div className="h-full min-w-24 max-w-56 w-full ml-auto bg-blue-50 px-4 flex items-center gap-3 py-2 rounded  border focus-within:border-yellow-400 outline-none">
          <IoSearchOutline size={25} />
          <input
            type="text"
            placeholder="Search product here ..."
            value={search}
            onChange={handleSearch}
            className="h-full w-full  outline-none bg-transparent"
          />
        </div>
      </div>
      {loading && <Loading />}

      <div className="p-4">
        <div className="min-h-[55vh]">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products?.map((product, index) => {
              return <ProductCardAdmin data={product} key={index} />;
            })}
          </div>
        </div>
        <div className="flex justify-between my-4">
          <button
            onClick={handelPrevious}
            className="border border-yellow-400 px-4 hover:bg-yellow-400 bg-transparent"
          >
            Previous
          </button>
          <button className="w-full bg-slate-100">
            {page}/{totalpage}
          </button>
          <button
            onClick={handelNext}
            className="border border-yellow-400 px-4 hover:bg-yellow-400 bg-transparent"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductAdmin;
