import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Sun, Bell, Calendar, Flag, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export default function MyDayView() {
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
      },
    ]);
    setNewTask('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-teal-600">
      {/* Background Image */}
      <div 
        className="absolute inset-0 -z-10 opacity-50"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1567540227507-f329bfb1d85a?auto=format&fit=crop&w=800&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Status Bar */}
      <div className="w-full flex justify-between items-center px-4 py-2 text-white">
        <span>20:46</span>
        <div className="flex items-center gap-2">
          <span>•••</span>
          <span className="text-sm">WiFi</span>
          <span>73%</span>
        </div>
      </div>

      {/* Header */}
      <header className="px-4 pt-2 pb-4 text-white">
        <div className="flex justify-between items-center mb-4">
          <button 
            className="flex items-center gap-2"
            onClick={() => navigate('/')}
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="text-xl">Lists</span>
          </button>
          <div className="flex items-center gap-4">
            <button>
              <Sun className="w-6 h-6" />
            </button>
            <button>
              <MoreHorizontal className="w-6 h-6" />
            </button>
          </div>
        </div>
        <h1 className="text-4xl font-semibold mb-1">My Day</h1>
        <h2 className="text-xl opacity-90">{format(new Date(), 'EEEE, MMMM d')}</h2>
      </header>

      {/* Task List */}
      <div className="flex-1 flex flex-col justify-end px-4 pb-4">
        {tasks.map(task => (
          <div
            key={task.id}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-lg rounded-lg px-4 py-3 mb-2"
          >
            <button className="w-6 h-6 rounded-full border-2 border-white/70" />
            <span className="text-white">{task.title}</span>
          </div>
        ))}

        {/* Add Task Input */}
        <form onSubmit={handleAddTask} className="mt-2">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-lg rounded-lg px-4 py-3">
            <button type="submit" className="w-6 h-6 rounded-full border-2 border-white/70 flex-shrink-0" />
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a Task"
              className="bg-transparent text-white placeholder-white/70 flex-1 outline-none"
            />
          </div>
        </form>

        {/* Bottom Action Bar */}
        <div className="flex justify-around mt-4">
          <button>
            <Flag className="w-6 h-6 text-white/70" />
          </button>
          <button>
            <Bell className="w-6 h-6 text-white/70" />
          </button>
          <button>
            <Calendar className="w-6 h-6 text-white/70" />
          </button>
          <button>
            <Flag className="w-6 h-6 text-white/70" />
          </button>
        </div>
      </div>
    </div>
  );
}