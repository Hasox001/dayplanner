'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Settings, Clock, Calendar } from 'lucide-react';
import { PlannerSettings } from '../types';

interface SettingsPanelProps {
  settings: PlannerSettings;
  onSettingsChange: (settings: PlannerSettings) => void;
}

export default function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const intervalOptions = [
    { value: 15, label: '15 Minuten' },
    { value: 30, label: '30 Minuten' },
    { value: 45, label: '45 Minuten' },
    { value: 60, label: '1 Stunde' },
  ];

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      });
    }
  }, [isOpen]);

  const SettingsDropdown = () => {
    if (!isOpen) return null;

    return createPortal(
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          style={{ zIndex: 9998 }}
          onClick={() => setIsOpen(false)}
        />

        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="fixed glass-effect p-6 w-80"
          style={{
            top: buttonPosition.top,
            right: buttonPosition.right,
            zIndex: 9999
          }}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Planer Einstellungen</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Startzeit</span>
              </label>
              <input
                type="time"
                value={settings.startTime}
                onChange={(e) => onSettingsChange({ ...settings, startTime: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Endzeit</label>
              <input
                type="time"
                value={settings.endTime}
                onChange={(e) => onSettingsChange({ ...settings, endTime: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Zeitintervall</label>
              <select
                value={settings.interval}
                onChange={(e) => onSettingsChange({ ...settings, interval: parseInt(e.target.value) })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500"
              >
                {intervalOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-slate-800">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full glass-button text-center"
            >
              Schließen
            </button>
          </div>
        </motion.div>
      </>,
      document.body
    );
  };

  return (
    <div className="relative">
      <motion.button
        ref={buttonRef}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="glass-button flex items-center space-x-2"
      >
        <Settings className="w-4 h-4" />
        <span>Einstellungen</span>
      </motion.button>

      <SettingsDropdown />
    </div>
  );
}
