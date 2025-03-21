
// Format time from database format
export const formatTime = (timeString: string): string => {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(':');
  const time = new Date();
  time.setHours(parseInt(hours, 10));
  time.setMinutes(parseInt(minutes, 10));
  return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
