// composables/useWeekRange.ts
export function useWeekRange() {
  function getWeekRange(date: Date = new Date()) {
    const current = new Date(date);
    const dayOfWeek = current.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    
    const monday = new Date(current);
    monday.setDate(current.getDate() + mondayOffset);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    return { monday, sunday };
  }

  function formatDateCzech(date: Date): string {
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  }

  function getWeekRangeFormatted(date: Date = new Date()) {
    const { monday, sunday } = getWeekRange(date);
    return {
      monday: formatDateCzech(monday),
      sunday: formatDateCzech(sunday),
    };
  }

  return {
    getWeekRange,
    formatDateCzech,
    getWeekRangeFormatted,
  };
}