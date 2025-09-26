import React, { useState, useEffect } from 'react';

const AdminReheatPage = () => {
    const [reheatItems, setReheatItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        fetch('/plantjoy/api/reheat.php')
            .then(res => res.json())
            .then(data => setReheatItems(data));
    }, []);

    const openEditModal = (item) => {
        setEditingItem({ ...item });
        setIsModalOpen(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setEditingItem(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        fetch('/plantjoy/api/admin/reheat.php', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editingItem)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setReheatItems(reheatItems.map(item => item.id === editingItem.id ? editingItem : item));
                setIsModalOpen(false);
                setEditingItem(null);
            }
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this instruction?')) {
            fetch(`/plantjoy/api/admin/reheat.php?id=${id}`, { method: 'DELETE' })
                .then(() => {
                    setReheatItems(reheatItems.filter(item => item.id !== id));
                });
        }
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold text-brand-gray mb-8">Manage Reheat Instructions</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="space-y-2">
                    {reheatItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center border-b py-2">
                            <span>{item.title}</span>
                            <div>
                                <button onClick={() => openEditModal(item)} className="text-blue-500 font-semibold mr-4">Edit</button>
                                <button onClick={() => handleDelete(item.id)} className="text-red-500 font-semibold">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- Edit Modal --- */}
            {isModalOpen && editingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-4">Edit Reheat Instruction</h2>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label className="block font-semibold">Title</label>
                                <input type="text" name="title" value={editingItem.title} onChange={handleFormChange} className="w-full border rounded p-2"/>
                            </div>
                            <div>
                                <label className="block font-semibold">Methods</label>
                                <input type="text" name="methods" value={editingItem.methods} onChange={handleFormChange} className="w-full border rounded p-2" placeholder="e.g., OVEN, AIR FRYER"/>
                            </div>
                            <div>
                                <label className="block font-semibold">Notes</label>
                                <textarea name="notes" value={editingItem.notes} onChange={handleFormChange} className="w-full border rounded p-2 h-32"/>
                            </div>
                            <div className="flex justify-end space-x-4 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 py-2 px-6 rounded-lg">Cancel</button>
                                <button type="submit" className="bg-brand-green text-white font-bold py-2 px-6 rounded-lg">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReheatPage;