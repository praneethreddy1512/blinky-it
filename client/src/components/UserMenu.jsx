import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Divider from "./Divider";
import axios from "axios";
import { logout } from "../store/userslice";
import toast from "react-hot-toast";
import { HiOutlineExternalLink } from "react-icons/hi";
import isAdmin from "../utils/isAdmin";

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accesstoken");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}user/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
          },
        }
      );

      if (response.data.success) {
        if (close) {
          close();
        }
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  const handleClose = () => {
    if (close) {
      close();
    }
  };

  return (
    <div>
      <div className="font-semibold">My Account</div>
      <div className="text-sm flex items-center gap-2">
        <span className="max-w-52 text-ellipsis line-clamp-1">
          {user.name || user.mobile}
          <span className="text-medium text-red-600">
            {user.role === "ADMIN" ? "(Admin)" : ""}
          </span>
        </span>
        <Link to={"/dashboard/profile"} className="hover:text-yellow-200">
          <HiOutlineExternalLink size={15} />
        </Link>
      </div>

      <Divider />

      <div className="text-sm grid gap-1">
        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to="/dashboard/category"
            className="px-2 hover:bg-orange-200 py-1"
          >
            category
          </Link>
        )}
        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to="/dashboard/sub-category"
            className="px-2 hover:bg-orange-200 py-1"
          >
            subcategory
          </Link>
        )}
        {isAdmin(user.role) && (
          <Link
            to="/dashboard/product"
            className="px-2 hover:bg-orange-200 py-1"
          >
            Product
          </Link>
        )}
        {isAdmin(user.role) && (
          <Link
            to="/dashboard/uploadproduct"
            className="px-2 hover:bg-orange-200 py-1"
          >
            Upload Product
          </Link>
        )}

        <Link
          to="/dashboard/myorders"
          className="px-2 hover:bg-orange-200 py-1"
        >
          My orders
        </Link>
        <Link to="/dashboard/address" className="px-2 hover:bg-orange-200 py-1">
          Saved Address
        </Link>
        <button
          onClick={handleLogout}
          className="text-left px-2 hover:bg-orange-200 py-1"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
