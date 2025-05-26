import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TimeSlot } from '../types';

export const pdfUtils = {
  // Exportiert den Tagesplan als PDF mit professioneller Struktur
  exportToPDF: async (timeSlots: TimeSlot[], currentDate: Date, settings: any) => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    let yPosition = margin;
    const SPACING = {
      line: 5,
      section: 12,
      task: 8,
      header: 15
    };
    
    const FONTS = {
      title: { size: 24, style: 'bold' },
      subtitle: { size: 16, style: 'bold' },
      heading: { size: 14, style: 'bold' },
      body: { size: 11, style: 'normal' },
      small: { size: 9, style: 'normal' },
      caption: { size: 8, style: 'normal' }
    };
    
    const COLORS = {
      primary: [40, 40, 40],
      secondary: [80, 80, 80],
      accent: [59, 130, 246],
      text: [55, 65, 81],
      light: [107, 114, 128],
      border: [200, 200, 200]
    };
    
    // Hilfsfunktionen
    const setFont = (fontConfig: any) => {
      pdf.setFontSize(fontConfig.size);
      pdf.setFont('helvetica', fontConfig.style);
    };
    
    const setColor = (color: number[]) => {
      pdf.setTextColor(color[0], color[1], color[2]);
    };
    
    const checkPageBreak = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - margin - 20) {
        pdf.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };
    
    const drawLine = (y: number, color: number[] = COLORS.border, width: number = 0.5) => {
      pdf.setLineWidth(width);
      pdf.setDrawColor(color[0], color[1], color[2]);
      pdf.line(margin, y, pageWidth - margin, y);
    };
    
    const drawBox = (x: number, y: number, w: number, h: number, fillColor?: number[]) => {
      if (fillColor) {
        pdf.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
        pdf.rect(x, y, w, h, 'F');
      }
      pdf.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
      pdf.setLineWidth(0.3);
      pdf.rect(x, y, w, h, 'S');
    };
    
    // === HEADER SECTION ===
    setFont(FONTS.title);
    setColor(COLORS.primary);
    pdf.text('ULTRA DAY PLANNER', margin, yPosition);
    yPosition += SPACING.header;
    
    // Datum und Überschrift in einer Zeile
    setFont(FONTS.body);
    setColor(COLORS.secondary);
    const dateString = new Intl.DateTimeFormat('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(currentDate);
    pdf.text(dateString, margin, yPosition);
    
    // Generiert am - rechts ausgerichtet
    const generatedText = `Generiert am ${new Date().toLocaleDateString('de-DE')}`;
    const generatedWidth = pdf.getTextWidth(generatedText);
    pdf.text(generatedText, pageWidth - margin - generatedWidth, yPosition);
    yPosition += SPACING.section;
    
    // Header-Trennlinie
    drawLine(yPosition, COLORS.primary, 1);
    yPosition += SPACING.section;
    
    // === ZEITRAUM INFO ===
    drawBox(margin, yPosition - 3, contentWidth, 12, [248, 250, 252]);
    setFont(FONTS.small);
    setColor(COLORS.text);
    pdf.text(`Arbeitszeit: ${settings.startTime} - ${settings.endTime}`, margin + 5, yPosition + 2);
    pdf.text(`Intervall: ${settings.interval} Minuten`, margin + 80, yPosition + 2);
    
    // Statistiken rechts
    const totalSlots = timeSlots.length;
    const occupiedSlots = timeSlots.filter(slot => slot.isOccupied && !slot.isBlocked);
    const productivity = totalSlots > 0 ? Math.round((occupiedSlots.length / totalSlots) * 100) : 0;
    
    const statsText = `${occupiedSlots.length}/${totalSlots} Aufgaben (${productivity}%)`;
    const statsWidth = pdf.getTextWidth(statsText);
    pdf.text(statsText, pageWidth - margin - statsWidth - 5, yPosition + 2);
    yPosition += SPACING.header;
    
    // === TAGESPLAN SECTION ===
    setFont(FONTS.subtitle);
    setColor(COLORS.primary);
    pdf.text('TAGESPLAN', margin, yPosition);
    yPosition += SPACING.section;
    
    if (occupiedSlots.length === 0) {
      drawBox(margin, yPosition - 3, contentWidth, 20, [249, 250, 251]);
      setFont(FONTS.body);
      setColor(COLORS.light);
      pdf.text('Keine Aufgaben fuer diesen Tag geplant', margin + 10, yPosition + 8);
      yPosition += 25;
    } else {
      // Sortiere Aufgaben chronologisch
      const sortedSlots = occupiedSlots.sort((a, b) => {
        const timeA = a.time.split(':').map(Number);
        const timeB = b.time.split(':').map(Number);
        return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
      });
      
      // Aufgaben-Header
      drawBox(margin, yPosition - 3, contentWidth, 8, [59, 130, 246]);
      setFont(FONTS.small);
      setColor([255, 255, 255]);
      pdf.text('ZEIT', margin + 5, yPosition + 2);
      pdf.text('AUFGABE', margin + 50, yPosition + 2);
      pdf.text('DETAILS', margin + 120, yPosition + 2);
      yPosition += SPACING.task + 2;
      
      sortedSlots.forEach((slot, index) => {
        const taskHeight = 18;
        checkPageBreak(taskHeight);
        
        // Abwechselnde Hintergrundfarben
        const bgColor = index % 2 === 0 ? [255, 255, 255] : [248, 250, 252];
        drawBox(margin, yPosition - 3, contentWidth, taskHeight, bgColor);
        
        // ZEIT-Spalte
        setFont(FONTS.body);
        setColor(COLORS.accent);
        let timeText = slot.time;
        if (slot.endTime) {
          timeText += ` - ${slot.endTime}`;
        }
        pdf.text(timeText, margin + 5, yPosition + 3);
        
        if (slot.duration) {
          setFont(FONTS.small);
          setColor(COLORS.light);
          pdf.text(`(${slot.duration} min)`, margin + 5, yPosition + 8);
        }
        
        // AUFGABE-Spalte
        setFont(FONTS.heading);
        setColor(COLORS.primary);
        const titleLines = pdf.splitTextToSize(slot.title, 65);
        pdf.text(titleLines[0], margin + 50, yPosition + 3);
        
        if (titleLines.length > 1) {
          setFont(FONTS.small);
          pdf.text(titleLines[1], margin + 50, yPosition + 8);
        }
        
        // DETAILS-Spalte
        setFont(FONTS.small);
        setColor(COLORS.text);
        let detailsY = yPosition + 3;
        
        if (slot.category) {
          const categoryLabels = {
            work: 'Arbeit',
            personal: 'Persoenlich',
            health: 'Gesundheit',
            other: 'Sonstiges'
          };
          pdf.text(`Kategorie: ${categoryLabels[slot.category]}`, margin + 120, detailsY);
          detailsY += 4;
        }
        
        if (slot.priority) {
          const priorityLabels = {
            low: 'Niedrig',
            medium: 'Mittel',
            high: 'Hoch'
          };
          const priorityColors = {
            low: COLORS.light,
            medium: [234, 179, 8],
            high: [239, 68, 68]
          };
          setColor(priorityColors[slot.priority] || COLORS.text);
          pdf.text(`Prioritaet: ${priorityLabels[slot.priority]}`, margin + 120, detailsY);
          detailsY += 4;
          setColor(COLORS.text);
        }
        
        if (slot.description && slot.description.trim()) {
          const descLines = pdf.splitTextToSize(slot.description, 50);
          pdf.text(descLines[0], margin + 120, detailsY);
          if (descLines.length > 1) {
            pdf.text('...', margin + 120 + pdf.getTextWidth(descLines[0]), detailsY);
          }
        }
        
        yPosition += taskHeight;
      });
    }
    
    yPosition += SPACING.section;
    
    // === STATISTIKEN SECTION ===
    checkPageBreak(30);
    drawLine(yPosition, COLORS.border);
    yPosition += SPACING.section;
    
    setFont(FONTS.subtitle);
    setColor(COLORS.primary);
    pdf.text('STATISTIKEN', margin, yPosition);
    yPosition += SPACING.section;
    
    // Statistiken in Boxen
    const statsBoxWidth = (contentWidth - 20) / 4;
    const statsData = [
      { label: 'Gesamt', value: totalSlots.toString(), color: COLORS.text },
      { label: 'Geplant', value: occupiedSlots.length.toString(), color: [34, 197, 94] },
      { label: 'Verfuegbar', value: (totalSlots - occupiedSlots.length).toString(), color: COLORS.accent },
      { label: 'Produktivitaet', value: `${productivity}%`, color: [168, 85, 247] }
    ];
    
    statsData.forEach((stat, index) => {
      const x = margin + (index * (statsBoxWidth + 5));
      drawBox(x, yPosition - 3, statsBoxWidth, 15, [249, 250, 251]);
      
      setFont(FONTS.body);
      setColor(stat.color);
      const valueWidth = pdf.getTextWidth(stat.value);
      pdf.text(stat.value, x + (statsBoxWidth - valueWidth) / 2, yPosition + 3);
      
      setFont(FONTS.small);
      setColor(COLORS.light);
      const labelWidth = pdf.getTextWidth(stat.label);
      pdf.text(stat.label, x + (statsBoxWidth - labelWidth) / 2, yPosition + 8);
    });
    
    // === FOOTER ===
    const footerY = pageHeight - 15;
    drawLine(footerY - 5, COLORS.border);
    
    setFont(FONTS.caption);
    setColor(COLORS.light);
    pdf.text(`Erstellt mit Ultra Day Planner`, margin, footerY);
    
    // Seitenzahlen
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      setFont(FONTS.caption);
      setColor(COLORS.light);
      const pageText = `Seite ${i} von ${pageCount}`;
      const pageWidth_local = pdf.internal.pageSize.getWidth();
      const pageTextWidth = pdf.getTextWidth(pageText);
      pdf.text(pageText, pageWidth_local - margin - pageTextWidth, footerY);
    }
    
    // PDF speichern
    const fileName = `Tagesplan_${currentDate.toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  },

  // Alternative: Screenshot-basierter Export
  exportScreenshotToPDF: async (elementId: string, filename: string = 'tagesplan.pdf') => {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element nicht gefunden');
    }
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0c0c0c'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(filename);
    } catch (error) {
      console.error('Fehler beim PDF-Export:', error);
      throw error;
    }
  }
};