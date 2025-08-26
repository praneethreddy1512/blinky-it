import React from "react";
import { useGlobalContext } from "../Provider/GlobalProvider";
import { FaCartShopping } from "react-icons/fa6";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { Link } from "react-router-dom";
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from "react-redux";

const CartMobileLink = () => {
  const { totalPrice, totalQty } = useGlobalContext();
  const cartItem = useSelector((state) => state.cartItem.cart);

  if (!cartItem[0]) return null;

  return (
    <div className="sticky bottom-4 p-2 z-40">
      <div className="bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg text-white shadow-lg flex items-center justify-between gap-3 lg:hidden transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500 rounded-lg w-fit">
            <FaCartShopping size={18} />
          </div>
          <div className="text-sm">
            <p className="font-medium">
              {totalQty} {totalQty === 1 ? "item" : "items"}
            </p>
            <p className="font-bold text-lg">
              {DisplayPriceInRupees(totalPrice)}
            </p>
          </div>
        </div>

        <Link
          to={"/cart"}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-400 px-4 py-2 rounded-lg transition-colors"
        >
          <span className="text-sm font-medium">View Cart</span>
          <FaCaretRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default CartMobileLink;
