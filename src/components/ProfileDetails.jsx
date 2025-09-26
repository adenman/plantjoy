// src/components/ProfileDetails.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfileDetails = () => {
    const { user, login } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/plantjoy/api/profile.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        });
        const data = await response.json();
        if (data.success) {
            login({ ...user, name, email }); // Update user in context
            setMessage('Profile updated successfully!');
        } else {
            setMessage(data.error || 'An error occurred.');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-brand-gray border-b pb-2 mb-4">Account Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold">Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block font-semibold">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded p-2" />
                </div>
                <button type="submit" className="bg-brand-green text-white font-bold py-2 px-6 rounded-lg">Save Changes</button>
            </form>
            {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
        </div>
    );
};

export default ProfileDetails;