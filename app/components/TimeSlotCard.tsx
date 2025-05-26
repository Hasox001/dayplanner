'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Plus, Edit3, Trash2, Timer } from 'lucide-react';
import { TimeSlot } from '../types';
import { timeUtils } from '../utils';

interface TimeSlotCardProps {
  timeSlot: TimeSlot;
  onUpdate: (timeSlot: TimeSlot) => void;
  onDelete: (id: string) => void;
  settings: { interval: number };
}

export default function TimeSlotCard({ timeSlot, onUpdate, onDelete, settings }: TimeSlotCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(timeSlot.title || '');
  const [description, setDescription] = useState(timeSlot.description || '');
  const [duration, setDuration] = useState(timeSlot.duration || settings.interval);
  const [category, setCategory] = useState(timeSlot.category || 'other');
  const [priority, setPriority] = useState(timeSlot.priority || 'medium');

  const durationOptions = [
    { value: 15, label: '15 Min' },
    { value: 30, label: '30 Min' },
    { value: 45, label: '45 Min' },
    { value: 60, label: '1 Stunde' },
    { value: 90, label: '1.5 Stunden' },
    { value: 120, label: '2 Stunden' },
    { value: 180, label: '3 Stunden' },
  ];

  const categoryOptions = [
    { value: 'work', label: 'Arbeit', color: 'from-blue-500 to-blue-600' },
    { value: 'personal', label: 'Persönlich', color: 'from-green-500 to-green-600' },
    { value: 'health', label: 'Gesundheit', color: 'from-red-500 to-red-600' },
    { value: 'other', label: 'Sonstiges', color: 'from-purple-500 to-purple-600' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Niedrig', color: 'text-gray-400' },
    { value: 'medium', label: 'Mittel', color: 'text-yellow-400' },
    { value: 'high', label: 'Hoch', color: 'text-red-400' },
  ];

  const handleSave = () => {
    const endTime = timeUtils.calculateEndTime(timeSlot.time, duration);
    
    onUpdate({
      ...timeSlot,
      title: title.trim(),
      description: description.trim(),
      duration,
      endTime,
      category,
      priority,
      isOccupied: title.trim() !== '',
    });
    setIsEditing(false);
  };

  const handleAddTask = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTitle(timeSlot.title || '');
    setDescription(timeSlot.description || '');
    setDuration(timeSlot.duration || settings.interval);
    setCategory(timeSlot.category || 'other');
    setPriority(timeSlot.priority || 'medium');
    setIsEditing(false);
  };

  const getCategoryColor = (cat: string) => {
    return categoryOptions.find(option => option.value === cat)?.color || 'from-gray-500 to-gray-600';
  };

  const getPriorityColor = (prio: string) => {
    return priorityOptions.find(option => option.value === prio)?.color || 'text-gray-400';
  };

  if (timeSlot.isBlocked) {
    return (
      <div className="glass-effect p-4 rounded-xl border border-gray-600/50 bg-gray-800/30 min-h-[120px] opacity-60">
        <div className="flex items-center space-x-2 text-gray-500">
          <Clock className="w-4 h-4" />
          <span className="font-mono text-sm">{timeSlot.time}</span>
        </div>
        <div className="mt-2 text-center text-gray-400 text-sm">
          <Timer className="w-4 h-4 mx-auto mb-1" />
          <p>Blockiert durch längere Aufgabe</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 min-h-[120px]">
      {/* Header with time and actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <span className="font-mono text-sm font-medium text-white">{timeSlot.time}</span>
          {timeSlot.endTime && timeSlot.endTime !== timeSlot.time && (
            <>
              <span className="text-gray-400">-</span>
              <span className="font-mono text-sm text-gray-300">{timeSlot.endTime}</span>
            </>
          )}
        </div>
        
        <div className="flex space-x-1">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1 hover:bg-white/20 rounded-md transition-colors"
            title="Bearbeiten"
          >
            <Edit3 className="w-3 h-3 text-gray-300 hover:text-white" />
          </button>
          {timeSlot.isOccupied && (
            <button
              onClick={() => onDelete(timeSlot.id)}
              className="p-1 hover:bg-red-500/20 rounded-md transition-colors"
              title="Löschen"
            >
              <Trash2 className="w-3 h-3 text-gray-300 hover:text-red-400" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Aufgabentitel eingeben..."
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15"
            autoFocus
          />
          
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beschreibung (optional)"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 resize-none"
            rows={2}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-300 mb-1">Dauer</label>
              <select
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
              >
                {durationOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-gray-800">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-300 mb-1">Kategorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-gray-800">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-300 mb-1">Priorität</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-gray-800">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Speichern
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Abbrechen
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-[50px] flex items-center">
          {timeSlot.isOccupied ? (
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-white">{timeSlot.title}</h3>
                {timeSlot.priority && (
                  <span className={`text-xs ${getPriorityColor(timeSlot.priority)}`}>
                    {priorityOptions.find(p => p.value === timeSlot.priority)?.label}
                  </span>
                )}
              </div>
              
              {timeSlot.description && (
                <p className="text-xs text-gray-300 mb-2">{timeSlot.description}</p>
              )}
              
              <div className="flex items-center justify-between">
                {timeSlot.category && (
                  <span className={`inline-block px-2 py-1 rounded-full text-xs bg-gradient-to-r ${getCategoryColor(timeSlot.category)}`}>
                    {categoryOptions.find(c => c.value === timeSlot.category)?.label}
                  </span>
                )}
                
                {timeSlot.duration && (
                  <div className="flex items-center space-x-1 text-xs text-gray-400">
                    <Timer className="w-3 h-3" />
                    <span>{timeSlot.duration} Min</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={handleAddTask}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors w-full text-left p-3 rounded-lg hover:bg-white/10 border border-dashed border-gray-600 hover:border-gray-400"
              type="button"
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm font-medium">Aufgabe hinzufügen</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
