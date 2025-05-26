'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Image, Loader2 } from 'lucide-react';
import { TimeSlot, PlannerSettings } from '../types';
import { pdfUtils } from '../utils/pdfExport';

interface PDFExportProps {
  timeSlots: TimeSlot[];
  currentDate: Date;
  settings: PlannerSettings;
}

export default function PDFExport({ timeSlots, currentDate, settings }: PDFExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'structured' | 'screenshot'>('structured');

  const handleExport = async (type: 'structured' | 'screenshot') => {
    setIsExporting(true);
    
    try {
      if (type === 'structured') {
        await pdfUtils.exportToPDF(timeSlots, currentDate, settings);
      } else {
        const filename = `Tagesplan_Screenshot_${currentDate.toISOString().split('T')[0]}.pdf`;
        await pdfUtils.exportScreenshotToPDF('planner-content', filename);
      }
    } catch (error) {
      console.error('Fehler beim PDF-Export:', error);
      alert('Fehler beim Erstellen der PDF. Bitte versuchen Sie es erneut.');
    } finally {
      setIsExporting(false);
    }
  };

  const occupiedSlots = timeSlots.filter(slot => slot.isOccupied && !slot.isBlocked);
  
  return (
    <div className="glass-effect p-4 rounded-xl">
      <div className="flex items-center space-x-2 mb-4">
        <Download className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">PDF Export</h3>
      </div>

      <div className="space-y-3">
        <div className="text-sm text-gray-300">
          {occupiedSlots.length > 0 
            ? `${occupiedSlots.length} Aufgabe(n) bereit zum Export`
            : 'Keine Aufgaben zum Exportieren vorhanden'
          }
        </div>

        <div className="grid grid-cols-1 gap-3">
          {/* Strukturierter Export */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleExport('structured')}
            disabled={isExporting || occupiedSlots.length === 0}
            className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/15 rounded-lg border border-white/20 hover:border-blue-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-blue-400" />
              <div className="text-left">
                <div className="text-sm font-medium text-white">Strukturierte PDF</div>
                <div className="text-xs text-gray-400">Saubere Liste mit allen Details</div>
              </div>
            </div>
            {isExporting && exportType === 'structured' ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            ) : (
              <Download className="w-4 h-4 text-gray-400" />
            )}
          </motion.button>

          {/* Screenshot Export */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleExport('screenshot')}
            disabled={isExporting}
            className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/15 rounded-lg border border-white/20 hover:border-purple-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center space-x-3">
              <Image className="w-5 h-5 text-purple-400" />
              <div className="text-left">
                <div className="text-sm font-medium text-white">Screenshot PDF</div>
                <div className="text-xs text-gray-400">Visueller Export des Layouts</div>
              </div>
            </div>
            {isExporting && exportType === 'screenshot' ? (
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
            ) : (
              <Download className="w-4 h-4 text-gray-400" />
            )}
          </motion.button>
        </div>

        {occupiedSlots.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-4">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Erstellen Sie zuerst einige Aufgaben,<br />um sie als PDF zu exportieren.</p>
          </div>
        )}
      </div>
    </div>
  );
}