import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, Check, Star } from 'lucide-react';
import { Task } from '../lib/supabase';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  results?: (Task & { lists: { title: string } | null })[];
  isSearching?: boolean;
}

export default function SearchOverlay({ 
  isOpen, 
  onClose, 
  onSearch,
  results = [],
  isSearching = false
}: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input field when overlay opens
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    // Clear search query when the overlay closes
    if (!isOpen) {
      setSearchQuery('');
      setHasSearched(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setHasSearched(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600/90 flex flex-col z-50">
      {/* Status Bar */}
      <div className="w-full flex justify-between items-center px-4 py-2 text-white">
        <span>{getCurrentTime()}</span>
        <div className="flex items-center gap-2">
          <span>•••</span>
          <span className="text-sm">WiFi</span>
          <span>73%</span>
        </div>
      </div>

      {/* Search Header */}
      <div className="bg-white p-4 shadow">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <SearchIcon className="w-5 h-5 text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search tasks across all lists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
            autoFocus
          />
          {searchQuery && (
            <button 
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button 
            type="button"
            onClick={onClose}
            className="ml-2 text-blue-600 font-medium"
          >
            Cancel
          </button>
        </form>
      </div>

      {/* Search Results or Empty State */}
      <div className="flex-1 overflow-y-auto bg-white">
        {isSearching ? (
          <div className="p-4 text-center text-gray-500">
            <p>Searching...</p>
          </div>
        ) : hasSearched ? (
          results.length > 0 ? (
            <div className="divide-y">
              {results.map((task) => (
                <div key={task.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded-full border ${task.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-300'} flex items-center justify-center`}>
                      {task.completed && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-gray-900 ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</p>
                      {task.lists && (
                        <p className="text-sm text-gray-500 mt-1">
                          List: {task.lists.title}
                        </p>
                      )}
                    </div>
                    {task.important && (
                      <div className="text-yellow-500">
                        <Star className="w-5 h-5 fill-current" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>No results found for "{searchQuery}"</p>
              <p className="mt-2 text-sm">Try a different search term</p>
            </div>
          )
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 mb-4">
              <SearchIcon className="w-full h-full text-gray-300" />
            </div>
            <p className="text-gray-500 max-w-xs">
              Search for tasks across all your lists. Type in keywords to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}