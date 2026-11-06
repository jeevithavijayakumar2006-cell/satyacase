// SLA Countdown & Status Helper Utilities

export function getSlaRemainingTime(slaExpiresAt) {
  if (!slaExpiresAt) return { hours: 0, minutes: 0, seconds: 0, isBreached: false, formattedStr: '00h 00m 00s', percentRemaining: 0 };
  
  const expiryTime = new Date(slaExpiresAt).getTime();
  const now = Date.now();
  const diff = expiryTime - now;

  if (diff <= 0) {
    const overdueMs = Math.abs(diff);
    const hours = Math.floor(overdueMs / (1000 * 60 * 60));
    const minutes = Math.floor((overdueMs % (1000 * 60 * 60)) / (1000 * 60));
    return {
      hours,
      minutes,
      seconds: 0,
      isBreached: true,
      formattedStr: `SLA BREACHED (${hours}h ${minutes}m overdue)`,
      percentRemaining: 0,
    };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  // Assuming 24 hour default total for percentage bar
  const totalSlaMs = 24 * 60 * 60 * 1000;
  const percentRemaining = Math.max(0, Math.min(100, Math.round((diff / totalSlaMs) * 100)));

  const hStr = String(hours).padStart(2, '0');
  const mStr = String(minutes).padStart(2, '0');
  const sStr = String(seconds).padStart(2, '0');

  return {
    hours,
    minutes,
    seconds,
    isBreached: false,
    formattedStr: `${hStr}h ${mStr}m ${sStr}s remaining`,
    percentRemaining,
  };
}

export function getStatusTheme(status) {
  switch (status) {
    case 'CLOSED':
    case 'APPROVED':
      return {
        label: 'Resolved & Closed',
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        dotBg: 'bg-emerald-400',
      };
    case 'RESOLUTION_SUBMITTED':
      return {
        label: 'Verification Pending',
        bg: 'bg-purple-500/15',
        text: 'text-purple-400',
        border: 'border-purple-500/30',
        dotBg: 'bg-purple-400',
      };
    case 'IN_PROGRESS':
      return {
        label: 'Under Officer Investigation',
        bg: 'bg-blue-500/15',
        text: 'text-blue-400',
        border: 'border-blue-500/30',
        dotBg: 'bg-blue-400',
      };
    case 'BLOCKED':
      return {
        label: 'Resolution Blocked',
        bg: 'bg-red-500/15',
        text: 'text-red-400',
        border: 'border-red-500/30',
        dotBg: 'bg-red-400',
      };
    default:
      return {
        label: 'Open Grievance',
        bg: 'bg-amber-500/15',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        dotBg: 'bg-amber-400',
      };
  }
}
