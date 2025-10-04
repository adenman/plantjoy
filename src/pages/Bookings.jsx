import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const Bookings = () => {
    const [activeTab, setActiveTab] = useState('list');
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form state for adding new events, matching your table structure
    const [newEvent, setNewEvent] = useState({
        client_name: '',
        client_email: '',
        client_phone: '',
        venue: '',
        package: '',
        start_time: '',
        end_time: '',
        event_type: '',
        notes: ''
    });

    const fetchBookings = () => {
        setIsLoading(true);
        fetch('/plantjoy/api/bookings.php')
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                setBookings(data);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setIsLoading(false);
            });
    };

    // Fetch bookings on component mount
    useEffect(() => {
        fetchBookings();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent(prev => ({ ...prev, [name]: value }));
    };

    const handleAddEvent = (e) => {
        e.preventDefault();
        fetch('/plantjoy/api/bookings.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEvent)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('Event added successfully!');
                setNewEvent({ client_name: '', client_email: '', client_phone: '', venue: '', package: '', start_time: '', end_time: '', event_type: '', notes: '' }); // Reset form
                fetchBookings(); // Refresh the bookings list
                setActiveTab('list'); // Switch back to the list view
            } else {
                throw new Error(data.error || 'Failed to add event.');
            }
        })
        .catch(err => alert(err.message));
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
                            <th className="p-2">Venue</th>
                            <th className="p-2">Start</th>
                            <th className="p-2">End</th>
                            <th className="p-2">Package</th>
                            <th className="p-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(booking => (
                            <tr key={booking.id} className="border-b hover:bg-gray-50">
                                <td className="p-2 font-bold">{booking.event_type}</td>
                                <td className="p-2">
                                    <p>{booking.client_name}</p>
                                    <p className="text-gray-500">{booking.client_email}</p>
                                </td>
                                <td className="p-2">{booking.venue}</td>
                                <td className="p-2">{new Date(booking.start_time).toLocaleString()}</td>
                                <td className="p-2">{new Date(booking.end_time).toLocaleString()}</td>
                                <td className="p-2">{booking.package}</td>
                                <td className="p-2">
                                    <span className="bg-green-200 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                                        {booking.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderCalendar = () => {
        const calendarEvents = bookings.map(b => ({
            title: `${b.event_type} - ${b.client_name}`,
            start: b.start_time,
            end: b.end_time
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

    const renderEventManager = () => (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-6">Add New Booking</h3>
            <form onSubmit={handleAddEvent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-semibold">Client Name*</label>
                        <input type="text" name="client_name" value={newEvent.client_name} onChange={handleInputChange} required className="w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block font-semibold">Event Type*</label>
                        <input type="text" name="event_type" value={newEvent.event_type} onChange={handleInputChange} required className="w-full border rounded p-2" placeholder='e.g., Wedding, Corporate' />
                    </div>
                     <div>
                        <label className="block font-semibold">Client Email</label>
                        <input type="email" name="client_email" value={newEvent.client_email} onChange={handleInputChange} className="w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block font-semibold">Client Phone</label>
                        <input type="tel" name="client_phone" value={newEvent.client_phone} onChange={handleInputChange} className="w-full border rounded p-2" />
                    </div>
                     <div>
                        <label className="block font-semibold">Venue</label>
                        <input type="text" name="venue" value={newEvent.venue} onChange={handleInputChange} className="w-full border rounded p-2" />
                    </div>
                     <div>
                        <label className="block font-semibold">Package</label>
                        <input type="text" name="package" value={newEvent.package} onChange={handleInputChange} className="w-full border rounded p-2" />
                    </div>
                </div>
                 <div>
                    <label className="block font-semibold">Event Start Time*</label>
                    <input type="datetime-local" name="start_time" value={newEvent.start_time} onChange={handleInputChange} required className="w-full border rounded p-2" />
                </div>
                 <div>
                    <label className="block font-semibold">Event End Time*</label>
                    <input type="datetime-local" name="end_time" value={newEvent.end_time} onChange={handleInputChange} required className="w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block font-semibold">Notes</label>
                    <textarea name="notes" value={newEvent.notes} onChange={handleInputChange} className="w-full border rounded p-2 h-24"></textarea>
                </div>
                <button type="submit" className="w-full bg-brand-green text-white font-bold py-3 rounded-lg hover:bg-opacity-90">
                    Add Booking
                </button>
            </form>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'list': return renderBookingList();
            case 'calendar': return renderCalendar();
            case 'manager': return renderEventManager();
            default: return null;
        }
    };

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
                    {renderContent()}
                </div>
            </div>
        </section>
    );
};

export default Bookings;