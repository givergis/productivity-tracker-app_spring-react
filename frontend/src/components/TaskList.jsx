import React from 'react';

const statusColors = {
  TODO: 'bg-yellow-200 text-yellow-800',
  IN_PROGRESS: 'bg-blue-200 text-blue-800',
  DONE: 'bg-green-200 text-green-800',
};

const priorityColors = {
  High: 'bg-red-300 text-red-800',
  Medium: 'bg-yellow-300 text-yellow-800',
  Low: 'bg-green-300 text-green-800',
};

const TaskList = ({ tasks, onEdit, onDelete }) => {
  if (tasks.length === 0)
    return <p className="text-center text-gray-500">No tasks found.</p>;

  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex justify-between items-center p-4 bg-white rounded shadow hover:shadow-md transition"
        >
          <div>
            <p className="font-semibold text-lg text-gray-900">{task.title}</p>
            <div className="flex gap-2 mt-1">
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[task.status]}`}
              >
                {task.status}
              </span>
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${priorityColors[task.priority]}`}
              >
                {task.priority}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(task)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
