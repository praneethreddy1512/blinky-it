import { useEffect, useState } from "react";
import { useContext, createContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../store/cartProduct";
import toast from "react-hot-toast";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";
import axios from "axios";

export const GlobalContext = createContext(null);
export const useGlobalContext = () => useContext(GlobalContext);

// Centralizing API endpoints for better maintainability
const API_ENDPOINTS = {
  CART: {
    GET: "cart/get",
    UPDATE_QTY: "cart/update-qty",
    DELETE: "cart/delete-cart-item",
  },
  ADDRESS: {
    GET: "address/get",
  },
  ORDER: {
    LIST: "order/order-list",
  },
};

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(0);
  const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state?.user);

  const fetchCartItem = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}${API_ENDPOINTS.CART.GET}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      });
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(handleAddItemCart(responseData.data));
      }
    } catch (error) {
      // Improved error handling
      const errorMessage = error.response?.data?.message || "Failed to fetch cart items.";
      toast.error(errorMessage);
    }
  };

  const updateCartItem = async (id, qty) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}${API_ENDPOINTS.CART.UPDATE_QTY}`,
        {
          _id: id,
          qty: qty,
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
        toast.success(responseData.message);
        fetchCartItem();
        return responseData;
      }
    } catch (error) {
      // Improved error handling
      const errorMessage = error.response?.data?.message || "Failed to update cart item.";
      toast.error(errorMessage);
    }
  };

  const deleteCartItem = async (cartId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}${API_ENDPOINTS.CART.DELETE}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          },
          data: {
            _id: cartId,
          },
        }
      );
      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        fetchCartItem();
      }
    } catch (error) {
      // Improved error handling
      const errorMessage = error.response?.data?.message || "Failed to delete cart item.";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const qty = cartItem.reduce((preve, curr) => {
      return preve + curr.quantity;
    }, 0);
    setTotalQty(qty);

    const tPrice = cartItem.reduce((preve, curr) => {
      const priceAfterDiscount = pricewithDiscount(curr?.productId?.price, curr?.productId?.discount);
      return preve + priceAfterDiscount * curr.quantity;
    }, 0);
    setTotalPrice(tPrice);

    const notDiscountPrice = cartItem.reduce((preve, curr) => {
      return preve + curr?.productId?.price * curr.quantity;
    }, 0);
    setNotDiscountTotalPrice(notDiscountPrice);
  }, [cartItem]);

  const fetchAddress = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}${API_ENDPOINTS.ADDRESS.GET}`, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      });
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(handleAddAddress(responseData.data));
      }
    } catch (error) {
      // Improved error handling
      const errorMessage = error.response?.data?.message || "Failed to fetch addresses.";
      toast.error(errorMessage);
    }
  };

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}${API_ENDPOINTS.ORDER.LIST}`, {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      });
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(setOrder(responseData.data));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch orders.";
      toast.error(errorMessage);
    }
  };

  // This function is now correctly defined but not used in this file. 
  // It should be called from a component that handles the logout action.
  const handleLogoutOut = () => {
    dispatch(handleAddItemCart([]));
    // Additional logout logic (e.g., clear localStorage) would go here
  };

  useEffect(() => {
    // Only fetch data when the user state changes.
    // The problematic handleLogoutOut() call has been removed.
    if (user.id) { // Added a check to ensure user is logged in
      fetchCartItem();
      fetchAddress();
      fetchOrder();
    }
  }, [user.id]); // Changed dependency to a specific user property

  return (
    <GlobalContext.Provider
      value={{
        fetchCartItem,
        updateCartItem,
        deleteCartItem,
        fetchAddress,
        totalPrice,
        totalQty,
        notDiscountTotalPrice,
        fetchOrder,
        handleLogoutOut, // Exported so a component can call it on logout
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;