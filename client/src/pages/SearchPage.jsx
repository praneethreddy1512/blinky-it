import React, { useEffect, useState } from "react";
import CardLoading from "../components/CardLoading";
import axios from "axios";
import CardProduct from "../components/CardProduct";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import noDataImage from "../assets/nothing here yet.png";
import toast from "react-hot-toast";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartMobileLink from "../components/CartMobile";
const SearchPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingArrayCard = new Array(10).fill(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [searchParams] = useSearchParams();
  const searchText = searchParams.get("q") || "";

  const fetchData = async () => {
    try {
      setLoading(true);

      if (!searchText.trim()) {
        setData([]);
        setTotalPage(1);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}product/search-product`,
        {
          search: searchText,
          page: page,
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
        if (responseData.page == 1) {
          setData(responseData.data);
        } else {
          setData((preve) => {
            return [...preve, ...responseData.data];
          });
        }
        setTotalPage(responseData.totalPage);

        // Show success message for first page results
        if (responseData.page == 1 && responseData.data.length > 0) {
          toast.success(
            `Found ${responseData.data.length} products for "${searchText}"`
          );
        }
      } else {
        toast.error("Search failed. Please try again.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Search failed"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchText.trim()) {
      fetchData();
    } else {
      setData([]);
      setLoading(false);
    }
  }, [page, searchText]);

  useEffect(() => {
    // Reset page to 1 when search text changes
    setPage(1);
  }, [searchText]);

  // Initial search when component mounts
  useEffect(() => {
    if (searchText.trim()) {
      fetchData();
    } else {
      setLoading(false);
    }

    // Cleanup function
  
  }, []); // Empty dependency array for initial mount only

  // Cleanup when search text changes
  useEffect(() => {
   
  }, [searchText]);


  const handleFetchMore = () => {
    if (totalPage > page) {
      setPage((preve) => preve + 1);
    }
  };

  return (
    <>
      <Header />
      <section className="bg-white">
        <div className="container mx-auto p-4">
          <p className="font-semibold">
            {searchText.trim()
              ? `Search Results for "${searchText}": ${data.length} items found`
              : "Search for products"}
          </p>

          {searchText.trim() && (
            <InfiniteScroll
              dataLength={data.length}
              hasMore={page < totalPage}
              next={handleFetchMore}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 py-4 gap-4">
                {data.map((p, index) => {
                  return (
                    <CardProduct
                      data={p}
                      key={p?._id + "searchProduct" + index}
                    />
                  );
                })}

                {/***loading data */}
                {loading &&
                  loadingArrayCard.map((_, index) => {
                    return <CardLoading key={"loadingsearchpage" + index} />;
                  })}
              </div>
            </InfiniteScroll>
          )}

          {!searchText.trim() && (
            <div className="flex flex-col justify-center items-center w-full mx-auto py-20">
              <img
                src={noDataImage}
                className="w-full h-full max-w-xs max-h-xs block"
              />
              <p className="font-semibold my-2">
                Enter a search term to find products
              </p>
            </div>
          )}

          {searchText.trim() && !data[0] && !loading && (
            <div className="flex flex-col justify-center items-center w-full mx-auto py-20">
              <img
                src={noDataImage}
                className="w-full h-full max-w-xs max-h-xs block"
              />
              <p className="font-semibold my-2">
                No products found for "{searchText}"
              </p>
              <p className="text-gray-500">
                Try different keywords or check your spelling
              </p>
            </div>
          )}
        </div>
      </section>
      <Footer />
      <CartMobileLink />
    </>
  );
};

export default SearchPage;
