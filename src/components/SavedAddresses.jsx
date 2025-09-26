// src/components/SavedAddresses.jsx
import React, { useState, useEffect } from 'react';

const SavedAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    // State for the new address form
    const [addressLine1, setAddressLine1] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');

    useEffect(() => {
        fetch('/plantjoy/api/addresses.php')
            .then(res => res.json())
            .then(data => setAddresses(data));
    }, []);

    const handleAddAddress = async (e) => {
        e.preventDefault();
        const response = await fetch('/plantjoy/api/addresses.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address_line1: addressLine1, city, state, zip_code: zipCode })
        });
        const data = await response.json();
        if (data.success) {
            setAddresses([...addresses, { id: data.id, address_line1: addressLine1, city, state, zip_code: zipCode }]);
            // Clear form
            setAddressLine1(''); setCity(''); setState(''); setZipCode('');
        }
    };
    
    const handleDelete = async (id) => {
        await fetch(`/plantjoy/api/addresses.php/${id}`, { method: 'DELETE' });
        setAddresses(addresses.filter(addr => addr.id !== id));
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-brand-gray border-b pb-2 mb-4">Saved Addresses</h2>
            <div className="space-y-4 mb-8">
                {addresses.map(addr => (
                    <div key={addr.id} className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                        <p>{addr.address_line1}, {addr.city}, {addr.state} {addr.zip_code}</p>
                        <button onClick={() => handleDelete(addr.id)} className="text-red-500 font-semibold">Delete</button>
                    </div>
                ))}
            </div>
            <form onSubmit={handleAddAddress} className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-bold">Add New Address</h3>
                <input type="text" value={addressLine1} onChange={e => setAddressLine1(e.target.value)} placeholder="Address Line 1" className="w-full border rounded p-2" />
                <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="City" className="w-full border rounded p-2" />
                <input type="text" value={state} onChange={e => setState(e.target.value)} placeholder="State" className="w-full border rounded p-2" />
                <input type="text" value={zipCode} onChange={e => setZipCode(e.target.value)} placeholder="ZIP Code" className="w-full border rounded p-2" />
                <button type="submit" className="bg-brand-green text-white font-bold py-2 px-6 rounded-lg">Add Address</button>
            </form>
        </div>
    );
};

export default SavedAddresses;