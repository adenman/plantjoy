import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useNavigate } from 'react-router-dom';

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

const formatDate = (dateString) => {
    if (!dateString || dateString.startsWith('0000-00-00')) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString('en-US');
};

const TaskColumn = ({ title, tasks, onTaskClick }) => (
    <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="font-bold mb-4 text-center">{title} ({tasks.length})</h4>
        <div className="space-y-3 min-h-[100px]">
            {tasks.map(task => (
                <div key={task.id} onClick={() => onTaskClick(task)} className="bg-gray-50 p-3 rounded-md border cursor-pointer hover:shadow-lg transition-shadow">
                    <p className="font-semibold">{task.task_name}</p>
                    <p className="text-xs text-gray-500">Due: {formatDate(task.date_to_complete)}</p>
                    <p className="text-xs text-gray-400 mt-1">Assigned by: {task.assigned_by_name}</p>
                </div>
            ))}
        </div>
    </div>
);

const Home = () => {
    const [analytics, setAnalytics] = useState({ totalActiveLeads: 0, newLeadsThisMonth: 0, conversionRate: 0 });
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]); // State for bookings
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchData = () => {
        setIsLoading(true);
        Promise.all([
            fetch('/BoothPortal/api/analytics.php').then(res => res.json()),
            fetch('/BoothPortal/api/tasks.php').then(res => res.json()),
            fetch('/BoothPortal/api/users.php').then(res => res.json()),
            fetch('/BoothPortal/api/bookings.php').then(res => res.json()) // Fetch bookings data
        ]).then(([analyticsData, tasksData, usersData, bookingsData]) => {
            if (analyticsData.error) throw new Error(analyticsData.error);
            if (tasksData.error) throw new Error(tasksData.error);
            if (usersData.error) throw new Error(usersData.error);
            if (bookingsData.error) throw new Error(bookingsData.error);
            setAnalytics(analyticsData);
            setTasks(tasksData);
            setUsers(usersData);
            setBookings(bookingsData); // Set bookings data
        }).catch(err => setError(err.message))
        .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openModal = (task = null) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleSaveTask = (taskData) => {
        const url = '/BoothPortal/api/tasks.php';
        const method = taskData.id ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                fetchData();
                setIsModalOpen(false);
            } else {
                throw new Error(data.error);
            }
        })
        .catch(err => alert(err.message));
    };
    
    const myTasks = user ? tasks.filter(t => t.assigned_to_id === user.id) : [];
    
    const calendarEvents = bookings.map(b => ({
        id: b.id,
        title: `${b.client_name} - ${b.event_type}`,
        start: b.start_time,
        end: b.end_time,
    }));

    if (isLoading) return <div className="p-8 text-center">Loading dashboard...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}!</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Analytics and Tasks */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Sales Analytics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <AnalyticsCard title="Active Leads" value={analytics.totalActiveLeads} icon={'🔥'} />
                            <AnalyticsCard title="New This Month" value={analytics.newLeadsThisMonth} icon={'🎉'} />
                            <AnalyticsCard title="Conversion Rate" value={`${analytics.conversionRate}%`} icon={'🎯'} />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">My Tasks</h2>
                            <button onClick={() => openModal()} className="bg-brand-green text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90">
                                + Add Task
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <TaskColumn title="Pending" tasks={myTasks.filter(t => t.status === 'Pending')} onTaskClick={openModal} />
                            <TaskColumn title="In Progress" tasks={myTasks.filter(t => t.status === 'In Progress')} onTaskClick={openModal} />
                            <TaskColumn title="Completed" tasks={myTasks.filter(t => t.status === 'Completed')} onTaskClick={openModal} />
                        </div>
                    </div>
                </div>

                {/* Right Column: Calendar */}
                <div className="lg:col-span-1">
                    <h2 className="text-2xl font-semibold mb-4">Event Calendar</h2>
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                         <FullCalendar
                            plugins={[dayGridPlugin]}
                            initialView="dayGridMonth"
                            events={calendarEvents}
                            eventClick={() => navigate('/bookings')} // Navigate to bookings page on click
                            height="auto" // Adjust height to fit container
                            headerToolbar={{
                                left: 'prev',
                                center: 'title',
                                right: 'next'
                            }}
                        />
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <TaskModal 
                    task={editingTask}
                    users={users}
                    currentUser={user}
                    onClose={() => setIsModalOpen(false)} 
                    onSave={handleSaveTask} 
                />
            )}
        </div>
    );
};

const TaskModal = ({ task, users, currentUser, onClose, onSave }) => {
    const [taskData, setTaskData] = useState(
        task 
        ? { ...task, assigned_to: task.assigned_to_id } 
        : { assigned_to: currentUser.id, status: 'Pending' }
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTaskData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(taskData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                <h3 className="text-2xl font-bold mb-6">{task ? 'Edit Task' : 'Add New Task'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-semibold">Task Name*</label>
                        <input type="text" name="task_name" value={taskData.task_name || ''} onChange={handleInputChange} required className="w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block font-semibold">Assign To*</label>
                        <select name="assigned_to" value={taskData.assigned_to || ''} onChange={handleInputChange} required className="w-full border rounded p-2">
                            {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block font-semibold">Date to Complete</label>
                        <input type="date" name="date_to_complete" value={(taskData.date_to_complete || '').split('T')[0]} onChange={handleInputChange} className="w-full border rounded p-2" />
                    </div>
                    {task && (
                         <div>
                            <label className="block font-semibold">Status</label>
                            <select name="status" value={taskData.status || 'Pending'} onChange={handleInputChange} className="w-full border rounded p-2">
                                <option>Pending</option>
                                <option>In Progress</option>
                                <option>Completed</option>
                            </select>
                        </div>
                    )}
                    <div>
                        <label className="block font-semibold">Notes</label>
                        <textarea name="notes" value={taskData.notes || ''} onChange={handleInputChange} className="w-full border rounded p-2 h-24"></textarea>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 py-2 px-6 rounded-lg">Cancel</button>
                        <button type="submit" className="bg-brand-green text-white font-bold py-2 px-6 rounded-lg">Save Task</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Home;