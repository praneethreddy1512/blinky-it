import React, { useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import fetchUserDetails from "../utils/fetchUserDeatils";
import { setUserDetails } from "../store/userslice";
const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validValue = Object.values(data).every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}user/login`,
        data
      );

      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("accesstoken", response.data.data.accesstoken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
        const userDetails = await fetchUserDetails();
        dispatch(setUserDetails(userDetails.data));

        setData({
          email: "",
          password: "",
        });
        navigate("/");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.error ||
          "Email or Password is Wrong Please try again."
      );
    }
  };

  return (
    <>
      <section className="w-full container mx-auto px-2">
        <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
          <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
            <div className="grid gap-1">
              <label htmlFor="email">Email :</label>
              <input
                type="email"
                id="email"
                className="bg-blue-50 p-2 border rounded outline-none focus:border-primary-200"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
            <div className="grid gap-1">
              <label htmlFor="password">Password :</label>
              <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full outline-none"
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
                <div
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="cursor-pointer"
                >
                  {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </div>
              </div>
            </div>
            <button
              disabled={!validValue}
              className={` ${
                validValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
              } text-white py-2 rounded font-semibold my-3 tracking-wide`}
            >
              Login
            </button>
          </form>
          <p>
            Don't have account?{" "}
            <Link
              to={"/register"}
              className="font-semibold text-green-700 hover:text-green-800"
            >
              Register
            </Link>
          </p>
        </div>
      </section>
    </>
  );
};

export default Login;
