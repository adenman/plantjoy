import React, { useState, useEffect } from 'react';

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); // State to hold error messages

    useEffect(() => {
        fetch('/plantjoy/api/admin/orders.php')
            .then(res => res.json())
            .then(data => {
                // IMPORTANT: Check if the response contains an error
                if (data.error) {
                    throw new Error(data.error);
                }
                // Ensure the data is an array before setting it
                if (Array.isArray(data)) {
                    setOrders(data);
                } else {
                    throw new Error("Received invalid data from server.");
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching orders:", err);
                setError(err.message);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return (
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-brand-gray mb-8">Customer Orders</h1>
                <p>Loading orders...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-brand-gray mb-8">Customer Orders</h1>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold text-brand-gray mb-8">Customer Orders</h1>
            <div className="bg-white p-4 rounded-lg shadow-lg overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2">Date</th>
                            <th className="p-2">Customer</th>
                            <th className="p-2">Type</th>
                            <th className="p-2">Details</th>
                            <th className="p-2">Items</th>
                            <th className="p-2">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                                <td className="p-2 align-top">{new Date(order.order_date).toLocaleDateString()}</td>
                                <td className="p-2 align-top">
                                    <p className="font-bold">{order.customer_name}</p>
                                    <p className="text-sm text-gray-500">{order.customer_email}</p>
                                </td>
                                <td className="p-2 align-top">{order.order_type}</td>
                                <td className="p-2 text-sm align-top">{order.delivery_address}</td>
                                <td className="p-2 text-sm align-top">
                                    {JSON.parse(order.cart_items).map(item => (
                                        <div key={item.id}>{item.name}</div>
                                    ))}
                                </td>
                                <td className="p-2 font-bold align-top">${parseFloat(order.total_amount).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrdersPage;