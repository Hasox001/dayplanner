// Zeitberechnungs-Utilities
export const timeUtils = {
  // Konvertiert Zeit-String (HH:MM) zu Minuten seit Mitternacht
  timeToMinutes: (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  },

  // Konvertiert Minuten seit Mitternacht zu Zeit-String (HH:MM)
  minutesToTime: (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  },

  // Berechnet Endzeit basierend auf Startzeit und Dauer
  calculateEndTime: (startTime: string, durationMinutes: number): string => {
    const startMinutes = timeUtils.timeToMinutes(startTime);
    const endMinutes = startMinutes + durationMinutes;
    return timeUtils.minutesToTime(endMinutes);
  },

  // Prüft ob eine Zeit in einem bestimmten Bereich liegt
  isTimeInRange: (time: string, startTime: string, endTime: string): boolean => {
    const timeMinutes = timeUtils.timeToMinutes(time);
    const startMinutes = timeUtils.timeToMinutes(startTime);
    const endMinutes = timeUtils.timeToMinutes(endTime);
    return timeMinutes >= startMinutes && timeMinutes < endMinutes;
  }
};