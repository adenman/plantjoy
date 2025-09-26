import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { useAuth } from "../context/AuthContext"; // Import useAuth to check for a logged-in user

// Replace with your actual Stripe Publishable Key
const stripePromise = loadStripe("pk_test_51SAxPSBPPi9kpD2Ytp3orgpkuoLC1L2Gqnei9jXpDhRlWKnxcMrEBR5PExa5ARoRspYuUvd3pz6iVfSknH7oy9kl00tSfEUVPV");

const pickupLocations = [
    { name: "Select a location...", address: "", zip: "" },
    { name: "WI Cardiology Associates, Mequon", address: "11725 N. Port Washington Rd, Mequon, WI", zip: "53092" },
    { name: "Pop's Pantry, Muskego", address: "S75W17461 Janesville Road, Muskego, WI", zip: "53150" },
    { name: "Old Breed Strength Club, Bayview", address: "2018 S 1st St #195, Bayview, WI", zip: "53207" },
    { name: "Kelly’s Greens, Wauwatosa", address: "8932 W North Ave, Wauwatosa, WI", zip: "53226" }
];

const CartPage = ({ cartItems, onUpdateCart }) => {
  const { user } = useAuth(); // Get the current user from context
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState(null);

  // Form fields state
  const [orderType, setOrderType] = useState("pickup");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [tip, setTip] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(pickupLocations[0].name);

  // State for saved addresses
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedSavedAddress, setSelectedSavedAddress] = useState("new");

  // Fetch saved addresses if the user is logged in
  useEffect(() => {
    if (user) {
      // Pre-fill name and email for logged-in users
      setCustomerName(user.name);
      setCustomerEmail(user.email);

      fetch('/plantjoy/api/addresses.php')
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                setSavedAddresses(data);
            }
        })
        .catch(err => console.error("Could not fetch addresses", err));
    }
  }, [user]);

  const handleLocationChange = (e) => {
    const locationName = e.target.value;
    const location = pickupLocations.find(loc => loc.name === locationName);
    setSelectedLocation(locationName);
    if (location) {
        setZipCode(location.zip);
    }
  };

  // When a user selects a saved address from the dropdown
  const handleSavedAddressChange = (e) => {
      const selectedId = e.target.value;
      setSelectedSavedAddress(selectedId);
      if (selectedId === "new") {
          // Clear fields if they want to enter a new address
          setDeliveryAddress("");
          setZipCode("");
      } else {
          // Find the selected address and auto-fill the fields
          const address = savedAddresses.find(addr => addr.id.toString() === selectedId);
          if (address) {
              setDeliveryAddress(`${address.address_line1}, ${address.city}, ${address.state}`);
              setZipCode(address.zip_code);
          }
      }
  };
  
  const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
  const taxRate = (zipCode.startsWith("532") || zipCode.startsWith("531")) ? 0.079 : 0.05; // Milwaukee tax rate
  const tax = subtotal * taxRate;
  const total = subtotal + tax + parseFloat(tip || 0);

  const finalAddress = orderType === 'delivery' ? deliveryAddress : selectedLocation;
  
  const orderDetails = {
      customerName, customerEmail, orderType, address: finalAddress, zipCode,
      cartItems, subtotal, tax, tip: parseFloat(tip || 0), total
  };

  const isFormComplete = customerName && customerEmail && (
    (orderType === 'pickup' && selectedLocation !== pickupLocations[0].name) ||
    (orderType === 'delivery' && deliveryAddress && zipCode.length === 5)
  );
  
  useEffect(() => {
    setError(null);
    setClientSecret("");

    if (cartItems.length > 0 && isFormComplete) {
      sessionStorage.setItem('orderDetails', JSON.stringify(orderDetails));
      fetch("/plantjoy/api/create-payment-intent.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems, tip: parseFloat(tip || 0), zipCode, customerName, customerEmail, address: finalAddress, orderType }),
      })
      .then(async res => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error?.message || "An unknown server error occurred.");
          return data;
      })
      .then(data => setClientSecret(data.clientSecret))
      .catch(err => setError(err.message));
    }
  }, [cartItems, tip, zipCode, customerName, customerEmail, deliveryAddress, orderType, selectedLocation]);

  const handleRemoveFromCart = (index) => onUpdateCart(cartItems.filter((_, i) => i !== index));

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      {cartItems.length === 0 ? ( <p className="text-center text-gray-500">Your cart is currently empty.</p> ) : (
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column: Order & Customer Details */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Your Details</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block font-semibold mb-1">Full Name</label>
                    <input type="text" id="name" value={customerName} onChange={e => setCustomerName(e.target.value)} className="border rounded p-2 w-full" />
                </div>
                <div>
                    <label htmlFor="email" className="block font-semibold mb-1">Email</label>
                    <input type="email" id="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className="border rounded p-2 w-full" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-3">Order Type</h3>
                    <div className="flex space-x-4"><label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="orderType" value="pickup" checked={orderType === "pickup"} onChange={() => { setOrderType("pickup"); setZipCode(pickupLocations.find(l=>l.name === selectedLocation)?.zip || "")}} /><span>Pickup</span></label><label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="orderType" value="delivery" checked={orderType === "delivery"} onChange={() => { setOrderType("delivery"); setZipCode("")}} /><span>Delivery</span></label></div>
                </div>
                
                {orderType === 'pickup' ? (
                    <div>
                        <label htmlFor="pickupLocation" className="block font-semibold mb-1">Pickup Location</label>
                        <select id="pickupLocation" value={selectedLocation} onChange={handleLocationChange} className="border rounded p-2 w-full">
                            {pickupLocations.map(loc => <option key={loc.name} value={loc.name}>{loc.name}</option>)}
                        </select>
                    </div>
                ) : (
                    <>
                        {user && savedAddresses.length > 0 && (
                            <div>
                                <label htmlFor="savedAddress" className="block font-semibold mb-1">Delivery Address</label>
                                <select id="savedAddress" value={selectedSavedAddress} onChange={handleSavedAddressChange} className="border rounded p-2 w-full mb-2">
                                    <option value="new">-- Enter a new address --</option>
                                    {savedAddresses.map(addr => (
                                        <option key={addr.id} value={addr.id}>
                                            {addr.address_line1}, {addr.city}, {addr.state} {addr.zip_code}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        
                        {(selectedSavedAddress === 'new' || !user) && (
                             <>
                                <div>
                                    <label htmlFor="address" className="block font-semibold mb-1">Delivery Address</label>
                                    <input type="text" id="address" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} className="border rounded p-2 w-full" placeholder="Street Address, City, State" />
                                </div>
                                <div>
                                    <label htmlFor="zip" className="block font-semibold mb-1">Delivery ZIP Code</label>
                                    <input type="text" id="zip" value={zipCode} onChange={e => setZipCode(e.target.value)} maxLength="5" className="border rounded p-2 w-full md:w-1/2" placeholder="For tax calculation" />
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 border-b pb-2">Your Order</h2>
            {cartItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-4 border-b">
                <div><p className="font-bold">{item.name}</p><p className="text-sm text-gray-600">${parseFloat(item.price).toFixed(2)}</p></div>
                <button onClick={() => handleRemoveFromCart(index)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Remove</button>
              </div>
            ))}
          </div>

          {/* Right Column: Payment */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Payment</h2>
            <div className="space-y-2">
                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Sales Tax</span><span>${tax.toFixed(2)}</span></div>
                <div className="flex justify-between items-center"><label htmlFor="tip" className="font-semibold">Add a Tip</label><div className="flex items-center"><span className="mr-1">$</span><input type="number" id="tip" value={tip} onChange={e => setTip(e.target.value)} className="w-24 text-right border rounded px-2 py-1" placeholder="0.00" /></div></div>
                <div className="flex justify-between font-bold text-xl border-t-2 border-gray-300 pt-4 mt-4"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
            <div className="mt-8">
              {error && (<div className="text-center text-red-600 mb-4"><p><strong>Could not load payment form:</strong></p><p>{error}</p></div>)}
              {clientSecret && isFormComplete && !error ? (
                <Elements options={{ clientSecret, appearance: { theme: 'stripe' } }} stripe={stripePromise}>
                  <CheckoutForm />
                </Elements>
              ) : (
                !error && <p className="text-center text-gray-500">Please complete all fields to proceed.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;