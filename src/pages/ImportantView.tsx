import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreHorizontal, Plus, Check, Star } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { getImportantTasks, createTask, updateTask, Task } from '../lib/supabase';

export default function ImportantView() {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showInput, setShowInput] = useState(false);

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
      const fetchedTasks = await getImportantTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching important tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted in ImportantView, new task:', newTask);
    
    if (!newTask.trim()) {
      console.log('Task text is empty, not creating task');
      return;
    }
    
    if (!isSignedIn || !user) {
      console.log('User not signed in:', { isSignedIn, userId: user?.id });
      return;
    }

    try {
      console.log('Attempting to create important task...', user.id);
      const taskData = {
        title: newTask,
        completed: false,
        important: true,
        user_id: user.id,
        list_id: null
      };
      console.log('Task data:', taskData);
      
      const createdTask = await createTask(taskData);
      console.log('Important task created successfully:', createdTask);
      
      // Update local state with the new task
      setTasks(prevTasks => [createdTask, ...prevTasks]);
      
      // Clear the input field and hide input
      setNewTask('');
      setShowInput(false);
      
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
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-pink-700 text-xl">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50">
        <div className="text-pink-700 text-xl mb-4">Please sign in to view your important tasks</div>
        <button 
          onClick={() => navigate('/')}
          className="bg-pink-700 text-white px-6 py-2 rounded-lg"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-pink-50">
      {/* Status Bar */}
      <div className="w-full flex justify-between items-center px-4 py-2 text-gray-600">
        <span>{getCurrentTime()}</span>
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
            <Star className="w-full h-full text-pink-300 fill-current" />
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
              <button 
                className={`w-6 h-6 rounded-full ${task.completed 
                  ? 'bg-pink-400 flex items-center justify-center' 
                  : 'border-2 border-pink-400'}`}
                onClick={() => handleToggleComplete(task.id, task.completed)}
              >
                {task.completed && <Check className="w-4 h-4 text-white" />}
              </button>
              <span className={`text-gray-900 ${task.completed ? 'line-through opacity-70' : ''}`}>
                {task.title}
              </span>
              <Star className="w-5 h-5 text-pink-500 fill-current ml-auto" />
            </div>
          ))}
        </div>
      )}

      {/* Add Task Button */}
      {!showInput ? (
        <div className="px-4 py-4">
          <button
            onClick={() => setShowInput(true)}
            className="w-full flex items-center gap-3 text-pink-700 px-4 py-3 rounded-lg bg-white/50 backdrop-blur-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Add a Task</span>
          </button>
        </div>
      ) : (
        <div className="px-4 py-4">
          <form onSubmit={handleAddTask} className="bg-white rounded-lg shadow-sm">
            <div className="flex items-center p-3">
              <button 
                type="submit" 
                className="w-6 h-6 rounded-full border-2 border-pink-400 flex-shrink-0 flex items-center justify-center"
                aria-label="Add important task"
              >
                <Plus className="w-4 h-4 text-pink-500" />
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
                className="w-full px-3 py-1 bg-transparent text-gray-900 placeholder-gray-500 outline-none"
                autoFocus
              />
              <Star className="w-5 h-5 text-pink-500 fill-current ml-auto" />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}