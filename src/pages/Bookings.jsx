import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - timezoneOffset);
    return localDate.toISOString().slice(0, 16);
};

const formatDateForDisplay = (dateString) => {
    if (!dateString) return { date: 'N/A', time: '' };
    const date = new Date(dateString);
    return {
        date: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    };
};

// This is the modal for Adding/Editing a booking
const BookingModal = ({ booking, onClose, onSave, onDelete }) => {
    const [bookingData, setBookingData] = useState(
        booking 
        ? { ...booking, start_time: formatDateForInput(booking.start_time), end_time: formatDateForInput(booking.end_time) }
        : { status: 'Confirmed', event_type: 'Wedding', package: 'Standard' }
    );

    useEffect(() => {
        if (!booking && window.history.state?.usr?.prefillData) {
            setBookingData(prev => ({ ...prev, ...window.history.state.usr.prefillData }));
        }
    }, [booking]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookingData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(bookingData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                <h3 className="text-2xl font-bold mb-6">{bookingData.id ? 'Edit Booking' : 'Add New Booking'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block font-semibold">Client Name*</label><input type="text" name="client_name" value={bookingData.client_name || ''} onChange={handleInputChange} required className="w-full p-2 border rounded" /></div>
                        <div><label className="block font-semibold">Client Email</label><input type="email" name="client_email" value={bookingData.client_email || ''} onChange={handleInputChange} className="w-full p-2 border rounded" /></div>
                        <div><label className="block font-semibold">Client Phone</label><input type="tel" name="client_phone" value={bookingData.client_phone || ''} onChange={handleInputChange} className="w-full p-2 border rounded" /></div>
                        <div>
                            <label className="block font-semibold">Event Type*</label>
                            <select name="event_type" value={bookingData.event_type || 'Wedding'} onChange={handleInputChange} required className="w-full p-2 border rounded">
                                <option>Wedding</option><option>Corporate</option><option>Birthday Party</option><option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-semibold">Package</label>
                            <select name="package" value={bookingData.package || 'Standard'} onChange={handleInputChange} className="w-full p-2 border rounded">
                                <option>Standard</option><option>Premium</option><option>Deluxe</option><option>Custom</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-semibold">Event Code</label>
                            <input type="text" name="event_code" value={bookingData.event_code || ''} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="e.g., SMITHWED2025" />
                        </div>
                    </div>
                    <div><label className="block font-semibold">Event Start Time*</label><input type="datetime-local" name="start_time" value={bookingData.start_time || ''} onChange={handleInputChange} required className="w-full p-2 border rounded" /></div>
                    <div><label className="block font-semibold">Event End Time*</label><input type="datetime-local" name="end_time" value={bookingData.end_time || ''} onChange={handleInputChange} required className="w-full p-2 border rounded" /></div>
                    <div><label className="block font-semibold">Notes</label><textarea name="notes" value={bookingData.notes || ''} onChange={handleInputChange} className="w-full p-2 border rounded h-24"></textarea></div>
                    <div className="flex justify-between items-center mt-6">
                        <div>
                            {bookingData.id && (
                                <button type="button" onClick={() => onDelete(bookingData.id)} className="text-red-600 hover:text-red-800 font-semibold">
                                    Delete Booking
                                </button>
                            )}
                        </div>
                        <div className="flex space-x-4">
                            <button type="button" onClick={onClose} className="bg-gray-200 py-2 px-6 rounded-lg">Cancel</button>
                            <button type="submit" className="bg-brand-green text-white font-bold py-2 px-6 rounded-lg">Save Booking</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

const BookingDetailModal = ({ booking, onClose }) => {
    const [photos, setPhotos] = useState([]);
    const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (booking?.event_code) {
            setIsLoadingPhotos(true);
            setError(null);
            fetch(`/BoothPortal/api/photos.php?event_code=${booking.event_code}`)
                .then(res => res.json())
                .then(data => {
                    if (data.error) throw new Error(data.error);
                    setPhotos(data);
                })
                .catch(err => setError(err.message))
                .finally(() => setIsLoadingPhotos(false));
        } else {
            setIsLoadingPhotos(false);
        }
    }, [booking]);

    if (!booking) return null;

    const { date: startDate, time: startTime } = formatDateForDisplay(booking.start_time);
    const { time: endTime } = formatDateForDisplay(booking.end_time);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl h-[90vh] flex flex-col relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl z-10">&times;</button>
                <div className="flex-grow overflow-y-auto pr-4">
                    <h3 className="text-2xl font-bold mb-6 text-center border-b pb-4">Event Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h4 className="font-bold text-lg mb-2">Client Information</h4>
                            <p><strong>Name:</strong> {booking.client_name}</p>
                            <p><strong>Email:</strong> {booking.client_email || 'N/A'}</p>
                            <p><strong>Phone:</strong> {booking.client_phone || 'N/A'}</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-2">Event Information</h4>
                            <p><strong>Date:</strong> {startDate}</p>
                            <p><strong>Time:</strong> {startTime} - {endTime}</p>
                            <p><strong>Package:</strong> {booking.package}</p>
                            {booking.event_code && <p><strong>Code:</strong> <span className="font-mono bg-gray-200 px-2 py-1 rounded">{booking.event_code}</span></p>}
                        </div>
                    </div>

                    <h4 className="font-bold text-lg mb-2 pt-4 border-t">Event Photo Library</h4>
                    {booking.event_code ? (
                        <div>
                            {isLoadingPhotos ? <p>Loading photos...</p> 
                             : error ? <p className="text-red-500">Error: {error}</p>
                             : photos.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-gray-100 p-4 rounded-lg">
                                    {photos.map(photo => (
                                        <a key={photo.id} href={photo.borderless_photo_path} target="_blank" rel="noopener noreferrer" className="block group">
                                            <img 
                                                src={photo.borderless_photo_path} 
                                                alt={photo.base_filename} 
                                                className="w-full h-auto object-cover rounded-lg shadow-md group-hover:opacity-80 transition-opacity" 
                                                loading="lazy"
                                            />
                                        </a>
                                    ))}
                                </div>
                            ) : <p className="text-center text-gray-500 py-4">No photos found for this event code.</p>}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-4">No event code assigned to this booking.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const BookingCard = ({ booking, onEdit, onViewDetails }) => {
    const { date, time } = formatDateForDisplay(booking.start_time);
    const packageType = booking.package?.toLowerCase();
    
    let borderColor = 'border-blue-500'; // Default
    if (packageType === 'premium') borderColor = 'border-purple-500';
    if (packageType === 'deluxe') borderColor = 'border-yellow-500';

    return (
        <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${borderColor} flex justify-between items-center`}>
            <div>
                <p className="text-sm text-gray-500">{date}</p>
                <h3 className="text-xl font-bold text-gray-800">{booking.client_name}</h3>
                <p className="text-gray-600">{booking.event_type} - {time}</p>
                <div className="mt-2">
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                        {booking.package} Package
                    </span>
                </div>
            </div>
            <div className="flex flex-col space-y-2">
                 <button onClick={() => onViewDetails(booking)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-sm">
                    View Details
                </button>
                <button onClick={() => onEdit(booking)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg text-sm">
                    Edit
                </button>
            </div>
        </div>
    );
};

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const location = useLocation();

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
    
    useEffect(() => { if (location.state?.prefillData) { openEditModal(); } }, [location.state]);

    const openEditModal = (booking = null) => {
        const initialData = booking || location.state?.prefillData || null;
        setSelectedBooking(initialData);
        setIsEditModalOpen(true);
    };

    const openDetailModal = (booking) => {
        setSelectedBooking(booking);
        setIsDetailModalOpen(true);
    };
    
    const closeModal = () => {
        setSelectedBooking(null);
        setIsEditModalOpen(false);
        setIsDetailModalOpen(false);
        if (location.state?.prefillData) {
            window.history.replaceState({}, document.title);
        }
    };

    const handleSaveBooking = (bookingData) => {
        const url = '/BoothPortal/api/bookings.php';
        const method = bookingData.id ? 'PUT' : 'POST';
        fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bookingData) })
            .then(res => res.json())
            .then(data => { if (data.success) { fetchBookings(); closeModal(); } else { throw new Error(data.error); } })
            .catch(err => alert(err.message));
    };
    
    const handleDeleteBooking = (bookingId) => {
        if (window.confirm('Are you sure you want to permanently delete this booking?')) {
            fetch(`/BoothPortal/api/bookings.php?id=${bookingId}`, { method: 'DELETE' })
                .then(res => res.json())
                .then(data => { if (data.success) { fetchBookings(); closeModal(); } else { throw new Error(data.error); } })
                .catch(err => alert(err.message));
        }
    };

    const upcomingBookings = bookings.filter(b => new Date(b.start_time) >= new Date()).sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
    const pastBookings = bookings.filter(b => new Date(b.start_time) < new Date()).sort((a, b) => new Date(b.start_time) - new Date(a.start_time));

    if (isLoading) return <div className="p-8 text-center">Loading bookings...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Bookings</h1>
                <button onClick={() => openEditModal()} className="bg-brand-green text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90">
                    + Add New Booking
                </button>
            </div>

            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Upcoming Bookings</h2>
                    <div className="space-y-4">
                        {upcomingBookings.length > 0 ? (
                            upcomingBookings.map(booking => <BookingCard key={booking.id} booking={booking} onEdit={openEditModal} onViewDetails={openDetailModal} />)
                        ) : (
                            <p className="text-center text-gray-500 py-8">No upcoming bookings.</p>
                        )}
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Past Bookings</h2>
                    <div className="space-y-4">
                        {pastBookings.length > 0 ? (
                            pastBookings.map(booking => <BookingCard key={booking.id} booking={booking} onEdit={openEditModal} onViewDetails={openDetailModal} />)
                        ) : (
                            <p className="text-center text-gray-500 py-8">No past bookings.</p>
                        )}
                    </div>
                </div>
            </div>

            {isEditModalOpen && <BookingModal booking={selectedBooking} onClose={closeModal} onSave={handleSaveBooking} onDelete={handleDeleteBooking} />}
            {isDetailModalOpen && <BookingDetailModal booking={selectedBooking} onClose={closeModal} />}
        </div>
    );
};

export default Bookings;