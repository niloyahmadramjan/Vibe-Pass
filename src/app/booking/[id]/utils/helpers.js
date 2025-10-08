import { seatSections } from './seatData';

// Helper: get section by seat id
export function getSeatSection(seat) {
  for (const section of seatSections) {
    for (const row of section.rows) {
      if (row.seats.includes(seat)) return section;
    }
  }
  return null;
}

// Helper: format countdown timer
export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
}

// Helper: get next 7 days
export function getDateOptions() {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    dates.push({
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
    });
  }
  return dates;
}
