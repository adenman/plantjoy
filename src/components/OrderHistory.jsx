import React, { useState, useEffect } from 'react';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/plantjoy/api/orders.php')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Could not fetch order history.');
                }
                return res.json();
            })
            .then(data => {
                setOrders(data);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return (
            <div>
                <h2 className="text-2xl font-bold text-brand-gray border-b pb-2 mb-4">Order History</h2>
                <p>Loading order history...</p>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-brand-gray border-b pb-2 mb-4">Order History</h2>
            {orders.length === 0 ? (
                <p className="text-gray-500">You have no past orders.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => {
                        // The cart_items are stored as a JSON string, so we need to parse it
                        const items = JSON.parse(order.cart_items);
                        return (
                            <div key={order.id} className="bg-gray-50 p-4 rounded-lg border">
                                <div className="flex justify-between items-baseline mb-3">
                                    <h3 className="font-bold text-brand-gray">Order #{order.id}</h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(order.order_date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="border-t border-b py-2 space-y-2">
                                    {items.map((item, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span>{item.name}</span>
                                            <span>${parseFloat(item.price).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between font-bold mt-3">
                                    <span>Total</span>
                                    <span>${parseFloat(order.total_amount).toFixed(2)}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;