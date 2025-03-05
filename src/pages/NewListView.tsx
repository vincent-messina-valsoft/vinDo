import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreHorizontal, Share2 } from 'lucide-react';

const COLORS = [
  { id: 'blue', value: '#4F6BED' },
  { id: 'purple', value: '#9C27B0' },
  { id: 'pink', value: '#E91E63' },
  { id: 'red', value: '#D84315' },
  { id: 'green', value: '#2E7D32' },
  { id: 'teal', value: '#00796B' },
  { id: 'gray', value: '#607D8B' },
  { id: 'light-blue', value: '#039BE5' },
];

export default function NewListView() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('Untitled list');
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [backgroundType, setBackgroundType] = useState<'color' | 'photo' | 'custom'>('color');

  const handleSave = () => {
    // TODO: Save list to database
    navigate('/');
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
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: selectedColor }}
    >
      {/* Status Bar */}
      <div className="w-full flex justify-between items-center px-4 py-2 text-white border-b">
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
            className="flex items-center gap-2 text-white"
            onClick={() => navigate('/')}
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="text-xl">Lists</span>
          </button>
          <div className="flex items-center gap-4">
            <button className="text-white">
              <Share2 className="w-6 h-6" />
            </button>
            <button className="text-white">
              <MoreHorizontal className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* List Title Input */}
      <div className="px-4 mb-8">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-4xl font-semibold bg-transparent text-white placeholder-white/70 outline-none"
          placeholder="Untitled list"
        />
      </div>

      {/* Background Options */}
      <div className="mt-auto px-4 pb-4 bg-white/10 backdrop-blur-sm">
        <div className="flex gap-4 mb-6">
          <button
            className={`px-6 py-2 rounded-full ${
              backgroundType === 'color' 
                ? 'bg-white text-blue-600' 
                : 'bg-white/20 text-white'
            }`}
            onClick={() => setBackgroundType('color')}
          >
            Color
          </button>
          <button
            className={`px-6 py-2 rounded-full ${
              backgroundType === 'photo'
                ? 'bg-white text-blue-600'
                : 'bg-white/20 text-white'
            }`}
            onClick={() => setBackgroundType('photo')}
          >
            Photo
          </button>
          <button
            className={`px-6 py-2 rounded-full ${
              backgroundType === 'custom'
                ? 'bg-white text-blue-600'
                : 'bg-white/20 text-white'
            }`}
            onClick={() => setBackgroundType('custom')}
          >
            Custom
          </button>
        </div>

        {/* Color Swatches */}
        {backgroundType === 'color' && (
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {COLORS.map((color) => (
              <button
                key={color.id}
                className={`w-12 h-12 rounded-full flex-shrink-0 ${
                  selectedColor === color.value
                    ? 'ring-4 ring-white'
                    : ''
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => setSelectedColor(color.value)}
              />
            ))}
          </div>
        )}

        {/* Photo Selection (placeholder) */}
        {backgroundType === 'photo' && (
          <div className="text-white text-center py-4">
            Photo selection coming soon
          </div>
        )}

        {/* Custom Background (placeholder) */}
        {backgroundType === 'custom' && (
          <div className="text-white text-center py-4">
            Custom background coming soon
          </div>
        )}
      </div>
    </div>
  );
}