import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';
import EditTask from './components/EditTask';
import Filters from './components/Filters';
import Login from './components/Login'; // new for JWT login
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'http://localhost:8080/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');

  const token = localStorage.getItem('token');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTasks(res.data);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const addTask = async (task) => {
    try {
      await axios.post(API_URL, task);
      toast.success('Task added!');
      fetchTasks();
    } catch (err) {
      toast.error('Failed to add task');
    }
  };

  const updateTask = async (updatedTask) => {
    try {
      await axios.put(`${API_URL}/${updatedTask.id}`, updatedTask);
      toast.success('Task updated!');
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure to delete this task?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success('Task deleted!');
      fetchTasks();
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
     toast.success('Logout Successful!');
    window.location.reload();
  };

  // FILTERED TASKS
  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((task) =>
      filterStatus === 'ALL' ? true : task.status === filterStatus
    )
    .filter((task) =>
      filterPriority === 'ALL' ? true : task.priority === filterPriority
    );

  if (!token) return <Login onLogin={fetchTasks} />;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white bg-opacity-90 rounded-xl shadow-lg mt-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-5xl font-extrabold text-blue-700">📝 Task Manager</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <Filters
        search={search}
        setSearch={setSearch}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
      />

      {!editingTask ? (
        <>
          <AddTask onAdd={addTask} />

          {loading ? (
            <div className="flex justify-center py-6">
              <svg
                className="animate-spin h-8 w-8 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            </div>
          ) : (
            <TaskList
              tasks={filteredTasks}
              onEdit={setEditingTask}
              onDelete={deleteTask}
            />
          )}
        </>
      ) : (
        <EditTask
          task={editingTask}
          onCancel={() => setEditingTask(null)}
          onUpdate={updateTask}
        />
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default App;
