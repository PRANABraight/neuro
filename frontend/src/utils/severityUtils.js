export function getSeverityColor(severity) {
  switch (severity) {
    case 'Critical': return 'bg-red-600';
    case 'High': return 'bg-orange-500';
    case 'Medium': return 'bg-yellow-400';
    case 'Low': return 'bg-green-500';
    default: return 'bg-gray-300';
  }
}

export function getSeverityTextColor(severity) {
  switch (severity) {
    case 'Critical': return 'text-red-600';
    case 'High': return 'text-orange-500';
    case 'Medium': return 'text-yellow-600';
    case 'Low': return 'text-green-600';
    default: return 'text-gray-600';
  }
}

export function getSeverityLevel(probability) {
  if (probability >= 0.9) return 'Critical';
  if (probability >= 0.7) return 'High';
  if (probability >= 0.4) return 'Medium';
  return 'Low';
}

export const getSeverityBadgeColor = (severity) => {
  switch (severity) {
    case 'Critical': return 'bg-red-100 text-red-800';
    case 'High': return 'bg-orange-100 text-orange-800';
    case 'Medium': return 'bg-yellow-100 text-yellow-800';
    case 'Low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const severityLevels = ['Critical', 'High', 'Medium', 'Low'];