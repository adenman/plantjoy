// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('/BoothPortal/api/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.success) {
                login(data.user);
                navigate('/bookings'); // Redirect to bookings page after login
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <section className="py-20 bg-gray-50 flex items-center justify-center">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center text-brand-gray mb-8">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block font-semibold">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block font-semibold">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border rounded p-2" />
                    </div>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <button type="submit" className="w-full bg-brand-green text-white font-bold py-3 rounded-lg hover:bg-opacity-90">Login</button>
                </form>
                <p className="text-center mt-4">
                    Don't have an account? <Link to="/register" className="text-brand-pink font-bold">Register here</Link>
                </p>
            </div>
        </section>
    );
};

export default LoginPage;