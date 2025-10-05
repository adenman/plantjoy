import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const eventTypes = ["Wedding", "Corporate", "Birthday Party", "Private Event", "Other", "Converted Lead"];
const packageTypes = ["Standard", "Premium", "Deluxe", "Custom"];
const statusTypes = ["Lead", "Quote Sent", "Confirmed", "Completed", "Cancelled"];

const statusColors = {
    'Confirmed': '#28a745',
    'Completed': '#17a2b8',
    'Lead': '#ffc107',
    'Quote Sent': '#fd7e14',
    'Cancelled': '#dc3545'
};

const Bookings = () => {
    const [activeTab, setActiveTab] = useState('list');
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);

    const [newEvent, setNewEvent] = useState({
        client_name: '', client_email: '', client_phone: '',
        package: packageTypes[0], start_time: '', end_time: '',
        event_type: eventTypes[0], notes: ''
    });

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.prefillData) {
            setNewEvent(prev => ({
                ...prev,
                ...location.state.prefillData
            }));
            setActiveTab('manager');
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    const formatDate = (dateString) => {
        if (!dateString) return { date: 'N/A', time: '' };
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return { date: 'Invalid Date', time: '' };
        return {
            date: date.toLocaleDateString('en-US'),
            time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        };
    };

    const toDatetimeLocal = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "";
        const ten = (i) => (i < 10 ? '0' : '') + i;
        const YYYY = date.getFullYear();
        const MM = ten(date.getMonth() + 1);
        const DD = ten(date.getDate());
        const HH = ten(date.getHours());
        const mm = ten(date.getMinutes());
        return `${YYYY}-${MM}-${DD}T${HH}:${mm}`;
    };

    const fetchBookings = () => {
        setIsLoading(true);
        fetch('/BoothPortal/api/bookings.php')
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setBookings(data);
            })
            .catch(err => setError(err.message))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => { fetchBookings(); }, []);

    const handleInputChange = (e, setState) => {
        const { name, value } = e.target;
        setState(prev => ({ ...prev, [name]: value }));
    };

    const handleAddEvent = (e) => {
        e.preventDefault();
        fetch('/BoothPortal/api/bookings.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEvent)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('Booking added successfully!');
                setNewEvent({ client_name: '', client_email: '', client_phone: '', package: packageTypes[0], start_time: '', end_time: '', event_type: eventTypes[0], notes: '' });
                fetchBookings();
                setActiveTab('list');
            } else {
                throw new Error(data.error || 'Failed to add event.');
            }
        })
        .catch(err => alert(err.message));
    };

    const handleEditEvent = (e) => {
        e.preventDefault();
        fetch('/BoothPortal/api/bookings.php', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editingBooking)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('Booking updated successfully!');
                setIsEditModalOpen(false);
                fetchBookings();
            } else {
                throw new Error(data.error || 'Failed to update booking.');
            }
        })
        .catch(err => alert(err.message));
    };
    
    const handleDeleteBooking = (bookingId) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            fetch(`/BoothPortal/api/bookings.php?id=${bookingId}`, { method: 'DELETE' })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        fetchBookings();
                    } else {
                        throw new Error(data.error);
                    }
                })
                .catch(err => alert(err.message));
        }
    };

    const openEditModal = (booking) => {
        setEditingBooking({
            ...booking,
            start_time: toDatetimeLocal(booking.start_time),
            end_time: toDatetimeLocal(booking.end_time),
        });
        setIsEditModalOpen(true);
    };

    const renderBookingList = () => {
        if (isLoading) return <p>Loading bookings...</p>;
        if (error) return <p className="text-red-500">Error: {error}</p>;
        if (bookings.length === 0) return <p>No bookings found.</p>;

        return (
            <div className="bg-white p-4 rounded-lg shadow-lg overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2">Event</th>
                            <th className="p-2">Client</th>
                            <th className="p-2">Start</th>
                            <th className="p-2">End</th>
                            <th className="p-2">Package</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(booking => {
                            const start = formatDate(booking.start_time);
                            const end = formatDate(booking.end_time);
                            return (
                                <tr key={booking.id} className="border-b hover:bg-gray-50">
                                    <td className="p-2 font-bold">{booking.event_type}</td>
                                    <td className="p-2">
                                        <p>{booking.client_name}</p>
                                        <p className="text-gray-500">{booking.client_email}</p>
                                    </td>
                                    <td className="p-2"><div>{start.date}</div><div className="text-gray-500 text-xs">{start.time}</div></td>
                                    <td className="p-2"><div>{end.date}</div><div className="text-gray-500 text-xs">{end.time}</div></td>
                                    <td className="p-2">{booking.package}</td>
                                    <td className="p-2">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full`} style={{ backgroundColor: (statusColors[booking.status] || '#808080') + '33', color: statusColors[booking.status] || '#808080' }}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="p-2 space-x-2">
                                        <button onClick={() => openEditModal(booking)} className="text-blue-600 font-semibold">Edit</button>
                                        <button onClick={() => handleDeleteBooking(booking.id)} className="text-red-600 font-semibold">Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderCalendar = () => {
        const calendarEvents = bookings.map(b => ({
            title: `${b.event_type} - ${b.client_name}`,
            start: b.start_time,
            end: b.end_time,
            backgroundColor: statusColors[b.status] || '#777',
            borderColor: statusColors[b.status] || '#777'
        }));

        return (
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    weekends={true}
                    events={calendarEvents}
                />
            </div>
        );
    };

    const renderAddForm = () => (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-6">Add New Booking</h3>
            <form onSubmit={handleAddEvent} className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-semibold">Client Name*</label>
                        <input type="text" name="client_name" value={newEvent.client_name} onChange={(e) => handleInputChange(e, setNewEvent)} required className="w-full border rounded p-2" />
                    </div>
                     <div>
                        <label className="block font-semibold">Client Email</label>
                        <input type="email" name="client_email" value={newEvent.client_email} onChange={(e) => handleInputChange(e, setNewEvent)} className="w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block font-semibold">Client Phone</label>
                        <input type="tel" name="client_phone" value={newEvent.client_phone} onChange={(e) => handleInputChange(e, setNewEvent)} className="w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block font-semibold">Event Type*</label>
                        <select name="event_type" value={newEvent.event_type} onChange={(e) => handleInputChange(e, setNewEvent)} required className="w-full border rounded p-2">
                            {eventTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block font-semibold">Package</label>
                        <select name="package" value={newEvent.package} onChange={(e) => handleInputChange(e, setNewEvent)} className="w-full border rounded p-2">
                             {packageTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                </div>
                 <div>
                    <label className="block font-semibold">Event Start Time*</label>
                    <input type="datetime-local" name="start_time" value={newEvent.start_time} onChange={(e) => handleInputChange(e, setNewEvent)} required className="w-full border rounded p-2" />
                </div>
                 <div>
                    <label className="block font-semibold">Event End Time*</label>
                    <input type="datetime-local" name="end_time" value={newEvent.end_time} onChange={(e) => handleInputChange(e, setNewEvent)} required className="w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block font-semibold">Notes</label>
                    <textarea name="notes" value={newEvent.notes} onChange={(e) => handleInputChange(e, setNewEvent)} className="w-full border rounded p-2 h-24"></textarea>
                </div>
                <button type="submit" className="w-full bg-brand-green text-white font-bold py-3 rounded-lg hover:bg-opacity-90">
                    Add Booking
                </button>
            </form>
        </div>
    );

    return (
        <section className="py-12 bg-gray-50 min-h-[80vh]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">Bookings Dashboard</h2>
                <div className="flex justify-center border-b mb-8">
                    <button onClick={() => setActiveTab('list')} className={`px-6 py-3 font-semibold ${activeTab === 'list' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Bookings List</button>
                    <button onClick={() => setActiveTab('calendar')} className={`px-6 py-3 font-semibold ${activeTab === 'calendar' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Calendar</button>
                    <button onClick={() => setActiveTab('manager')} className={`px-6 py-3 font-semibold ${activeTab === 'manager' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Add Booking</button>
                </div>
                <div>
                    {activeTab === 'list' && renderBookingList()}
                    {activeTab === 'calendar' && renderCalendar()}
                    {activeTab === 'manager' && renderAddForm()}
                </div>
            </div>

            {isEditModalOpen && editingBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-xl">
                        <h3 className="text-2xl font-bold mb-6">Edit Booking</h3>
                        <form onSubmit={handleEditEvent} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-semibold">Client Name*</label>
                                    <input type="text" name="client_name" value={editingBooking.client_name} onChange={(e) => handleInputChange(e, setEditingBooking)} required className="w-full border rounded p-2" />
                                </div>
                                <div>
                                    <label className="block font-semibold">Client Email</label>
                                    <input type="email" name="client_email" value={editingBooking.client_email} onChange={(e) => handleInputChange(e, setEditingBooking)} className="w-full border rounded p-2" />
                                </div>
                                <div>
                                    <label className="block font-semibold">Client Phone</label>
                                    <input type="tel" name="client_phone" value={editingBooking.client_phone} onChange={(e) => handleInputChange(e, setEditingBooking)} className="w-full border rounded p-2" />
                                </div>
                                <div>
                                    <label className="block font-semibold">Event Type*</label>
                                    <select name="event_type" value={editingBooking.event_type} onChange={(e) => handleInputChange(e, setEditingBooking)} required className="w-full border rounded p-2">
                                        {eventTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-semibold">Package</label>
                                    <select name="package" value={editingBooking.package} onChange={(e) => handleInputChange(e, setEditingBooking)} className="w-full border rounded p-2">
                                        {packageTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-semibold">Status</label>
                                    <select name="status" value={editingBooking.status} onChange={(e) => handleInputChange(e, setEditingBooking)} className="w-full border rounded p-2">
                                        {statusTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block font-semibold">Event Start Time*</label>
                                <input type="datetime-local" name="start_time" value={editingBooking.start_time} onChange={(e) => handleInputChange(e, setEditingBooking)} required className="w-full border rounded p-2" />
                            </div>
                            <div>
                                <label className="block font-semibold">Event End Time*</label>
                                <input type="datetime-local" name="end_time" value={editingBooking.end_time} onChange={(e) => handleInputChange(e, setEditingBooking)} required className="w-full border rounded p-2" />
                            </div>
                            <div>
                                <label className="block font-semibold">Notes</label>
                                <textarea name="notes" value={editingBooking.notes} onChange={(e) => handleInputChange(e, setEditingBooking)} className="w-full border rounded p-2 h-24"></textarea>
                            </div>
                            <div className="flex justify-end space-x-4 mt-6">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="bg-gray-200 py-2 px-6 rounded-lg">Cancel</button>
                                <button type="submit" className="bg-brand-green text-white font-bold py-2 px-6 rounded-lg">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Bookings;