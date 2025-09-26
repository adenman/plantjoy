import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const AdminMenuPage = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Fetch initial data
    useEffect(() => {
        fetch('/plantjoy/api/menu.php')
            .then(res => res.json())
            .then(data => setMenuItems(data));
    }, []);

    // Setup Dropzone functionality
    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append('menuImage', file);

        fetch('/plantjoy/api/admin/upload_image.php', {
            method: 'POST',
            body: formData,
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Update the image URL in our editing state
                setEditingItem(prev => ({ ...prev, image: data.filePath }));
            } else {
                alert(data.error || 'Image upload failed.');
            }
        });
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop, 
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/webp': []
        }
    });

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
        fetch('/plantjoy/api/admin/menu.php', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editingItem)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setMenuItems(menuItems.map(item => item.id === editingItem.id ? editingItem : item));
                setIsModalOpen(false);
                setEditingItem(null);
            }
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            fetch(`/plantjoy/api/admin/menu.php?id=${id}`, { method: 'DELETE' })
                .then(() => setMenuItems(menuItems.filter(item => item.id !== id)));
        }
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold text-brand-gray mb-8">Manage Menu Items</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="space-y-2">
                    {menuItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center border-b py-2">
                             <div>
                                <p className="font-bold">{item.name}</p>
                                <p className="text-sm text-gray-500">${item.price} ({item.type})</p>
                            </div>
                            <div>
                                <button onClick={() => openEditModal(item)} className="text-blue-500 font-semibold mr-4">Edit</button>
                                <button onClick={() => handleDelete(item.id)} className="text-red-500 font-semibold">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- Edit Modal with Dropzone --- */}
            {isModalOpen && editingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-4">Edit Menu Item</h2>
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label className="block font-semibold">Name</label>
                                <input type="text" name="name" value={editingItem.name} onChange={handleFormChange} className="w-full border rounded p-2"/>
                            </div>
                            <div>
                                <label className="block font-semibold">Price</label>
                                <input type="number" step="0.01" name="price" value={editingItem.price} onChange={handleFormChange} className="w-full border rounded p-2"/>
                            </div>
                             <div>
                                <label className="block font-semibold">Type</label>
                                <select name="type" value={editingItem.type} onChange={handleFormChange} className="w-full border rounded p-2">
                                    <option value="fresh">Fresh</option>
                                    <option value="frozen">Frozen</option>
                                </select>
                            </div>
                            <div>
                                <label className="block font-semibold">Image</label>
                                <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50">
                                    <input {...getInputProps()} />
                                    {editingItem.image ? (
                                        <img src={editingItem.image} alt="Preview" className="mx-auto h-32"/>
                                    ) : (
                                        isDragActive ?
                                        <p>Drop the image here ...</p> :
                                        <p>Drag 'n' drop an image here, or click to select one</p>
                                    )}
                                </div>
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

export default AdminMenuPage;