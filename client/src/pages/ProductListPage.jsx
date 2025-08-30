import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import CardProduct from "../components/CardProduct";
import CardLoading from "../components/CardLoading";
import { useSelector } from "react-redux";
import { valideURLConvert } from "../utils/valideURLConvert";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartMobileLink from "../components/CartMobile";

// Loading skeleton for subcategories
const SubCategoryLoading = () => (
  <div className="flex items-center p-4 border-b border-gray-100 animate-pulse">
    <div className="w-12 h-12 mr-3 bg-gray-200 rounded-lg"></div>
    <div className="flex-1">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  </div>
);

// Enhanced Product Card Component (if you want to replace CardProduct)
const EnhancedProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 p-4 group">
      {/* Product Image */}
      <div className="aspect-square mb-3 relative overflow-hidden rounded-lg bg-gray-50">
        <img
          src={product.image?.[0] || "/api/placeholder/200/200"}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
          10 min
        </span>
        {product.discount && (
          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
            {product.discount}% discount
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[2.5rem] leading-tight">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 font-medium">
          {product.unit || "1 unit"}
        </p>

        {/* Price Section */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">
              ₹{product.price?.toFixed(2) || "0.00"}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm hover:shadow-md">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductListPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(true);

  const params = useParams();
  const AllSubCategory = useSelector((state) => state.product.allSubCategory);
  const [DisplaySubCategory, setDisplaySubCategory] = useState([]);

  const skeletonArray = new Array(6).fill(null);
  const subCategorySkeletonArray = new Array(8).fill(null);


  const subCategory = params?.subCategory?.split("-");
  const subCategoryName = subCategory
    ?.slice(0, subCategory?.length - 1)
    ?.join(" ");

  const categoryId = params.category.split("-").slice(-1)[0];
  const subCategoryId = params.subCategory.split("-").slice(-1)[0];


  const fetchProductdata = useCallback(async () => {
    try {
      setLoading(true);
      

      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }product/get-product-by-category-and-subcategory`,
        {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 8,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { data: responseData } = response;

      if (responseData.success) {
        if (page === 1) {
          setData(responseData.data);
        } else {
          setData((prev) => [...prev, ...responseData.data]);
        }
        setTotalPage(responseData.totalCount);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching products");
    } finally {
      setLoading(false);
    }
  }, [categoryId, subCategoryId, page]);

  useEffect(() => {
    console.log("Params changed, resetting data and fetching...");
    setData([]);
    setPage(1);
    fetchProductdata();
  }, [categoryId, subCategoryId]);

  useEffect(() => {
    setSubcategoriesLoading(true);

    const sub = AllSubCategory.filter((s) => {
      const filterData = s.category.some((el) => {
        return el._id == categoryId;
      });
      return filterData;
    });

    setDisplaySubCategory(sub);
    setSubcategoriesLoading(false);
  }, [params, AllSubCategory, categoryId]);

  const loadMoreProducts = () => {
    if (data.length < totalPage && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  // Load more data when page changes
  useEffect(() => {
    if (page > 1) {
      fetchProductdata();
    }
  }, [page, fetchProductdata]);

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex">
            {/* Sidebar with subcategories */}
            <div className="w-80 bg-white border-r border-gray-200 min-h-screen sticky top-0">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  Categories
                </h2>
              </div>

              <div className="overflow-y-auto max-h-[calc(100vh-100px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {subcategoriesLoading
                  ? subCategorySkeletonArray.map((_, idx) => (
                      <SubCategoryLoading key={`sub-skel-${idx}`} />
                    ))
                  : DisplaySubCategory.map((s) => {
                      const link = `/${valideURLConvert(
                        s?.category[0]?.name
                      )}-${s?.category[0]?._id}/${valideURLConvert(s.name)}-${
                        s._id
                      }`;

                      return (
                        <Link
                          key={s._id}
                          to={link}
                          className={`flex items-center p-4 border-b border-gray-100 hover:bg-green-50 transition-all duration-200 group ${
                            subCategoryId === s._id
                              ? "bg-green-50 border-l-4 border-l-green-500"
                              : "hover:border-l-4 hover:border-l-green-200"
                          }`}
                        >
                          <div className="w-14 h-14 mr-4 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden group-hover:bg-white transition-colors">
                            <img
                              src={s.image || "/api/placeholder/56/56"}
                              alt={s.name}
                              className="w-12 h-12 object-contain"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-700 line-clamp-2 group-hover:text-green-700 transition-colors">
                              {s.name}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
              </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 bg-white">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                      {subCategoryName || "Products"}
                    </h1>
                    {!loading && data.length > 0 && (
                      <p className="text-gray-600 mt-1">
                        Showing {data.length} products
                      </p>
                    )}
                  </div>

                  {loading && (
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                      Loading...
                    </div>
                  )}
                </div>
              </div>

              {/* Products Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Loading skeletons for initial load */}
                  {loading &&
                    data.length === 0 &&
                    skeletonArray.map((_, idx) => (
                      <CardLoading key={"product-list-skel-" + idx} />
                    ))}

                  {/* Product Cards */}
                  {data.length > 0 &&
                    data.map((p, index) => {
                      return (
                        <CardProduct
                          data={p}
                          key={p._id + "productSubCategory" + index}
                        />
                        // Alternatively, use the enhanced card:
                        // <EnhancedProductCard
                        //   key={p._id + "productSubCategory" + index}
                        //   product={p}
                        // />
                      );
                    })}

                  {/* Loading skeletons for pagination */}
                  {loading &&
                    data.length > 0 &&
                    skeletonArray
                      .slice(0, 3)
                      .map((_, idx) => (
                        <CardLoading key={"more-product-skel-" + idx} />
                      ))}
                </div>

                {/* Empty State */}
                {!loading && data.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-gray-300 text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      We couldn't find any products in this category. Please try
                      selecting a different category or check back later.
                    </p>
                  </div>
                )}

                {/* Load More Button */}
                {!loading && data.length > 0 && data.length < totalPage && (
                  <div className="text-center mt-12">
                    <button
                      onClick={loadMoreProducts}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Load More Products
                    </button>
                  </div>
                )}

                {/* Reached End Message */}
                {!loading &&
                  data.length > 0 &&
                  data.length >= totalPage &&
                  totalPage > 8 && (
                    <div className="text-center mt-8 py-4 text-gray-500">
                      <p>
                        You've viewed all available products in this category
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <CartMobileLink />
    </>
  );
};

export default ProductListPage;
