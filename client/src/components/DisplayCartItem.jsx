import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../Provider/GlobalProvider.jsx";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { FaCaretRight, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import AddToCartButton from "./AddToCartButton";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import imageEmpty from "../assets/empty_cart.webp";
import toast from "react-hot-toast";

const DisplayCartItem = ({ close }) => {
  const { notDiscountTotalPrice, totalPrice, totalQty, deleteCartItem } =
    useGlobalContext();
  const cartItem = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isRemoving, setIsRemoving] = useState(false);

  const redirectToCheckoutPage = () => {
    if (user?._id) {
      navigate("/checkout");
      if (close) {
        close();
      }
      return;
    }
    toast("Please Login");
  };

  const handleRemoveItem = async (cartId) => {
    if (isRemoving) return;

    try {
      setIsRemoving(true);
      await deleteCartItem(cartId);
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error(error.message ||"Failed to remove item");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <section className="bg-neutral-900 fixed top-0 bottom-0 right-0 left-0 bg-opacity-70 z-50">
      <div className="bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto">
        <div className="flex items-center p-4 shadow-md gap-3 justify-between border-b">
          <h2 className="font-semibold text-lg">Shopping Cart</h2>
          <Link to={"/"} className="lg:hidden">
            <IoClose size={25} />
          </Link>
          <button
            onClick={close}
            className="hidden lg:block hover:bg-gray-100 p-1 rounded"
          >
            <IoClose size={25} />
          </button>
        </div>

        <div className="min-h-[75vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-150px)] bg-gray-50 p-2 flex flex-col gap-4">
          {/***display items */}
          {cartItem[0] ? (
            <>
              {/* Cart Summary */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">Cart Summary</h3>
                  <span className="text-sm text-gray-500">
                    {totalQty} {totalQty === 1 ? "item" : "items"}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 bg-green-100 text-green-700 rounded-lg border border-green-200">
                  <p className="font-medium">Your total savings</p>
                  <p className="font-bold text-lg">
                    {DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 grid gap-4 overflow-auto max-h-[50vh]">
                {cartItem[0] &&
                  cartItem?.map((item) => {
                    return (
                      <div
                        key={item?._id + "cartItemDisplay"}
                        className="flex w-full gap-4 p-3 border border-gray-100 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="w-20 h-20 min-h-20 min-w-20 bg-white border border-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={item?.productId?.image[0]}
                            className="w-full h-full object-cover"
                            alt={item?.productId?.name}
                          />
                        </div>
                        <div className="w-full max-w-sm text-sm flex flex-col justify-between">
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-2 mb-1">
                              {item?.productId?.name}
                            </p>
                            <p className="text-gray-500 text-xs mb-2">
                              {item?.productId?.unit}
                            </p>
                            <p className="font-bold text-green-600 text-lg">
                              {DisplayPriceInRupees(
                                pricewithDiscount(
                                  item?.productId?.price,
                                  item?.productId?.discount
                                )
                              )}
                            </p>
                            {item?.productId?.discount > 0 && (
                              <p className="text-gray-400 text-xs line-through">
                                {DisplayPriceInRupees(item?.productId?.price)}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <AddToCartButton data={item?.productId} />
                            <button
                              onClick={() => handleRemoveItem(item?._id)}
                              className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Remove item"
                              disabled={isRemoving}
                            >
                              {isRemoving ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                              ) : (
                                <FaTrash size={14} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">
                  Bill Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">Items total</p>
                    <p className="flex items-center gap-2">
                      <span className="line-through text-gray-400 text-sm">
                        {DisplayPriceInRupees(notDiscountTotalPrice)}
                      </span>
                      <span className="font-semibold">
                        {DisplayPriceInRupees(totalPrice)}
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">Quantity total</p>
                    <p className="font-medium">
                      {totalQty} {totalQty === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">Delivery Charge</p>
                    <p className="text-green-600 font-medium">Free</p>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-lg text-gray-800">
                        Grand total
                      </p>
                      <p className="font-bold text-xl text-green-600">
                        {DisplayPriceInRupees(totalPrice)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white flex flex-col justify-center items-center py-12 px-4">
              <img
                src={imageEmpty}
                className="w-32 h-32 object-contain mb-4"
                alt="Empty cart"
              />
              <p className="text-gray-500 text-center mb-6">
                Your cart is empty
              </p>
              <Link
                onClick={close}
                to={"/"}
                className="block bg-green-600 hover:bg-green-700 px-6 py-3 text-white rounded-lg font-medium transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>

        {cartItem[0] && (
          <div className="p-4 border-t bg-white">
            <div className="flex flex-col gap-3">
              <button
                onClick={redirectToCheckoutPage}
                className="w-full border-2 border-green-600 text-green-700 hover:bg-green-600 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Checkout
              </button>
              <div className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg flex items-center gap-4 justify-between cursor-pointer transition-colors">
                <div className="text-lg font-bold">
                  {DisplayPriceInRupees(totalPrice)}
                </div>
                <button
                  onClick={redirectToCheckoutPage}
                  className="flex items-center gap-2 font-medium"
                >
                  Proceed to Checkout
                  <span>
                    <FaCaretRight />
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DisplayCartItem;
