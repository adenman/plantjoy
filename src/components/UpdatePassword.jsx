// src/components/UpdatePassword.jsx
import React, { useState } from 'react';

const UpdatePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/plantjoy/api/profile.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPassword, newPassword })
        });
        const data = await response.json();
        setMessage(data.message || data.error);
        if (data.success) {
            setCurrentPassword('');
            setNewPassword('');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-brand-gray border-b pb-2 mb-4">Change Password</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-semibold">Current Password</label>
                    <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block font-semibold">New Password</label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full border rounded p-2" />
                </div>
                <button type="submit" className="bg-brand-green text-white font-bold py-2 px-6 rounded-lg">Update Password</button>
            </form>
            {message && <p className="mt-4 text-sm">{message}</p>}
        </div>
    );
};

export default UpdatePassword;