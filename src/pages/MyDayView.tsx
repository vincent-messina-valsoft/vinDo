import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Sun, Bell, Calendar, Flag, MoreHorizontal, Check, Plus } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { getTasks, createTask, updateTask, deleteTask, Task } from '../lib/supabase';

export default function MyDayView() {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tasks when the component mounts
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchTasks();
    } else if (isLoaded && !isSignedIn) {
      setIsLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const fetchedTasks = await getTasks(null); // null to get all tasks for the user
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted, new task:', newTask);
    
    if (!newTask.trim()) {
      console.log('Task text is empty, not creating task');
      return;
    }
    
    if (!isSignedIn || !user) {
      console.log('User not signed in:', { isSignedIn, userId: user?.id });
      return;
    }

    try {
      console.log('Attempting to create task...', user.id);
      const taskData = {
        title: newTask,
        completed: false,
        important: false,
        user_id: user.id,
        list_id: null // No specific list, just in "My Day"
      };
      console.log('Task data:', taskData);
      
      const createdTask = await createTask(taskData);
      console.log('Task created successfully:', createdTask);
      
      // Update local state with the new task
      setTasks(prevTasks => [createdTask, ...prevTasks]);
      
      // Clear the input field
      setNewTask('');
      
      console.log('Updated tasks:', tasks);
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to create task: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    try {
      await updateTask(taskId, { completed: !completed });
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, completed: !completed } : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Format today's date
  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };
  
  // Get current time in Eastern Time
  const getCurrentTime = () => {
    const options: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/New_York' 
    };
    return new Date().toLocaleTimeString('en-US', options);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-teal-600">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-teal-600">
        <div className="text-white text-xl mb-4">Please sign in to view your tasks</div>
        <button 
          onClick={() => navigate('/')}
          className="bg-white text-teal-600 px-6 py-2 rounded-lg"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

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
        <span>{getCurrentTime()}</span>
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
        <h2 className="text-xl opacity-90">{formatDate()}</h2>
      </header>

      {/* Task List */}
      <div className="flex-1 flex flex-col justify-end px-4 pb-4">
        {tasks.map(task => (
          <div
            key={task.id}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-lg rounded-lg px-4 py-3 mb-2"
          >
            <button 
              className={`w-6 h-6 rounded-full ${task.completed 
                ? 'bg-white flex items-center justify-center' 
                : 'border-2 border-white/70'}`}
              onClick={() => handleToggleComplete(task.id, task.completed)}
            >
              {task.completed && <Check className="w-4 h-4 text-teal-600" />}
            </button>
            <span className={`text-white ${task.completed ? 'line-through opacity-70' : ''}`}>
              {task.title}
            </span>
          </div>
        ))}

        {/* Add Task Input */}
        <form onSubmit={handleAddTask} className="mt-2">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-lg rounded-lg px-4 py-3">
            <button 
              type="submit" 
              className="w-6 h-6 rounded-full border-2 border-white/70 flex-shrink-0 flex items-center justify-center"
              aria-label="Add task"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTask(e);
                }
              }}
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