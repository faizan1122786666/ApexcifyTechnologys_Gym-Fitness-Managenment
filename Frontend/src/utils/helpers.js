export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export const getPercentage = (current, total) => {
  return Math.round((current / total) * 100);
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export const getDaysRemaining = (dateString) => {
  const dueDate = new Date(dateString);
  const today = new Date();
  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const generateQRData = (memberId) => {
  return JSON.stringify({
    memberId,
    timestamp: new Date().toISOString(),
    type: 'gym-checkin',
  });
};

export const getRoleColor = (role) => {
  switch (role) {
    case 'admin': return 'text-amber-400 bg-amber-500/20';
    case 'trainer': return 'text-blue-400 bg-blue-500/20';
    case 'member': return 'text-emerald-400 bg-emerald-500/20';
    default: return 'text-gray-400 bg-gray-500/20';
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'badge-success';
    case 'inactive': return 'badge-danger';
    case 'completed': return 'badge-success';
    case 'overdue': return 'badge-danger';
    case 'pending': return 'badge-warning';
    case 'present': return 'badge-success';
    case 'absent': return 'badge-danger';
    default: return 'badge-info';
  }
};
