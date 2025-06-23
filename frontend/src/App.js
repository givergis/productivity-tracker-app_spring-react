import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';
import EditTask from './components/EditTask';
import Filters from './components/Filters';
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

  const fetchTasks = async () => {
    try {
      setLoading(true); // Start spinner
      const res = await axios.get(API_URL);
       await new Promise(resolve => setTimeout(resolve, 1000)); 
      setTasks(res.data);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false); // Stop spinner
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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

  // FILTERED TASKS
  const filteredTasks = tasks
    .filter(task =>
      task.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter(task =>
      filterStatus === 'ALL' ? true : task.status === filterStatus
    )
    .filter(task =>
      filterPriority === 'ALL' ? true : task.priority === filterPriority
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white bg-opacity-90 rounded-xl shadow-lg mt-12">
      <h1 className="text-center text-5xl font-extrabold mb-8 text-blue-700">
        📝 Task Manager
      </h1>

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
                  cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"
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
