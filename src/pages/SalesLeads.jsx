import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Helper function to format dates ---
const formatDate = (dateString) => {
    if (!dateString || dateString.startsWith('0000-00-00')) {
        return 'N/A';
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }
    return date.toLocaleDateString('en-US');
};

// --- Analytics Card Component ---
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
    const [leads, setLeads] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [emailContent, setEmailContent] = useState({ template: 'Initial Inquiry', message: '' });
    const [analytics, setAnalytics] = useState({
        totalActiveLeads: 0,
        newLeadsThisMonth: 0,
        conversionRate: 0
    });
    const navigate = useNavigate();

    const fetchLeads = () => {
        setIsLoading(true);
        fetch('/BoothPortal/api/leads.php')
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setLeads(data);
            })
            .catch(err => setError(err.message))
            .finally(() => setIsLoading(false));
    };
    
    const fetchAnalytics = () => {
        fetch('/BoothPortal/api/analytics.php')
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setAnalytics(data);
            })
            .catch(err => console.error("Analytics fetch error:", err.message));
    };

    useEffect(() => {
        fetchLeads();
        fetchAnalytics();
    }, []);

    const openEditModal = (lead) => {
        setSelectedLead(lead);
        setIsModalOpen(true);
    };

    const openEmailModal = (lead) => {
        setSelectedLead(lead);
        setIsEmailModalOpen(true);
    };

    const handleDelete = (leadId) => {
        if (window.confirm('Are you sure you want to delete this lead?')) {
            fetch(`/BoothPortal/api/leads.php?id=${leadId}`, { method: 'DELETE' })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        fetchLeads();
                        fetchAnalytics();
                    } else {
                        throw new Error(data.error);
                    }
                })
                .catch(err => alert(err.message));
        }
    };
    
    const handleSendEmail = (e) => {
        e.preventDefault();
        fetch('/BoothPortal/api/send_email.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: selectedLead.name,
                email: selectedLead.email,
                template: emailContent.template
            })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message || data.error);
            if (data.success) {
                setIsEmailModalOpen(false);
            }
        })
        .catch(err => alert(err.message));
    };
    
    const refreshData = () => {
        fetchLeads();
        fetchAnalytics();
    };

    if (isLoading) return <p className="text-center p-12">Loading leads...</p>;
    if (error) return <p className="text-center p-12 text-red-500">Error: {error}</p>;

    return (
        <section className="py-12 bg-gray-50 min-h-[80vh]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <AnalyticsCard title="Active Leads" value={analytics.totalActiveLeads} icon={'🔥'} />
                    <AnalyticsCard title="New This Month" value={analytics.newLeadsThisMonth} icon={'🎉'} />
                    <AnalyticsCard title="Conversion Rate" value={`${analytics.conversionRate}%`} icon={'🎯'} />
                </div>
                
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Sales Prospects</h2>
                    <button onClick={() => openEditModal({})} className="bg-brand-green text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-transform transform hover:scale-105">
                        + Add Lead
                    </button>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-lg overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">Name</th>
                                <th className="p-2">Status</th>
                                <th className="p-2">Event Date</th>
                                <th className="p-2">Follow-up Date</th>
                                <th className="p-2">Source</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map(lead => (
                                <tr key={lead.id} className="border-b hover:bg-gray-50">
                                    <td className="p-2">
                                        <p className="font-bold">{lead.name}</p>
                                        <p className="text-gray-500 text-xs">{lead.email}</p>
                                    </td>
                                    <td className="p-2">{lead.status}</td>
                                    <td className="p-2">{formatDate(lead.event_date)}</td>
                                    <td className="p-2">{formatDate(lead.follow_up_date)}</td>
                                    <td className="p-2">{lead.source}</td>
                                    <td className="p-2 space-x-2">
                                        <button onClick={() => openEditModal(lead)} className="text-blue-600 font-semibold">Edit</button>
                                        <button onClick={() => openEmailModal(lead)} className="text-green-600 font-semibold">Email</button>
                                        <button onClick={() => handleDelete(lead.id)} className="text-red-600 font-semibold">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <LeadProfileModal 
                    lead={selectedLead} 
                    onClose={() => setIsModalOpen(false)}
                    onSave={refreshData}
                    navigate={navigate}
                />
            )}

            {isEmailModalOpen && selectedLead && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
                        <h3 className="text-2xl font-bold mb-4">Send Email to {selectedLead.name}</h3>
                        <form onSubmit={handleSendEmail}>
                            <div className="mb-4">
                                <label className="block font-semibold mb-2">Email Template</label>
                                <select 
                                    value={emailContent.template} 
                                    onChange={(e) => setEmailContent({ ...emailContent, template: e.target.value })}
                                    className="w-full border rounded p-2"
                                >
                                    <option>Initial Inquiry</option>
                                    <option>Follow-up</option>
                                    <option>Package Details</option>
                                </select>
                            </div>
                            <div className="mb-6 p-4 bg-gray-100 rounded border h-48 overflow-y-auto">
                                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                    {`Hi ${selectedLead.name},\n\nThank you for your inquiry about The Booth MKE for your event. We'd love to be a part of it!\n\n...`}
                                </p>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button type="button" onClick={() => setIsEmailModalOpen(false)} className="bg-gray-200 py-2 px-6 rounded-lg">Cancel</button>
                                <button type="submit" className="bg-brand-green text-white font-bold py-2 px-6 rounded-lg">Send Email</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};


const LeadProfileModal = ({ lead, onClose, onSave, navigate }) => {
    const [leadData, setLeadData] = useState(lead || {});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLeadData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = '/BoothPortal/api/leads.php';
        const method = leadData.id ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(leadData)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                onSave();
                onClose();
            } else {
                throw new Error(data.error);
            }
        })
        .catch(err => alert(err.message));
    };

    const handleConvertToBooking = () => {
        if (window.confirm('This will create a new confirmed booking from this lead. Are you sure?')) {
            fetch('/BoothPortal/api/leads.php?action=convert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: leadData.id })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert(`Booking #${data.bookingId} created successfully! You will now be taken to the bookings page.`);
                    onClose();
                    navigate('/bookings');
                } else {
                    throw new Error(data.error);
                }
            })
            .catch(err => alert(err.message));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-xl">
                <h3 className="text-2xl font-bold mb-6">{leadData.id ? 'Edit Lead Profile' : 'Add New Lead'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-semibold">Name*</label>
                            <input type="text" name="name" value={leadData.name || ''} onChange={handleInputChange} required className="w-full border rounded p-2" />
                        </div>
                        <div>
                            <label className="block font-semibold">Email*</label>
                            <input type="email" name="email" value={leadData.email || ''} onChange={handleInputChange} required className="w-full border rounded p-2" />
                        </div>
                        <div>
                            <label className="block font-semibold">Phone</label>
                            <input type="tel" name="phone" value={leadData.phone || ''} onChange={handleInputChange} className="w-full border rounded p-2" />
                        </div>
                        <div>
                            <label className="block font-semibold">Event Date</label>
                            <input type="date" name="event_date" value={leadData.event_date || ''} onChange={handleInputChange} className="w-full border rounded p-2" />
                        </div>
                        <div>
                            <label className="block font-semibold">Status</label>
                            <select name="status" value={leadData.status || 'New'} onChange={handleInputChange} className="w-full border rounded p-2">
                                <option>New</option>
                                <option>Contacted</option>
                                <option>Proposal Sent</option>
                                <option>Won</option>
                                <option>Lost</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-semibold">Source</label>
                            <input type="text" name="source" value={leadData.source || ''} onChange={handleInputChange} className="w-full border rounded p-2" />
                        </div>
                         <div>
                            <label className="block font-semibold">Follow-up Date</label>
                            <input type="date" name="follow_up_date" value={leadData.follow_up_date || ''} onChange={handleInputChange} className="w-full border rounded p-2" />
                        </div>
                    </div>
                    <div>
                        <label className="block font-semibold">Notes</label>
                        <textarea name="notes" value={leadData.notes || ''} onChange={handleInputChange} className="w-full border rounded p-2 h-24"></textarea>
                    </div>
                    <div className="flex justify-between items-center mt-6">
                        <div>
                            {leadData.status === 'Won' && (
                                <button type="button" onClick={handleConvertToBooking} className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600">
                                    Convert to Booking
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

export default SalesLeads;