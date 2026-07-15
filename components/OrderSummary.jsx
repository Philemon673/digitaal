import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const OrderSummary = () => {
  const {
    currency,
    router,
    getCartCount,
    getCartAmount,
    getToken,
    user,
    cartItem,
    setCartItem,
    products,
  } = useAppContext();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);

  // Payment Popup States
  const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("WhatsApp Messaging");

  // Fetch user addresses
  const fetchUserAddresses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/get-address", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  // Handle Place Order Click (Validates before opening popup)
  const handlePlaceOrderClick = () => {
    if (!selectedAddress) return toast.error("Please select an address");

    let cartItemArray = Object.keys(cartItem)
      .map((key) => ({ product: key, quantity: cartItem[key] }))
      .filter((item) => item.quantity > 0);

    if (cartItemArray.length === 0)
      return toast.error("Your cart is empty");

    setIsPaymentPopupOpen(true);
  };

  // Create order
  const createOrder = async () => {
    try {
      setIsPaymentPopupOpen(false);

      let cartItemArray = Object.keys(cartItem)
        .map((key) => ({ product: key, quantity: cartItem[key] }))
        .filter((item) => item.quantity > 0);

      if (cartItemArray.length === 0)
        return toast.error("Your cart is empty");

      const token = await getToken();
      const { data } = await axios.post(
        "/api/order/create",
        {
          address: selectedAddress._id,
          items: cartItemArray,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        setCartItem({});

        // Handle post-order messaging redirects
        const firstProductId = Object.keys(cartItem).find(key => cartItem[key] > 0);
        const firstProduct = products.find(p => p._id === firstProductId);

        if (selectedPaymentMethod === "WhatsApp Messaging") {
          const sellerPhone = firstProduct?.sellerPhone || "652126538"; // Fallback to dummy if seller has no phone
          const message = encodeURIComponent(`Hello! I'm interested in purchasing your product. I'd like to proceed with a direct payment. Could you please confirm that the item is still available and share your preferred payment method and any relevant payment details? Once I receive the information, I'll review it and complete the payment if everything is in order. Thank you, and I look forward to your response!`);
          window.open(`https://wa.me/${sellerPhone}?text=${message}`, "_blank");
        } else if (selectedPaymentMethod === "Email") {
          const sellerEmail = firstProduct?.sellerEmail || "fuadochris@gmail.com";
          const subject = encodeURIComponent("New Order Placed");
          const body = encodeURIComponent(`Hello! I'm interested in purchasing your product. I'd like to proceed with a direct payment. Could you please confirm that the item is still available and share your preferred payment method and any relevant payment details? Once I receive the information, I'll review it and complete the payment if everything is in order. Thank you, and I look forward to your response!`);
          window.location.href = `mailto:${sellerEmail}?subject=${subject}&body=${body}`;
        }

        router.push("/order-placed");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) fetchUserAddresses();
  }, [user]);

  const taxAmount = getCartAmount() * 0.02;
  const totalAmount = getCartAmount() + taxAmount;

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        {/* Address Dropdown */}
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.region}`
                  : "Select Address"}
              </span>
              <svg
                className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"
                  }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#6B7280"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city},{" "}
                    {address.region}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Promo Code */}
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Promo Code
          </label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
            />
            <button className="bg-orange-600 text-white px-9 py-2 hover:bg-orange-700">
              Apply
            </button>
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        {/* Order Totals */}
        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800">
              {currency}
              {getCartAmount().toFixed(2)}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Free</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Tax (2%)</p>
            <p className="font-medium text-gray-800">
              {currency}
              {taxAmount.toFixed(2)}
            </p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>
              {currency}
              {totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handlePlaceOrderClick}
        className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700"
      >
        Place Order
      </button>

      {/* Payment Method Popup */}
      {isPaymentPopupOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Select Contact / Payment Method</h3>
            <div className="space-y-3 mb-6">
              {['WhatsApp Messaging', 'Email', 'Credit/Debit Card', 'PayPal'].map((method) => (
                <label key={method} className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={selectedPaymentMethod === method}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-orange-600 accent-orange-600"
                  />
                  <span className="text-gray-700">{method}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsPaymentPopupOpen(false)}
                className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={createOrder}
                className="flex-1 py-2.5 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
