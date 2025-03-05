import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import {
  Sun,
  Star,
  Calendar,
  User,
  Flag,
  Home,
  Plus,
  Search,
  RotateCcw
} from 'lucide-react';
import SearchOverlay from '../components/SearchOverlay';
import { searchTasks, Task } from '../lib/supabase';

function SidebarItem({ icon: Icon, label, isActive = false, onClick }: { 
  icon: React.ElementType; 
  label: string; 
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
        isActive ? 'bg-blue-50' : 'hover:bg-gray-100'
      }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
      <span className={`text-base ${isActive ? 'text-blue-600' : 'text-gray-900'}`}>{label}</span>
    </button>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<(Task & { lists: { title: string } | null })[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    try {
      setIsSearching(true);
      const results = await searchTasks(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
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

  return (
    <div className="min-h-screen bg-white">
      {/* Status Bar */}
      <div className="w-full flex justify-between items-center px-4 py-2 text-gray-600 border-b">
        <span>{getCurrentTime()}</span>
        <div className="flex items-center gap-2">
          <span>•••</span>
          <span className="text-sm">WiFi</span>
          <span>73%</span>
        </div>
      </div>

      {/* Header */}
      <header className="flex justify-between items-center px-4 py-2 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center text-sm">
            VM
          </div>
          <span className="text-lg font-semibold">Vincent Messina</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="w-5 h-5" />
          </button>
          <UserButton />
        </div>
      </header>

      {/* Sidebar Navigation */}
      <nav className="flex flex-col h-[calc(100vh-8.5rem)]">
        <div className="flex-1">
          <SidebarItem 
            icon={Sun} 
            label="My Day"
            onClick={() => navigate('/my-day')}
          />
          <SidebarItem 
            icon={Star} 
            label="Important" 
            onClick={() => navigate('/important')}
          />
          <SidebarItem icon={Calendar} label="Planned" />
          <SidebarItem icon={User} label="Assigned to me" />
          <SidebarItem icon={Flag} label="Flagged email" />
          <SidebarItem icon={Home} label="Tasks" />
        </div>

        {/* Bottom Actions */}
        <div className="border-t p-4 flex justify-between items-center">
          <button 
            className="flex items-center gap-2 text-blue-600"
            onClick={() => navigate('/new-list')}
          >
            <Plus className="w-5 h-5" />
            <span>New List</span>
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
          setSearchResults([]);
        }}
        onSearch={handleSearch}
        results={searchResults}
        isSearching={isSearching}
      />
    </div>
  );
}