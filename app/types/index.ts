export interface TimeSlot {
  id: string;
  time: string;
  title: string;
  description?: string;
  isOccupied: boolean;
  category?: 'work' | 'personal' | 'health' | 'other';
  priority?: 'low' | 'medium' | 'high';
  duration?: number; // Dauer in Minuten
  endTime?: string; // Berechnet basierend auf Zeit + Dauer
  isBlocked?: boolean; // Markiert Slots die von längeren Aufgaben blockiert sind
  parentTaskId?: string; // Referenz zur Haupt-Aufgabe wenn blockiert
}

export interface PlannerSettings {
  startTime: string;
  interval: number; // in Minuten
  endTime: string;
  workingDays: string[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  timeSlotId: string;
  category: 'work' | 'personal' | 'health' | 'other';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}
