import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';

const formatDate = (dateString) => {
    if (!dateString || dateString.startsWith('0000-00-00')) return 'N/A';
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString('en-US');
};

const formatDateForDB = (dateString) => {
    if (!dateString) return null;
    let date = new Date(dateString);
    if (isNaN(date.getTime())) {
        // Handle Excel's integer date format
        if (typeof dateString === 'number') {
            const excelEpoch = new Date(Date.UTC(1899, 11, 30));
            date = new Date(excelEpoch.getTime() + dateString * 86400000);
        } else {
            return null; // Return null if still invalid
        }
    }
    if (isNaN(date.getTime())) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

const getEmailTemplateText = (template, name) => {
    switch (template) {
        case 'Initial Inquiry':
            return `Hi ${name},\n\nThank you for your inquiry about The Booth MKE...`;
        case 'Proposal':
            return `Hi ${name},\n\nIt was great learning more about your event...`;
        case 'Follow-up':
            return `Hi ${name},\n\nJust wanted to follow up on our recent conversation...`;
        case 'Event Reminder':
            return `Hi ${name},\n\nThis is a friendly reminder that your event is coming up soon...`;
        default:
            return '';
    }
};

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
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedEventCode, setSelectedEventCode] = useState(null);
    const [emailContent, setEmailContent] = useState({ template: 'Initial Inquiry', message: '' });
    const [analytics, setAnalytics] = useState({ totalActiveLeads: 0, newLeadsThisMonth: 0, conversionRate: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchAllData = () => {
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
    };

    useEffect(() => { fetchAllData(); }, []);

    const filteredLeads = useMemo(() => 
        leads.filter(lead =>
            (lead.name && lead.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()))
        ), [leads, searchTerm]);

    const filteredClients = useMemo(() => 
        clients.filter(client =>
            (client.name && client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
        ), [clients, searchTerm]);

    const handleExport = () => {
        const dataToExport = activeTab === 'prospects' ? filteredLeads : filteredClients;
        const csv = Papa.unparse(dataToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${activeTab}_export.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleImportSave = (newLeads) => {
        if (newLeads.length === 0) {
            alert("No valid leads to import.");
            return;
        }
        fetch('/BoothPortal/api/leads.php?action=bulk-import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newLeads)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                fetchAllData();
            } else {
                throw new Error(data.error);
            }
        })
        .catch(err => {
            alert('An error occurred during import: ' + err.message);
        })
        .finally(() => {
            setIsImportModalOpen(false);
        });
    };

    // ... (rest of the functions like openLeadModal, openClientModal, etc. are the same)
    const openLeadModal = (lead = {}) => { setSelectedItem(lead); setIsLeadModalOpen(true); };
    const openClientModal = (client = {}) => { setSelectedItem(client); setIsClientModalOpen(true); };
    const openEmailModal = (item) => { setSelectedItem(item); const initialTemplate = 'Initial Inquiry'; setEmailContent({ template: initialTemplate, message: getEmailTemplateText(initialTemplate, item.name) }); setIsEmailModalOpen(true); };
    const openBookingModal = (lead) => { setIsLeadModalOpen(false); setSelectedItem(lead); setIsBookingModalOpen(true); };
    const openProfileModal = (client) => { setSelectedItem(client); setIsProfileModalOpen(true); };
    const openPhotoModal = (eventCode) => { setSelectedEventCode(eventCode); setIsPhotoModalOpen(true); setIsProfileModalOpen(false); };
    const handleDelete = (leadId) => { if (window.confirm('Are you sure you want to permanently delete this lead?')) { fetch(`/BoothPortal/api/leads.php?id=${leadId}`, { method: 'DELETE' }).then(res => res.json()).then(data => { if (data.success) fetchAllData(); else throw new Error(data.error); }).catch(err => alert(err.message)); } };
    const handleSendEmail = (e) => { e.preventDefault(); fetch('/BoothPortal/api/send_email.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: selectedItem.name, email: selectedItem.email, template: emailContent.template, message: emailContent.message }) }).then(res => res.json()).then(data => { alert(data.message || data.error); if (data.success) setIsEmailModalOpen(false); }).catch(err => alert(err.message)); };
    const handleTemplateChange = (newTemplate) => { setEmailContent({ template: newTemplate, message: getEmailTemplateText(newTemplate, selectedItem.name) }); };

    if (isLoading) return <p className="text-center p-12">Loading data...</p>;
    if (error) return <p className="text-center p-12 text-red-500">Error: {error}</p>;

    return (
        <section className="py-12 bg-page-gray min-h-[80vh]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <AnalyticsCard title="Active Leads" value={analytics.totalActiveLeads} icon={'🔥'} />
                    <AnalyticsCard title="New This Month" value={analytics.newLeadsThisMonth} icon={'🎉'} />
                    <AnalyticsCard title="Conversion Rate" value={`${analytics.conversionRate}%`} icon={'🎯'} />
                </div>
                
                <div className="flex flex-wrap justify-between items-center mb-4 border-b pb-2 gap-4">
                     <div className="flex">
                        <button onClick={() => { setActiveTab('prospects'); setSearchTerm(''); }} className={`px-6 py-3 font-semibold ${activeTab === 'prospects' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Sales Prospects ({leads.length})</button>
                        <button onClick={() => { setActiveTab('clients'); setSearchTerm(''); }} className={`px-6 py-3 font-semibold ${activeTab === 'clients' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Client Profiles ({clients.length})</button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsImportModalOpen(true)} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 text-sm">
                           Import from File
                        </button>
                         <button onClick={handleExport} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 text-sm">
                           Export to CSV
                        </button>
                        <button onClick={() => activeTab === 'prospects' ? openLeadModal() : openClientModal()} className="bg-brand-green text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90">
                            {activeTab === 'prospects' ? '+ Add Lead' : '+ Add Client'}
                        </button>
                    </div>
                </div>
                
                <div className="mb-6">
                    <input 
                        type="text"
                        placeholder={`Search ${activeTab === 'prospects' ? 'prospects' : 'clients'} by name or email...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border rounded-lg shadow-sm"
                    />
                </div>

                {activeTab === 'prospects' && <LeadTable leads={filteredLeads} onEdit={openLeadModal} onEmail={openEmailModal} onDelete={handleDelete} />}
                {activeTab === 'clients' && <ClientTable clients={filteredClients} onEdit={openClientModal} onEmail={openEmailModal} onView={openProfileModal} />}
            </div>

            {isLeadModalOpen && <LeadModal lead={selectedItem} onClose={() => setIsLeadModalOpen(false)} onSave={fetchAllData} onConvertToBooking={openBookingModal} />}
            {isClientModalOpen && <ClientModal client={selectedItem} onClose={() => setIsClientModalOpen(false)} onSave={fetchAllData} />}
            {isBookingModalOpen && <BookingConversionModal lead={selectedItem} onClose={() => setIsBookingModalOpen(false)} onSave={fetchAllData} navigate={navigate} />}
            {isProfileModalOpen && <ClientProfileModal lead={selectedItem} onClose={() => setIsProfileModalOpen(false)} navigate={navigate} onViewPhotos={openPhotoModal} />}
            {isPhotoModalOpen && <PhotoGalleryModal event_code={selectedEventCode} onClose={() => setIsPhotoModalOpen(false)} />}
            {isImportModalOpen && <ImportModal onClose={() => setIsImportModalOpen(false)} onSave={handleImportSave} />}
            
            {isEmailModalOpen && selectedItem && ( <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg"><h3 className="text-2xl font-bold mb-4">Send Email to {selectedItem.name}</h3><form onSubmit={handleSendEmail}><div className="mb-4"><label className="block font-semibold mb-2">Email Template</label><select value={emailContent.template} onChange={(e) => handleTemplateChange(e.target.value)} className="w-full border rounded p-2"><option>Initial Inquiry</option><option>Proposal</option><option>Follow-up</option><option>Event Reminder</option></select></div><div className="mb-6"><label className="block font-semibold mb-2">Message</label><textarea value={emailContent.message} onChange={(e) => setEmailContent({ ...emailContent, message: e.target.value })} className="w-full border rounded p-2 h-48 text-sm" /></div><div className="flex justify-end space-x-4"><button type="button" onClick={() => setIsEmailModalOpen(false)} className="bg-gray-200 py-2 px-6 rounded-lg">Cancel</button><button type="submit" className="bg-brand-green text-white font-bold py-2 px-6 rounded-lg">Send Email</button></div></form></div></div>)}
        </section>
    );
};

// --- UPDATED ImportModal Component ---
const ImportModal = ({ onClose, onSave }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [parsedData, setParsedData] = useState([]);
    const [source, setSource] = useState('Bridal Fair Fall 2025'); // Editable source with a default

    const processData = (dataArray) => {
        const newLeads = dataArray.map(row => {
            const firstName = row['First Name'] || row.FirstName || '';
            const lastName = row['Last Name'] || row.LastName || '';
            
            return {
                name: `${firstName} ${lastName}`.trim(),
                email: row.Email || row.email || '',
                phone: row['Cell Phone'] || row.Phone || '',
                event_date: formatDateForDB(row['Wedding Date'] || row.WeddingDate), // Map and format the date
                source: source, // Use the editable source from state
                status: 'New'
            };
        }).filter(lead => lead.name && lead.email);
        
        setParsedData(newLeads);
    };

    const handleFile = (fileToParse) => {
        setFile(fileToParse);
        setError('');
        setParsedData([]);

        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;

        reader.onload = (e) => {
            const fileContent = e.target.result;
            try {
                if (fileToParse.name.toLowerCase().endsWith('.csv')) {
                    Papa.parse(fileContent, {
                        header: true,
                        skipEmptyLines: true,
                        complete: (results) => processData(results.data)
                    });
                } else {
                    const wb = XLSX.read(fileContent, { type: rABS ? 'binary' : 'array', cellDates: true });
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];
                    const data = XLSX.utils.sheet_to_json(ws);
                    processData(data);
                }
            } catch (err) {
                setError('Error parsing file. Please ensure it is a valid CSV or Excel file.');
                console.error(err);
            }
        };

        if (rABS) {
            reader.readAsBinaryString(fileToParse);
        } else {
            reader.readAsArrayBuffer(fileToParse);
        }
    };
    
    // This handler applies the final source value just before saving
    const handleSaveClick = () => {
        const finalLeads = parsedData.map(lead => ({
            ...lead,
            source: source 
        }));
        onSave(finalLeads);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                handleFile(acceptedFiles[0]);
            }
        },
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
        }
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                <h3 className="text-2xl font-bold mb-4">Import Leads from File</h3>
                
                <div className="mb-4">
                    <label className="block font-semibold mb-2">Lead Source for this Import</label>
                    <input
                        type="text"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                        placeholder="e.g., Bridal Fair Fall 2025"
                    />
                </div>

                <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                    <input {...getInputProps()} />
                    {file ? <p>File: {file.name}</p> : <p>Drag & drop a CSV or Excel file here, or click to select.</p>}
                </div>

                {error && <p className="text-red-500 text-center mt-4">{error}</p>}

                {parsedData.length > 0 && (
                    <div className="mt-6">
                        <h4 className="font-semibold">Previewing {parsedData.length} leads:</h4>
                        <div className="max-h-60 overflow-y-auto bg-gray-50 border rounded-lg mt-2 p-2 text-sm">
                           <table className="w-full">
                               <thead>
                                   <tr className="text-left">
                                       <th className="p-1 font-bold">Name</th>
                                       <th className="p-1 font-bold">Email</th>
                                       <th className="p-1 font-bold">Event Date</th>
                                   </tr>
                               </thead>
                               <tbody>
                                   {parsedData.slice(0, 10).map((lead, index) => (
                                       <tr key={index} className="border-t">
                                           <td className="p-1">{lead.name}</td>
                                           <td className="p-1">{lead.email}</td>
                                           <td className="p-1">{formatDate(lead.event_date)}</td>
                                       </tr>
                                   ))}
                               </tbody>
                           </table>
                           {parsedData.length > 10 && <p className="text-center text-xs mt-2">...and {parsedData.length - 10} more.</p>}
                        </div>
                    </div>
                )}
                
                <div className="flex justify-end space-x-4 mt-6">
                    <button type="button" onClick={onClose} className="bg-gray-200 py-2 px-6 rounded-lg">Cancel</button>
                    <button type="button" onClick={handleSaveClick} disabled={parsedData.length === 0} className="bg-brand-green text-white font-bold py-2 px-6 rounded-lg disabled:bg-gray-400">
                        Import {parsedData.length > 0 && `${parsedData.length}`} Leads
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Other components are unchanged and included for completeness ---
const LeadTable = ({ leads, onEdit, onEmail, onDelete }) => ( <div className="bg-white p-4 rounded-lg shadow-lg overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="p-2">Name</th><th className="p-2">Status</th><th className="p-2">Event Date</th><th className="p-2">Contact Date</th><th className="p-2">Follow-up Date</th><th className="p-2">Source</th><th className="p-2">Actions</th></tr></thead><tbody>{leads.map(lead => (<tr key={lead.id} className="border-b hover:bg-gray-50"><td><p className="font-bold">{lead.name}</p><p className="text-gray-500 text-xs">{lead.email}</p></td><td>{lead.status}</td><td>{formatDate(lead.event_date)}</td><td>{formatDate(lead.contact_date)}</td><td>{formatDate(lead.follow_up_date)}</td><td>{lead.source}</td><td className="space-x-2"><button onClick={() => onEdit(lead)} className="text-blue-600">Edit</button><button onClick={() => onEmail(lead)} className="text-green-600">Email</button><button onClick={() => onDelete(lead.id)} className="text-red-600">Delete</button></td></tr>))}{leads.length === 0 && (<tr><td colSpan="7" className="text-center p-8 text-gray-500">No prospects found.</td></tr>)}</tbody></table></div> );
const ClientTable = ({ clients, onView, onEdit, onEmail }) => ( <div className="bg-white p-4 rounded-lg shadow-lg overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="p-2">Name</th><th className="p-2">Contact Date</th><th className="p-2">Source</th><th className="p-2">Actions</th></tr></thead><tbody>{clients.map(client => (<tr key={client.id} className="border-b hover:bg-gray-50"><td><p className="font-bold">{client.name}</p><p className="text-gray-500 text-xs">{client.email}</p>{client.booking_count > 1 && <span className="mt-1 inline-block bg-indigo-200 text-xs px-2 py-0.5 rounded-full">Returning Client</span>}</td><td>{formatDate(client.contact_date)}</td><td>{client.source}</td><td className="space-x-2"><button onClick={() => onView(client)} className="text-green-600 font-semibold">View Profile</button><button onClick={() => onEdit(client)} className="text-blue-600 font-semibold">Edit</button><button onClick={() => onEmail(client)} className="text-gray-600 font-semibold">Email</button></td></tr>))}{clients.length === 0 && (<tr><td colSpan="4" className="text-center p-8 text-gray-500">No clients found.</td></tr>)}</tbody></table></div> );
const LeadModal = ({ lead, onClose, onSave, onConvertToBooking }) => { const [leadData, setLeadData] = useState(lead || {}); const handleInputChange = (e) => { const { name, value } = e.target; setLeadData(prev => ({ ...prev, [name]: value })); }; const handleSubmit = (e) => { e.preventDefault(); const url = '/BoothPortal/api/leads.php'; const method = leadData.id ? 'PUT' : 'POST'; fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(leadData) }).then(res => res.json()).then(data => { if (data.success) { onSave(); onClose(); } else { throw new Error(data.error); } }).catch(err => alert(err.message)); }; return ( <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-xl relative"><button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">&times;</button><h3 className="text-2xl font-bold mb-6">{leadData.id ? 'Edit Lead' : 'Add New Lead'}</h3><form onSubmit={handleSubmit} className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block font-semibold">Name*</label><input type="text" name="name" value={leadData.name || ''} onChange={handleInputChange} required className="w-full p-2 border rounded" /></div><div><label className="block font-semibold">Email*</label><input type="email" name="email" value={leadData.email || ''} onChange={handleInputChange} required className="w-full p-2 border rounded" /></div><div><label className="block font-semibold">Phone</label><input type="tel" name="phone" value={leadData.phone || ''} onChange={handleInputChange} className="w-full p-2 border rounded" /></div><div><label className="block font-semibold">Event Date</label><input type="date" name="event_date" value={(leadData.event_date || '').split('T')[0]} onChange={handleInputChange} className="w-full p-2 border rounded" /></div><div><label className="block font-semibold">Status</label><select name="status" value={leadData.status || 'New'} onChange={handleInputChange} className="w-full p-2 border rounded"><option>New</option><option>Contacted</option><option>Proposal Sent</option><option>Won</option><option>Lost</option></select></div><div><label className="block font-semibold">Source</label><input type="text" name="source" value={leadData.source || ''} onChange={handleInputChange} className="w-full p-2 border rounded" /></div><div><label className="block font-semibold">Contact Date</label><input type="date" name="contact_date" value={(leadData.contact_date || '').split('T')[0]} onChange={handleInputChange} className="w-full p-2 border rounded" /></div><div><label className="block font-semibold">Follow-up Date</label><input type="date" name="follow_up_date" value={(leadData.follow_up_date || '').split('T')[0]} onChange={handleInputChange} className="w-full p-2 border rounded" /></div></div><div><label className="block font-semibold">Notes</label><textarea name="notes" value={leadData.notes || ''} onChange={handleInputChange} className="w-full p-2 border rounded h-24"></textarea></div><div className="flex justify-between items-center mt-6"><div>{leadData.status === 'Won' && (<button type="button" onClick={() => onConvertToBooking(leadData)} className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg">Convert to Booking...</button>)}</div><div className="flex justify-end space-x-4"><button type="button" onClick={onClose} className="bg-gray-200 py-2 px-6 rounded-lg">Cancel</button><button type="submit" className="bg-brand-green text-white font-bold py-2 px-6 rounded-lg">Save</button></div></div></form></div></div> ); };
const ClientModal = ({ client, onClose, onSave }) => { const [clientData, setClientData] = useState(client || {}); const handleSubmit = (e) => { e.preventDefault(); const url = '/BoothPortal/api/clients.php'; const method = clientData.id ? 'PUT' : 'POST'; fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(clientData) }).then(res => res.json()).then(data => { if (data.success) { onSave(); onClose(); } else { throw new Error(data.error); } }).catch(err => alert(err.message)); }; return ( <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-xl relative"><button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">&times;</button><h3 className="text-2xl font-bold mb-6">{clientData.id ? 'Edit Client' : 'Add New Client'}</h3><form onSubmit={handleSubmit} className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block font-semibold">Name*</label><input type="text" name="name" value={clientData.name || ''} onChange={(e) => setClientData({...clientData, name: e.target.value})} required className="w-full p-2 border rounded" /></div><div><label className="block font-semibold">Email*</label><input type="email" name="email" value={clientData.email || ''} onChange={(e) => setClientData({...clientData, email: e.target.value})} required className="w-full p-2 border rounded" /></div><div><label className="block font-semibold">Phone</label><input type="tel" name="phone" value={clientData.phone || ''} onChange={(e) => setClientData({...clientData, phone: e.target.value})} className="w-full p-2 border rounded" /></div><div><label className="block font-semibold">Source</label><input type="text" name="source" value={clientData.source || ''} onChange={(e) => setClientData({...clientData, source: e.target.value})} className="w-full p-2 border rounded" /></div><div><label className="block font-semibold">First Contact Date</label><input type="date" name="contact_date" value={(clientData.contact_date || '').split('T')[0]} onChange={(e) => setClientData({...clientData, contact_date: e.target.value})} className="w-full p-2 border rounded" /></div></div><div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={onClose} className="bg-gray-200 py-2 px-6 rounded-lg">Cancel</button><button type="submit" className="bg-brand-green text-white font-bold py-2 px-6 rounded-lg">Save Client</button></div></form></div></div> ); };
const BookingConversionModal = ({ lead, onClose, onSave, navigate }) => { const [bookingData, setBookingData] = useState({ event_type: 'Wedding', package: 'Standard', start_time: '', end_time: '', notes: lead.notes || '', event_code: '' }); const handleInputChange = (e) => { const { name, value } = e.target; setBookingData(prev => ({ ...prev, [name]: value })); }; const handleFinalizeConversion = (e) => { e.preventDefault(); fetch('/BoothPortal/api/leads.php?action=convert', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lead: lead, booking: bookingData }) }).then(res => res.json()).then(data => { if (data.success) { alert(`Booking #${data.bookingId} created and lead converted to client!`); onSave(); onClose(); navigate('/bookings'); } else { throw new Error(data.error); } }).catch(err => alert(err.message)); }; return ( <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-xl relative"><button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">&times;</button><h3 className="text-2xl font-bold mb-2">Create Booking for {lead.name}</h3><p className="text-sm text-gray-500 mb-6">Finalize the event details for this new client.</p><form onSubmit={handleFinalizeConversion} className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block font-semibold">Event Type*</label><select name="event_type" value={bookingData.event_type} onChange={handleInputChange} required className="w-full p-2 border rounded"><option>Wedding</option><option>Corporate</option><option>Birthday Party</option><option>Other</option></select></div><div><label className="block font-semibold">Package</label><select name="package" value={bookingData.package} onChange={handleInputChange} className="w-full p-2 border rounded"><option>Standard</option><option>Premium</option><option>Deluxe</option><option>Custom</option></select></div><div className="md:col-span-2"><label className="block font-semibold">Event Code</label><input type="text" name="event_code" value={bookingData.event_code || ''} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="e.g., SMITHWED2025" /></div></div><div><label className="block font-semibold">Event Start Time*</label><input type="datetime-local" name="start_time" value={bookingData.start_time} onChange={handleInputChange} required className="w-full p-2 border rounded" /></div><div><label className="block font-semibold">Event End Time*</label><input type="datetime-local" name="end_time" value={bookingData.end_time} onChange={handleInputChange} required className="w-full p-2 border rounded" /></div><div><label className="block font-semibold">Notes</label><textarea name="notes" value={bookingData.notes} onChange={handleInputChange} className="w-full p-2 border rounded h-24"></textarea></div><div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={onClose} className="bg-gray-200 py-2 px-6 rounded-lg">Cancel</button><button type="submit" className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg">Save Booking & Convert</button></div></form></div></div> ); };
const ClientProfileModal = ({ lead, onClose, navigate, onViewPhotos }) => { const [profile, setProfile] = useState(null); const [bookings, setBookings] = useState([]); const [isLoading, setIsLoading] = useState(true); const [error, setError] = useState(null); useEffect(() => { if (lead?.email) { setIsLoading(true); setError(null); fetch(`/BoothPortal/api/client_profile.php?email=${lead.email}`).then(res => { if (!res.ok) throw new Error('Failed to fetch profile.'); return res.json(); }).then(data => { if (data.error) throw new Error(data.error); setProfile(data.profile); setBookings(data.bookings); }).catch(err => setError(err.message)).finally(() => setIsLoading(false)); } }, [lead]); const addBookingForClient = () => { onClose(); navigate('/bookings', { state: { prefillData: { client_name: profile.name, client_email: profile.email, client_phone: profile.phone } } }); }; return ( <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl relative"><button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">&times;</button><h3 className="text-2xl font-bold mb-6">Client Profile</h3>{isLoading ? <p>Loading profile...</p> : error ? <p className="text-red-500">Error: {error}</p> : profile ? (<div><div className="mb-6 border-b pb-4"><p className="text-xl font-bold">{profile.name}</p><p className="text-gray-600">{profile.email}</p><p className="text-gray-600">{profile.phone}</p></div><h4 className="font-bold mb-2">Booking History</h4><div className="space-y-3 max-h-60 overflow-y-auto pr-2">{bookings.length > 0 ? bookings.map(b => (<div key={b.id} className="p-3 bg-gray-100 rounded text-sm flex justify-between items-center"><div><p><strong>Event:</strong> {b.event_type} ({b.status})</p><p><strong>Date:</strong> {formatDate(b.start_time)}</p>{b.event_code && <p className="text-xs text-gray-500 mt-1">Code: {b.event_code}</p>}</div>{b.event_code && (<button onClick={() => onViewPhotos(b.event_code)} className="bg-gray-600 text-white text-xs font-bold py-1 px-3 rounded-lg hover:bg-gray-700 transition-colors">View Photos</button>)}</div>)) : <p>No bookings found.</p>}</div><div className="flex justify-between items-center mt-8"><button type="button" onClick={addBookingForClient} className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg">Add Booking for this Client</button><button type="button" onClick={onClose} className="bg-gray-200 py-2 px-6 rounded-lg">Close</button></div></div>) : <p>Could not load profile.</p>}</div></div> ); };
const PhotoGalleryModal = ({ event_code, onClose }) => { const [photos, setPhotos] = useState([]); const [isLoading, setIsLoading] = useState(true); const [error, setError] = useState(null); useEffect(() => { if (event_code) { setIsLoading(true); setError(null); fetch(`/BoothPortal/api/photos.php?event_code=${event_code}`).then(res => { if (!res.ok) throw new Error('Network response was not ok'); return res.json(); }).then(data => { if (data.error) throw new Error(data.error); setPhotos(data); }).catch(err => setError(err.message)).finally(() => setIsLoading(false)); } }, [event_code]); return ( <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col relative"><button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl z-10">&times;</button><h3 className="text-2xl font-bold mb-4">Photo Gallery for {event_code}</h3><div className="flex-grow overflow-y-auto pr-2">{isLoading ? <p className="text-center pt-10">Loading photos...</p> : error ? <p className="text-red-500 text-center pt-10">Error: {error}</p> : photos.length > 0 ? (<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{photos.map(photo => (<a key={photo.id} href={photo.borderless_photo_path} target="_blank" rel="noopener noreferrer" className="block group"><img src={photo.borderless_photo_path} alt={photo.base_filename} className="w-full h-auto object-cover rounded-lg shadow-md group-hover:opacity-80 transition-opacity" loading="lazy"/></a>))}</div>) : <p className="text-center pt-10">No photos found for this event code.</p>}</div></div></div> ); };

export default SalesLeads;