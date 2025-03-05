import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreHorizontal, Plus } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  important: boolean;
}

export default function ImportantView() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setTasks([
      ...tasks,
      {
        id: crypto.randomUUID(),
        title: newTask,
        completed: false,
        important: true,
      },
    ]);
    setNewTask('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-pink-50">
      {/* Status Bar */}
      <div className="w-full flex justify-between items-center px-4 py-2 text-gray-600">
        <span>20:46</span>
        <div className="flex items-center gap-2">
          <span>•••</span>
          <span className="text-sm">WiFi</span>
          <span>73%</span>
        </div>
      </div>

      {/* Header */}
      <header className="px-4 pt-2 pb-4">
        <div className="flex justify-between items-center mb-4">
          <button 
            className="flex items-center gap-2 text-pink-700"
            onClick={() => navigate('/')}
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="text-xl">Lists</span>
          </button>
          <button className="text-pink-700">
            <MoreHorizontal className="w-6 h-6" />
          </button>
        </div>
        <h1 className="text-4xl font-semibold mb-1 text-pink-700">Important</h1>
      </header>

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <div className="w-24 h-24 mb-6">
            <svg viewBox="0 0 24 24" className="w-full h-full text-pink-300">
              <path
                fill="currentColor"
                d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z"
              />
            </svg>
          </div>
          <p className="text-xl text-pink-700">
            Try starring some tasks to see them here.
          </p>
        </div>
      )}

      {/* Task List */}
      {tasks.length > 0 && (
        <div className="flex-1 px-4">
          {tasks.map(task => (
            <div
              key={task.id}
              className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 mb-2 shadow-sm"
            >
              <button className="w-6 h-6 rounded-full border-2 border-pink-400" />
              <span className="text-gray-900">{task.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* Add Task Button */}
      <div className="px-4 py-4">
        <button
          onClick={() => document.getElementById('taskInput')?.focus()}
          className="w-full flex items-center gap-3 text-pink-700 px-4 py-3 rounded-lg bg-white/50 backdrop-blur-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Add a Task</span>
        </button>
      </div>

      {/* Add Task Input (Hidden until button click) */}
      <form onSubmit={handleAddTask} className="hidden">
        <input
          id="taskInput"
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a Task"
          className="w-full px-4 py-3 bg-transparent text-pink-700 placeholder-pink-400 outline-none"
        />
      </form>
    </div>
  );
}