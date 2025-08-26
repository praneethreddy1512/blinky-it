import React, { useState } from "react";
import logo from "../assets/logo.png";
import Search from "./search";
import { FaRegCircleUser } from "react-icons/fa6";
import { BsCart4 } from "react-icons/bs";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";
import useMobile from "../hooks/useMobile";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import UserMenu from "./UserMenu";
import DisplayCartItem from "./DisplayCartItem";
import { useGlobalContext } from "../Provider/GlobalProvider";

export default function Header() {
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const { totalQty } = useGlobalContext();

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false);
  };

  const handleOpenCart = () => {
    if (!user?._id) {
      navigate("/login");
      return;
    }
    setOpenCart(true);
  };

  const handleCloseCart = () => {
    setOpenCart(false);
  };

  const handleMobileUser = () => {
    if (!user?._id) {
      navigate("/login");
      return;
    }
    navigate("/user");
  };

  return (
    <>
      <header className="h-20 lg:h-20 lg:shadow-md sticky top-0 bg-white z-40 flex flex-col justify-center gap-1 p-2">
        <div className='container mx-auto flex items-center h-full px-2 justify-between lg:hidden'>
          <Link to="/" className='flex items-center pt-4'>
            <img
              src={logo}
              width={170}
              height={60}
              alt='logo'
            />
          </Link>

          <div className='flex items-center gap-4'>
            <button 
              onClick={handleOpenCart}
              className='text-neutral-600 relative p-2'
            >
              <BsCart4 size={24} />
              {totalQty > 0 && (
                <div className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold'>
                  {totalQty > 99 ? '99+' : totalQty}
                </div>
              )}
            </button>
            <button className='text-neutral-600' onClick={handleMobileUser} >
              <FaRegCircleUser size={26} />
            </button>
          </div>
        </div>

        {!(isSearchPage && isMobile) && (
          <div className="container mx-auto hidden lg:flex items-center h-full px-4 justify-between">
            <div className="h-full">
              <Link to="/" className="h-full flex justify-center items-center">
                <img src={logo} width={170} height={60} alt="logo" />
              </Link>
            </div>

            <div className="hidden lg:block">
              <Search />
            </div>

            <div className="hidden lg:flex items-center gap-10">
              {user?._id ? (
                <div className="relative">
                  <div
                    onClick={() => setOpenUserMenu((prev) => !prev)}
                    className="flex select-none items-center gap-1"
                  >
                    <p>Account</p>
                    {openUserMenu ? (
                      <GoTriangleUp size={25} />
                    ) : (
                      <GoTriangleDown size={25} />
                    )}
                  </div>
                  {openUserMenu && (
                    <div className="absolute right-0 top-12">
                      <div className="bg-white rounded p-4 min-w-52 lg:shadow-lg">
                        <UserMenu close={handleCloseUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => navigate("/login")}>Login</button>
              )}

              <button
                onClick={handleOpenCart}
                className="flex items-center gap-2 bg-green-800 hover:bg-green-700 text-white px-3 py-3 rounded-md relative"
              >
                <div className="animate-bounce">
                  <BsCart4 size={25} />
                </div>
                <div className="text-left text-sm leading-tight font-semibold">
                  <p>My Cart</p>
                </div>
                {totalQty > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                    {totalQty > 99 ? "99+" : totalQty}
                  </div>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="container mx-auto px-2 lg:hidden">
          <Search />
        </div>
      </header>

      {/* Cart Display */}
      {openCart && <DisplayCartItem close={handleCloseCart} />}
    </>
  );
}
