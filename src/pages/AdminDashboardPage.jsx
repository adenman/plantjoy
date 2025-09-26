// src/pages/AdminDashboardPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold text-brand-gray mb-8">Admin Dashboard</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Link to="/admin/menu" className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center">
                    <h2 className="text-2xl font-bold text-brand-green">Manage Menu</h2>
                    <p className="mt-2 text-gray-600">Add, edit, or delete menu items.</p>
                </Link>
                <Link to="/admin/reheat" className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center">
                    <h2 className="text-2xl font-bold text-brand-blue">Manage Reheat Instructions</h2>
                    <p className="mt-2 text-gray-600">Add, edit, or delete instructions.</p>
                </Link>
                <Link to="/admin/orders" className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center">
                    <h2 className="text-2xl font-bold text-brand-pink">View Orders</h2>
                    <p className="mt-2 text-gray-600">View customer orders for delivery.</p>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboardPage;