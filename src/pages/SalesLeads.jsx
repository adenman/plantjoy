import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const formatDate = (dateString) => {
    if (!dateString || dateString.startsWith('0000-00-00')) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString('en-US');
};

const AnalyticsCard = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
        <div className="bg-blue-500 text-white rounded-full h-12 w-12 flex items-center justify-center mr-4">
            <span className="text-2xl">{icon}</span>
        </div>
        <div>
            <h4 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{title}</h4>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

const SalesLeads = () => {
    const [activeTab, setActiveTab] = useState('prospects');
    const [leads, setLeads] = useState([]);
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [emailContent, setEmailContent] = useState({ template: 'Initial Inquiry' });
    const [analytics, setAnalytics] = useState({ totalActiveLeads: 0, newLeadsThisMonth: 0, conversionRate: 0 });
    const navigate = useNavigate();

    const fetchAllData = useCallback(() => {
        setIsLoading(true);
        Promise.all([
            fetch('/BoothPortal/api/leads.php').then(res => res.json()),
            fetch('/BoothPortal/api/clients.php').then(res => res.json()),
            fetch('/BoothPortal/api/analytics.php').then(res => res.json())
        ]).then(([leadsData, clientsData, analyticsData]) => {
            if (leadsData.error) throw new Error(leadsData.error);
            if (clientsData.error) throw new Error(clientsData.error);
            if (analyticsData.error) throw new Error(analyticsData.error);
            setLeads(leadsData);
            setClients(clientsData);
            setAnalytics(analyticsData);
        }).catch(err => setError(err.message))
        .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => { fetchAllData(); }, []);

    const openLeadModal = (lead = {}) => {
        setSelectedItem(lead);
        setIsLeadModalOpen(true);
    };

    const openClientModal = (client = {}) => {
        setSelectedItem(client);
        setIsClientModalOpen(true);
    };

    const openEmailModal = (item) => {
        setSelectedItem(item);
        setIsEmailModalOpen(true);
    };
    
    const openBookingModal = (lead) => {
        setIsLeadModalOpen(false);
        setSelectedItem(lead);
        setIsBookingModalOpen(true);
    };
    
    const openProfileModal = (client) => {
        setSelectedItem(client);
        setIsProfileModalOpen(true);
    };

    const handleDeleteLead = (leadId) => {
        if (window.confirm('Are you sure you want to permanently delete this lead?')) {
            fetch(`/BoothPortal/api/leads.php?id=${leadId}`, { method: 'DELETE' })
                .then(res => res.json())
                .then(data => {
                    if (data.success) fetchAllData();
                    else throw new Error(data.error);
                })
                .catch(err => alert(err.message));
        }
    };
    
    // --- NEW: Function to delete clients ---
    const handleDeleteClient = (clientId) => {
        if (window.confirm('Are you sure you want to permanently delete this client? This action cannot be undone.')) {
            fetch(`/BoothPortal/api/clients.php?id=${clientId}`, { method: 'DELETE' })
                .then(res => res.json())
                .then(data => {
                    if (data.success) fetchAllData();
                    else throw new Error(data.error);
                })
                .catch(err => alert(err.message));
        }
    };
    
    const handleSendEmail = (e) => {
        e.preventDefault();
        fetch('/BoothPortal/api/send_email.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: selectedItem.name, email: selectedItem.email, template: emailContent.template })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message || data.error);
            if (data.success) setIsEmailModalOpen(false);
        })
        .catch(err => alert(err.message));
    };

    if (isLoading) return <p className="text-center p-12">Loading data...</p>;
    if (error) return <p className="text-center p-12 text-red-500">Error: {error}</p>;

    return (
        <section className="py-12 bg-gray-50 min-h-[80vh]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <AnalyticsCard title="Active Leads" value={analytics.totalActiveLeads} icon={'🔥'} />
                    <AnalyticsCard title="New This Month" value={analytics.newLeadsThisMonth} icon={'🎉'} />
                    <AnalyticsCard title="Conversion Rate" value={`${analytics.conversionRate}%`} icon={'🎯'} />
                </div>
                
                <div className="flex justify-between items-center mb-8 border-b">
                     <div className="flex">
                        <button onClick={() => setActiveTab('prospects')} className={`px-6 py-3 font-semibold ${activeTab === 'prospects' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Sales Prospects ({leads.length})</button>
                        <button onClick={() => setActiveTab('clients')} className={`px-6 py-3 font-semibold ${activeTab === 'clients' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Client Profiles ({clients.length})</button>
                    </div>
                    <button onClick={() => activeTab === 'prospects' ? openLeadModal() : openClientModal()} className="bg-brand-green text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90">
                        {activeTab === 'prospects' ? '+ Add Lead' : '+ Add Client'}
                    </button>
                </div>
                
                {activeTab === 'prospects' && <LeadTable leads={leads} onEdit={openLeadModal} onEmail={openEmailModal} onDelete={handleDeleteLead} />}
                {activeTab === 'clients' && <ClientTable clients={clients} onEdit={openClientModal} onEmail={openEmailModal} onView={openProfileModal} onDelete={handleDeleteClient} />}
            </div>

            {isLeadModalOpen && <LeadModal lead={selectedItem} onClose={() => setIsLeadModalOpen(false)} onSave={handleSaveLead} onConvertToBooking={openBookingModal} />}
            {isClientModalOpen && <ClientModal client={selectedItem} onClose={() => setIsClientModalOpen(false)} onSave={handleSaveClient} />}
            {isBookingModalOpen && <BookingConversionModal lead={selectedItem} onClose={() => setIsBookingModalOpen(false)} onSave={fetchAllData} navigate={navigate} />}
            {isProfileModalOpen && <ClientProfileModal lead={selectedItem} onClose={() => setIsProfileModalOpen(false)} navigate={navigate} />}
            
            {isEmailModalOpen && selectedItem && ( <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">{/*...Email Modal...*/}</div> )}
        </section>
    );
};

const LeadTable = ({ leads, onEdit, onEmail, onDelete }) => (
    <div className="bg-white p-4 rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full text-left text-sm">
             <thead>
                <tr className="border-b">
                    <th className="p-2">Name</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Event Date</th>
                    <th className="p-2">Contact Date</th>
                    <th className="p-2">Follow-up Date</th>
                    <th className="p-2">Source</th>
                    <th className="p-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {leads.map(lead => (
                    <tr key={lead.id} className="border-b hover:bg-gray-50">
                        <td><p className="font-bold">{lead.name}</p><p className="text-gray-500 text-xs">{lead.email}</p></td>
                        <td>{lead.status}</td>
                        <td>{formatDate(lead.event_date)}</td>
                        <td>{formatDate(lead.contact_date)}</td>
                        <td>{formatDate(lead.follow_up_date)}</td>
                        <td>{lead.source}</td>
                        <td className="space-x-2"><button onClick={() => onEdit(lead)} className="text-blue-600">Edit</button><button onClick={() => onEmail(lead)} className="text-green-600">Email</button><button onClick={() => onDelete(lead.id)} className="text-red-600">Delete</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const ClientTable = ({ clients, onView, onEdit, onEmail, onDelete }) => (
     <div className="bg-white p-4 rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full text-left text-sm">
            <thead>
                <tr className="border-b">
                    <th className="p-2">Name</th>
                    <th className="p-2">Contact Date</th>
                    <th className="p-2">Source</th>
                    <th className="p-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {clients.map(client => (
                    <tr key={client.id} className="border-b hover:bg-gray-50">
                        <td>
                            <p className="font-bold">{client.name}</p>
                            <p className="text-gray-500 text-xs">{client.email}</p>
                            {client.booking_count > 1 && <span className="mt-1 inline-block bg-indigo-200 text-xs px-2 py-0.5 rounded-full">Returning Client</span>}
                        </td>
                        <td>{formatDate(client.contact_date)}</td>
                        <td>{client.source}</td>
                        <td className="space-x-2">
                            <button onClick={() => onView(client)} className="text-green-600 font-semibold">View Profile</button>
                            <button onClick={() => onEdit(client)} className="text-blue-600 font-semibold">Edit</button>
                            <button onClick={() => onEmail(client)} className="text-gray-600 font-semibold">Email</button>
                            {/* --- NEW: Delete button for clients --- */}
                            <button onClick={() => onDelete(client.id)} className="text-red-600 font-semibold">Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const LeadModal = ({ lead, onClose, onSave, onConvertToBooking }) => {
    const [leadData, setLeadData] = useState(lead || {});
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLeadData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const url = '/BoothPortal/api/leads.php';
        const method = leadData.id ? 'PUT' : 'POST';
        fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(leadData) })
            .then(res => res.json()).then(data => {
                if (data.success) { onSave(); onClose(); } 
                else { throw new Error(data.error); }
            }).catch(err => alert(err.message));
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                 <h3 className="text-2xl font-bold mb-6">{leadData.id ? 'Edit Lead' : 'Add New Lead'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block font-semibold">Name*</label><input type="text" name="name" value={leadData.name || ''} onChange={handleInputChange} required className="w-full p-2 border rounded" /></div>
                        <div><label className="block font-semibold">Email*</label><input type="email" name="email" value={leadData.email || ''} onChange={handleInputChange} required className="w-full p-2 border rounded" /></div>
                        <div><label className="block font-semibold">Phone</label><input type="tel" name="phone" value={leadData.phone || ''} onChange={handleInputChange} className="w-full p-2 border rounded" /></div>
                        <div><label className="block font-semibold">Event Date</label><input type="date" name="event_date" value={leadData.event_date || ''} onChange={handleInputChange} className="w-full p-2 border rounded" /></div>
                        <div>
                            <label className="block font-semibold">Status</label>
                            <select name="status" value={leadData.status || 'New'} onChange={handleInputChange} className="w-full p-2 border rounded">
                                <option>New</option><option>Contacted</option><option>Proposal Sent</option><option>Won</option><option>Lost</option>
                            </select>
                        </div>
                        <div><label className="block font-semibold">Source</label><input type="text" name="source" value={leadData.source || ''} onChange={handleInputChange} className="w-full p-2 border rounded" /></div>
                        <div><label className="block font-semibold">Contact Date</label><input type="date" name="contact_date" value={leadData.contact_date || ''} onChange={handleInputChange} className="w-full p-2 border rounded" /></div>
                        <div><label className="block font-semibold">Follow-up Date</label><input type="date" name="follow_up_date" value={leadData.follow_up_date || ''} onChange={handleInputChange} className="w-full p-2 border rounded" /></div>
                    </div>
                    <div>
                        <label className="block font-semibold">Notes</label>
                        <textarea name="notes" value={leadData.notes || ''} onChange={handleInputChange} className="w-full p-2 border rounded h-24"></textarea>
                    </div>
                    <div className="flex justify-between items-center mt-6">
                        <div>
                            {leadData.status === 'Won' && (
                                <button type="button" onClick={() => onConvertToBooking(leadData)} className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg">
                                    Convert to Booking...
                                </button>
                            )}
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button type="button" onClick={onClose} className="bg-gray-200 py-2 px-6 rounded-lg">Cancel</button>
                            <button type="submit" className="bg-brand-green text-white font-bold py-2 px-6 rounded-lg">Save</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ClientModal = ({ client, onClose, onSave }) => {
    const [clientData, setClientData] = useState(client || {});
     const handleSubmit = (e) => {
        e.preventDefault();
        const url = '/BoothPortal/api/clients.php';
        const method = clientData.id ? 'PUT' : 'POST';
        fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(clientData) })
        .then(res => res.json()).then(data => {
            if (data.success) { onSave(); onClose(); } 
            else { throw new Error(data.error); }
        }).catch(err => alert(err.message));
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                 <h3 className="text-2xl font-bold mb-6">{clientData.id ? 'Edit Client' : 'Add New Client'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block font-semibold">Name*</label><input type="text" name="name" value={clientData.name || ''} onChange={(e) => setClientData({...clientData, name: e.target.value})} required className="w-full p-2 border rounded" /></div>
                        <div><label className="block font-semibold">Email*</label><input type="email" name="email" value={clientData.email || ''} onChange={(e) => setClientData({...clientData, email: e.target.value})} required className="w-full p-2 border rounded" /></div>
                        <div><label className="block font-semibold">Phone</label><input type="tel" name="phone" value={clientData.phone || ''} onChange={(e) => setClientData({...clientData, phone: e.target.value})} className="w-full p-2 border rounded" /></div>
                        <div><label className="block font-semibold">Source</label><input type="text" name="source" value={clientData.source || ''} onChange={(e) => setClientData({...clientData, source: e.target.value})} className="w-full p-2 border rounded" /></div>
                        <div><label className="block font-semibold">First Contact Date</label><input type="date" name="contact_date" value={clientData.contact_date || ''} onChange={(e) => setClientData({...clientData, contact_date: e.target.value})} className="w-full p-2 border rounded" /></div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 py-2 px-6 rounded-lg">Cancel</button>
                        <button type="submit" className="bg-brand-green text-white font-bold py-2 px-6 rounded-lg">Save Client</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const BookingConversionModal = ({ lead, onClose, onSave, navigate }) => {
    const [bookingData, setBookingData] = useState({ event_type: 'Wedding', package: 'Standard', start_time: '', end_time: '', notes: lead.notes || '' });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookingData(prev => ({ ...prev, [name]: value }));
    };
    const handleFinalizeConversion = (e) => {
        e.preventDefault();
        fetch('/BoothPortal/api/leads.php?action=convert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lead: lead, booking: bookingData })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert(`Booking #${data.bookingId} created and lead converted to client!`);
                onSave();
                onClose();
                navigate('/bookings');
            } else {
                throw new Error(data.error);
            }
        })
        .catch(err => alert(err.message));
    };
    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                 <h3 className="text-2xl font-bold mb-2">Create Booking for {lead.name}</h3>
                 <p className="text-sm text-gray-500 mb-6">Finalize the event details for this new client.</p>
                <form onSubmit={handleFinalizeConversion} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-semibold">Event Type*</label>
                            <select name="event_type" value={bookingData.event_type} onChange={handleInputChange} required className="w-full p-2 border rounded">
                                <option>Wedding</option><option>Corporate</option><option>Birthday Party</option><option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-semibold">Package</label>
                            <select name="package" value={bookingData.package} onChange={handleInputChange} className="w-full p-2 border rounded">
                                <option>Standard</option><option>Premium</option><option>Deluxe</option><option>Custom</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block font-semibold">Event Start Time*</label>
                        <input type="datetime-local" name="start_time" value={bookingData.start_time} onChange={handleInputChange} required className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block font-semibold">Event End Time*</label>
                        <input type="datetime-local" name="end_time" value={bookingData.end_time} onChange={handleInputChange} required className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block font-semibold">Notes</label>
                        <textarea name="notes" value={bookingData.notes} onChange={handleInputChange} className="w-full p-2 border rounded h-24"></textarea>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 py-2 px-6 rounded-lg">Cancel</button>
                        <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg">Save Booking & Convert</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const ClientProfileModal = ({ lead, onClose, navigate }) => {
    const [profile, setProfile] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (lead?.email) {
            setIsLoading(true);
            setError(null);
            fetch(`/BoothPortal/api/client_profile.php?email=${lead.email}`)
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch profile.');
                    return res.json();
                })
                .then(data => {
                    if (data.error) throw new Error(data.error);
                    setProfile(data.profile);
                    setBookings(data.bookings);
                })
                .catch(err => setError(err.message))
                .finally(() => setIsLoading(false));
        }
    }, [lead]);

    const addBookingForClient = () => {
        onClose(); 
        navigate('/bookings', { 
            state: { 
                prefillData: {
                    client_name: profile.name,
                    client_email: profile.email,
                    client_phone: profile.phone
                }
            }
        });
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                <h3 className="text-2xl font-bold mb-6">Client Profile</h3>
                {isLoading ? <p>Loading profile...</p> 
                 : error ? <p className="text-red-500">Error: {error}</p>
                 : profile ? (
                    <div>
                        <div className="mb-6 border-b pb-4">
                            <p className="text-xl font-bold">{profile.name}</p>
                            <p className="text-gray-600">{profile.email}</p>
                            <p className="text-gray-600">{profile.phone}</p>
                        </div>
                        <h4 className="font-bold mb-2">Booking History</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {bookings.length > 0 ? bookings.map(b => (
                                <div key={b.id} className="p-2 bg-gray-100 rounded text-sm">
                                    <p><strong>Event:</strong> {b.event_type} ({b.status})</p>
                                    <p><strong>Date:</strong> {formatDate(b.start_time)}</p>
                                </div>
                            )) : <p>No bookings found.</p>}
                        </div>
                        <div className="flex justify-between items-center mt-8">
                             <button type="button" onClick={addBookingForClient} className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg">
                                Add Booking for this Client
                            </button>
                            <button type="button" onClick={onClose} className="bg-gray-200 py-2 px-6 rounded-lg">Close</button>
                        </div>
                    </div>
                ) : <p>Could not load profile.</p>}
            </div>
        </div>
    );
};

export default SalesLeads;