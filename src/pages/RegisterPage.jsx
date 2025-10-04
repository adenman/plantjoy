// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            // Note: The 'name' state from React is sent as 'name' in the JSON, 
            // but the PHP script correctly interprets it as 'username' for the database.
            const response = await fetch('/BoothPortal/api/register.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setSuccess('Registration successful! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                throw new Error(data.error || 'Registration failed.');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <section className="py-20 bg-gray-50 flex items-center justify-center">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center text-brand-gray mb-8">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block font-semibold">Username</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block font-semibold">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block font-semibold">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border rounded p-2" />
                    </div>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {success && <p className="text-green-500 text-center">{success}</p>}
                    <button type="submit" className="w-full bg-brand-green text-white font-bold py-3 rounded-lg hover:bg-opacity-90">Register</button>
                </form>
                 <p className="text-center mt-4">
                    Already have an account? <Link to="/login" className="text-brand-pink font-bold">Login here</Link>
                </p>
            </div>
        </section>
    );
};

export default RegisterPage;