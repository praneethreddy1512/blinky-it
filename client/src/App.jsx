import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import fetchUserDetails from "./utils/fetchUserDeatils";
import { useEffect } from "react";
import { setUserDetails } from "./store/userslice";
import { useDispatch } from "react-redux";
import UserMenuMobile from "./pages/UserMenuMobile";
import Dashboard from "./layouts/Dashboard";
import Address from "./pages/Adress";
import Profile from "./pages/Profile";
import Myorders from "./pages/Myorders";
import UploadProduct from "./pages/UploadProduct";
import Category from "./pages/Category";
import SubCategory from "./pages/SubCategory";
import ProductAdmin from "./pages/ProductAdmin";
import AdminPermision from "./layouts/AdminPermision";
import { setAllCategory } from "./store/productSlice";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { setAllSubCategory } from "./store/productSlice";

function App() {
  const dispatch = useDispatch();

  const fetchUser = async () => {
    const userData = await fetchUserDetails();
    dispatch(setUserDetails(userData.data));
  };

  const fetchCategory = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}category/get-category`
      );
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(
          setAllCategory(
            responseData.data.sort((a, b) => a.name.localeCompare(b.name))
          )
        );
      }
    } catch (error) {
      toast.error("Failed to fetch category data", error);
    }
  };

  const fetchSubCategory = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}subcategory/get`
      );
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(setAllSubCategory(responseData.data));
      }
    } catch (error) {
      toast.error("Failed to fetch subcategories", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCategory();
    fetchSubCategory();
  }, []);

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="user" element={<UserMenuMobile />} />

          <Route path="dashboard" element={<Dashboard />}>
            <Route path="profile" element={<Profile />} />
            <Route path="myorders" element={<Myorders />} />
            <Route path="address" element={<Address />} />
            <Route
              path="product"
              element={
                <AdminPermision>
                  <ProductAdmin />
                </AdminPermision>
              }
            />
            <Route
              path="category"
              element={
                <AdminPermision>
                  <Category />
                </AdminPermision>
              }
            />
            <Route
              path="sub-category"
              element={
                <AdminPermision>
                  <SubCategory />
                </AdminPermision>
              }
            />
            <Route
              path="uploadproduct"
              element={
                <AdminPermision>
                  <UploadProduct />
                </AdminPermision>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
