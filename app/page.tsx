'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Sparkles } from 'lucide-react';
import TimeSlotCard from './components/TimeSlotCard';
import SettingsPanel from './components/SettingsPanel';
import PDFExport from './components/PDFExport';
import { TimeSlot, PlannerSettings } from './types';
import { timeUtils } from './utils';

export default function Home() {
  const [settings, setSettings] = useState<PlannerSettings>({
    startTime: '08:00',
    interval: 30,
    endTime: '18:00',
    workingDays: ['Mo', 'Di', 'Mi', 'Do', 'Fr'],
  });

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Generiere Zeitslots basierend auf Einstellungen
  useEffect(() => {
    const generateTimeSlots = () => {
      const slots: TimeSlot[] = [];
      const [startHour, startMinute] = settings.startTime.split(':').map(Number);
      const [endHour, endMinute] = settings.endTime.split(':').map(Number);
      
      const startTotalMinutes = startHour * 60 + startMinute;
      const endTotalMinutes = endHour * 60 + endMinute;
      
      for (let minutes = startTotalMinutes; minutes < endTotalMinutes; minutes += settings.interval) {
        const hour = Math.floor(minutes / 60);
        const minute = minutes % 60;
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        slots.push({
          id: `slot-${timeString}`,
          time: timeString,
          title: '',
          isOccupied: false,
          isBlocked: false,
        });
      }
      
      setTimeSlots(slots);
    };

    generateTimeSlots();
  }, [settings]);

  // Funktion zum Blockieren/Freigeben von Zeitslots basierend auf Aufgabendauer
  const updateSlotsWithDuration = (updatedSlot: TimeSlot, allSlots: TimeSlot[]) => {
    const slots = [...allSlots];
    const slotIndex = slots.findIndex(slot => slot.id === updatedSlot.id);
    
    if (slotIndex === -1) return slots;

    // Zuerst alle Blockierungen von diesem Slot entfernen
    slots.forEach(slot => {
      if (slot.parentTaskId === updatedSlot.id) {
        slot.isBlocked = false;
        slot.parentTaskId = undefined;
      }
    });

    // Den aktualisierten Slot setzen
    slots[slotIndex] = { ...updatedSlot };

    // Wenn die Aufgabe eine Dauer hat und besetzt ist, blockiere nachfolgende Slots
    if (updatedSlot.isOccupied && updatedSlot.duration && updatedSlot.duration > settings.interval) {
      const startTime = timeUtils.timeToMinutes(updatedSlot.time);
      const endTime = startTime + updatedSlot.duration;
      
      for (let i = slotIndex + 1; i < slots.length; i++) {
        const currentSlotTime = timeUtils.timeToMinutes(slots[i].time);
        
        if (currentSlotTime < endTime) {
          if (!slots[i].isOccupied) {
            slots[i].isBlocked = true;
            slots[i].parentTaskId = updatedSlot.id;
          }
        } else {
          break;
        }
      }
    }

    return slots;
  };

  const updateTimeSlot = (updatedSlot: TimeSlot) => {
    setTimeSlots(currentSlots => updateSlotsWithDuration(updatedSlot, currentSlots));
  };

  const deleteTimeSlot = (id: string) => {
    setTimeSlots(slots => {
      const updatedSlots = slots.map(slot => {
        if (slot.id === id) {
          return { 
            ...slot, 
            title: '', 
            description: '', 
            isOccupied: false,
            duration: undefined,
            endTime: undefined,
            category: undefined,
            priority: undefined,
          };
        } else if (slot.parentTaskId === id) {
          // Freigabe blockierter Slots
          return {
            ...slot,
            isBlocked: false,
            parentTaskId: undefined,
          };
        }
        return slot;
      });
      
      return updatedSlots;
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const occupiedSlots = timeSlots.filter(slot => slot.isOccupied).length;
  const totalSlots = timeSlots.length;

  return (
    <div className="min-h-screen p-4 md:p-8" id="planner-content">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-primary-300 bg-clip-text text-transparent flex items-center space-x-3">
                <Sparkles className="w-8 h-8 text-primary-400 animate-pulse" />
                <span>Ultra Day Planner</span>
              </h1>
              <p className="text-gray-300 mt-2 flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(currentDate)}</span>
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="glass-effect px-4 py-2 rounded-lg">
                <div className="text-sm text-gray-300">Produktivität</div>
                <div className="text-lg font-semibold">
                  {totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0}%
                </div>
              </div>
              <SettingsPanel settings={settings} onSettingsChange={setSettings} />
            </div>
          </div>
        </motion.header>

        {/* Stats und PDF Export */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="glass-effect p-4 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-primary-400" />
              <div className="text-2xl font-bold">{totalSlots}</div>
              <div className="text-sm text-gray-300">Zeitslots</div>
            </div>
            
            <div className="glass-effect p-4 text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold">{occupiedSlots}</div>
              <div className="text-sm text-gray-300">Geplant</div>
            </div>
            
            <div className="glass-effect p-4 text-center">
              <Sparkles className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold">{totalSlots - occupiedSlots}</div>
              <div className="text-sm text-gray-300">Verfügbar</div>
            </div>
          </motion.div>

          {/* PDF Export */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-1"
          >
            <PDFExport 
              timeSlots={timeSlots}
              currentDate={currentDate}
              settings={settings}
            />
          </motion.div>
        </div>

        {/* Time Slots Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {timeSlots.map((slot, index) => (
            <motion.div
              key={slot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <TimeSlotCard
                timeSlot={slot}
                onUpdate={updateTimeSlot}
                onDelete={deleteTimeSlot}
                settings={settings}
              />
            </motion.div>
          ))}
        </motion.div>

        {timeSlots.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-400">
              Konfigurieren Sie Ihre Einstellungen, um Zeitslots zu generieren.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
