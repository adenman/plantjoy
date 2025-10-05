import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const formatDate = (dateString) => {
    if (!dateString || dateString.startsWith('0000-00-00')) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString('en-US');
};

const TaskBoard = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const fetchData = () => {
        setIsLoading(true);
        Promise.all([
            fetch('/BoothPortal/api/tasks.php').then(res => res.json()),
            fetch('/BoothPortal/api/users.php').then(res => res.json())
        ]).then(([tasksData, usersData]) => {
            if (tasksData.error) throw new Error(tasksData.error);
            if (usersData.error) throw new Error(usersData.error);
            setTasks(tasksData);
            setUsers(usersData);
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
    
    const tasksByUser = users.map(u => ({
        ...u,
        tasks: tasks.filter(t => t.assigned_to_id === u.id)
    }));

    if (isLoading) return <p className="text-center p-12">Loading task board...</p>;
    if (error) return <p className="text-center p-12 text-red-500">Error: {error}</p>;

    return (
        <section className="py-12 bg-gray-50 min-h-[80vh]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Task Board</h2>
                    <button onClick={() => openModal()} className="bg-brand-green text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90">
                        + Add Task
                    </button>
                </div>

                <div className="space-y-8">
                    {tasksByUser.map(boardUser => (
                        <div key={boardUser.id}>
                            <h3 className="text-xl font-bold mb-4 border-b pb-2">{boardUser.username}'s Tasks</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <TaskColumn title="Pending" tasks={boardUser.tasks.filter(t => t.status === 'Pending')} onTaskClick={openModal} />
                                <TaskColumn title="In Progress" tasks={boardUser.tasks.filter(t => t.status === 'In Progress')} onTaskClick={openModal} />
                                <TaskColumn title="Completed" tasks={boardUser.tasks.filter(t => t.status === 'Completed')} onTaskClick={openModal} />
                            </div>
                        </div>
                    ))}
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
        </section>
    );
};

const TaskColumn = ({ title, tasks, onTaskClick }) => (
    <div className="bg-gray-100 p-4 rounded-lg">
        <h4 className="font-bold mb-4 text-center">{title} ({tasks.length})</h4>
        <div className="space-y-3">
            {tasks.map(task => (
                <div key={task.id} onClick={() => onTaskClick(task)} className="bg-white p-3 rounded-md shadow cursor-pointer hover:shadow-lg">
                    <p className="font-semibold">{task.task_name}</p>
                    <p className="text-xs text-gray-500">Due: {formatDate(task.date_to_complete)}</p>
                    <p className="text-xs text-gray-400 mt-1">Assigned by: {task.assigned_by_name}</p>
                </div>
            ))}
        </div>
    </div>
);

const TaskModal = ({ task, users, currentUser, onClose, onSave }) => {
    // --- FIX IS HERE ---
    // When editing, correctly map `assigned_to_id` to `assigned_to`.
    // When creating, set a default `assigned_to` from the users list.
    const [taskData, setTaskData] = useState(
        task 
        ? { ...task, assigned_to: task.assigned_to_id } 
        : { assigned_to: users[0]?.id || '', status: 'Pending' }
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
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
                        <input type="date" name="date_to_complete" value={taskData.date_to_complete || ''} onChange={handleInputChange} className="w-full border rounded p-2" />
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


export default TaskBoard;