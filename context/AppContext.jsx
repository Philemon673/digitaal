'use client'
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();

  const { user } = useUser();
  const { getToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItem, setCartItem] = useState({});

 const fetchProductData = async () => {
  try {
    const { data } = await axios.get("/api/product/list");
    if (data.success) {
      setProducts(Array.isArray(data.product) ? data.product : []);
    } else {
      toast.error(data.message);
      setProducts([]);
    }
  } catch (error) {
    toast.error(error.message);
    setProducts([]);
  }
};


  const fetchUserData = async () => {
    try {
      if (user?.publicMetadata?.role === "seller") {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }

      const token = await getToken();

      const { data } = await axios.get("/api/user/data", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.user);
        setCartItem(data.user.cartItem || {});
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

 const addToCart = async (itemId) => {
  let cartData = structuredClone(cartItem);
  cartData[itemId] = (cartData[itemId] || 0) + 1;
  setCartItem(cartData);

  if (user) {
    try {
      const token = await getToken();
      if (!token) {
        console.error("❌ No token returned from Clerk");
        return toast.error("Authentication error — please re-login.");
      }

      const { data } = await axios.post(
        "/api/cart/update",
        { cartData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Item added to cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ Cart update failed:", error);
      toast.error(error.message);
    }
  } else {
    toast.error("Please log in to add items to cart.");
  }
};

const updateCartQuantity = async (itemId, quantity) => {
  let cartData = structuredClone(cartItem);
  if (quantity === 0) delete cartData[itemId];
  else cartData[itemId] = quantity;
  setCartItem(cartData);

  if (user) {
    try {
      const token = await getToken();
      if (!token) {
        console.error("❌ No token returned from Clerk");
        return toast.error("Authentication error — please re-login.");
      }

      const { data } = await axios.post(
        "/api/cart/update",
        { cartData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Cart updated successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ Cart update failed:", error);
      toast.error(error.message);
    }
  } else {
    toast.error("Please log in to update your cart.");
  }
};


  const getCartCount = () =>
    Object.values(cartItem).reduce((sum, count) => sum + count, 0);

  const getCartAmount = () => {
    let total = 0;
    for (const id in cartItem) {
      const item = products.find((p) => p._id === id);
      if (item) {
        total += (item.offerPrice || 0) * cartItem[id];
      }
    }
    return Math.floor(total * 100) / 100;
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
  console.log("Clerk user:", user);
  console.log("getToken:", getToken);
}, [user, getToken]);


  useEffect(() => {
    if (user) fetchUserData();
  }, [user]);

  const value = {
    user, getToken,
    currency, router,
    isSeller, setIsSeller,
    userData, fetchUserData,
    products, fetchProductData,
    cartItem, setCartItem,
    addToCart, updateCartQuantity,
    getCartCount, getCartAmount,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
