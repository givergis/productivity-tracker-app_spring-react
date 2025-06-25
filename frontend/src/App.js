import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';
import EditTask from './components/EditTask';
import Filters from './components/Filters';
import Login from './components/Login';
import Register from './components/Register';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Routes, Route, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8080/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      await axios.post(API_URL, task, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Task added!');
      fetchTasks();
    } catch (err) {
      toast.error('Failed to add task');
    }
  };

  const updateTask = async (updatedTask) => {
    try {
      await axios.put(`${API_URL}/${updatedTask.id}`, updatedTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Task deleted!');
      fetchTasks();
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    toast.success('Logout Successful!');
    navigate('/login');
  };

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

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            token ? (
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
              </div>
            ) : (
              <Login onLogin={fetchTasks} />
            )
          }
        />

        <Route path="/login" element={<Login onLogin={fetchTasks} />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;
