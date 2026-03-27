// ==========================================
// FitnessDesk - Complete Mock Data
// ==========================================

// --- USERS ---
// --- CLASSES ---
// --- WORKOUT PLANS ---
export const mockWorkoutPlans = [
  {
    id: 'wp1',
    name: 'Beginner Full Body',
    trainerId: 'u3',
    trainerName: 'Mike Thompson',
    level: 'Beginner',
    duration: '4 Weeks',
    description: 'Perfect for those just starting their fitness journey.',
    exercises: [
      { name: 'Push-ups', sets: 3, reps: '10-12', rest: '60s' },
      { name: 'Bodyweight Squats', sets: 3, reps: '15', rest: '60s' },
      { name: 'Dumbbell Rows', sets: 3, reps: '10', rest: '60s' },
      { name: 'Plank', sets: 3, reps: '30s hold', rest: '45s' },
      { name: 'Lunges', sets: 3, reps: '12 each', rest: '60s' },
      { name: 'Dumbbell Press', sets: 3, reps: '10', rest: '60s' },
    ],
  },
  {
    id: 'wp2',
    name: 'Advanced Hypertrophy',
    trainerId: 'u3',
    trainerName: 'Mike Thompson',
    level: 'Advanced',
    duration: '8 Weeks',
    description: 'Muscle-building program with progressive overload principles.',
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, reps: '8-10', rest: '90s' },
      { name: 'Barbell Squat', sets: 4, reps: '6-8', rest: '120s' },
      { name: 'Deadlift', sets: 4, reps: '5-6', rest: '120s' },
      { name: 'Overhead Press', sets: 4, reps: '8-10', rest: '90s' },
      { name: 'Barbell Rows', sets: 4, reps: '8-10', rest: '90s' },
      { name: 'Weighted Dips', sets: 3, reps: '10-12', rest: '75s' },
    ],
  },
  {
    id: 'wp3',
    name: 'Fat Burn HIIT',
    trainerId: 'u4',
    trainerName: 'Emily Chen',
    level: 'Intermediate',
    duration: '6 Weeks',
    description: 'High-intensity program designed for maximum fat loss.',
    exercises: [
      { name: 'Burpees', sets: 4, reps: '15', rest: '30s' },
      { name: 'Mountain Climbers', sets: 4, reps: '20 each', rest: '30s' },
      { name: 'Jump Squats', sets: 4, reps: '15', rest: '30s' },
      { name: 'Kettlebell Swings', sets: 4, reps: '20', rest: '30s' },
      { name: 'Box Jumps', sets: 4, reps: '12', rest: '45s' },
      { name: 'Battle Ropes', sets: 4, reps: '30s', rest: '30s' },
    ],
  },
];

// --- DIET PLANS ---
export const mockDietPlans = [
  {
    id: 'dp1',
    name: 'Muscle Building Diet',
    trainerId: 'u3',
    trainerName: 'Mike Thompson',
    calories: 2800,
    goal: 'Muscle Gain',
    meals: [
      { time: '7:00 AM', name: 'Breakfast', items: 'Oatmeal + Banana + Protein Shake + 4 Eggs', calories: 650 },
      { time: '10:00 AM', name: 'Snack', items: 'Greek Yogurt + Mixed Nuts + Berries', calories: 350 },
      { time: '1:00 PM', name: 'Lunch', items: 'Grilled Chicken Breast + Brown Rice + Steamed Broccoli', calories: 700 },
      { time: '4:00 PM', name: 'Pre-Workout', items: 'Protein Bar + Apple + Peanut Butter', calories: 400 },
      { time: '7:00 PM', name: 'Dinner', items: 'Salmon + Sweet Potato + Mixed Salad', calories: 600 },
      { time: '9:00 PM', name: 'Evening', items: 'Casein Protein + Cottage Cheese', calories: 300 },
    ],
  },
  {
    id: 'dp2',
    name: 'Fat Loss Diet',
    trainerId: 'u4',
    trainerName: 'Emily Chen',
    calories: 1800,
    goal: 'Weight Loss',
    meals: [
      { time: '7:00 AM', name: 'Breakfast', items: 'Egg Whites + Avocado Toast + Green Smoothie', calories: 400 },
      { time: '10:00 AM', name: 'Snack', items: 'Almonds + Green Apple', calories: 200 },
      { time: '1:00 PM', name: 'Lunch', items: 'Grilled Fish + Quinoa + Mixed Veggies', calories: 500 },
      { time: '4:00 PM', name: 'Snack', items: 'Protein Shake + Celery Sticks', calories: 200 },
      { time: '7:00 PM', name: 'Dinner', items: 'Turkey Breast + Cauliflower Rice + Spinach Salad', calories: 450 },
    ],
  },
];

// --- ATTENDANCE ---
export const mockAttendance = [
  { id: 'a1', memberId: 'u6', memberName: 'John Doe', date: '2024-12-20', checkIn: '06:15 AM', checkOut: '08:30 AM', method: 'QR Code', status: 'present' },
  { id: 'a2', memberId: 'u7', memberName: 'Jane Smith', date: '2024-12-20', checkIn: '07:00 AM', checkOut: '09:00 AM', method: 'Manual', status: 'present' },
  { id: 'a3', memberId: 'u8', memberName: 'Alex Rivera', date: '2024-12-20', checkIn: '05:30 PM', checkOut: '07:45 PM', method: 'QR Code', status: 'present' },
  { id: 'a4', memberId: 'u10', memberName: 'Robert Brown', date: '2024-12-20', checkIn: '06:00 PM', checkOut: '08:15 PM', method: 'QR Code', status: 'present' },
  { id: 'a5', memberId: 'u9', memberName: 'Lisa Wang', date: '2024-12-20', checkIn: null, checkOut: null, method: null, status: 'absent' },
  { id: 'a6', memberId: 'u6', memberName: 'John Doe', date: '2024-12-19', checkIn: '06:10 AM', checkOut: '08:20 AM', method: 'QR Code', status: 'present' },
  { id: 'a7', memberId: 'u7', memberName: 'Jane Smith', date: '2024-12-19', checkIn: '07:05 AM', checkOut: '08:45 AM', method: 'Manual', status: 'present' },
  { id: 'a8', memberId: 'u8', memberName: 'Alex Rivera', date: '2024-12-19', checkIn: null, checkOut: null, method: null, status: 'absent' },
  { id: 'a9', memberId: 'u6', memberName: 'John Doe', date: '2024-12-18', checkIn: '06:20 AM', checkOut: '08:40 AM', method: 'Manual', status: 'present' },
  { id: 'a10', memberId: 'u10', memberName: 'Robert Brown', date: '2024-12-18', checkIn: '06:00 PM', checkOut: '08:00 PM', method: 'QR Code', status: 'present' },
];

// --- PAYMENTS ---
// --- SUBSCRIPTION PLANS ---
export const mockSubscriptionPlans = [
  {
    id: 'sp1',
    name: 'Basic',
    price: 49.99,
    period: 'month',
    features: [
      'Access to gym floor',
      'Basic equipment usage',
      'Locker room access',
      '2 group classes/week',
      'Mobile app access',
    ],
    color: 'from-primary-500 to-accent-emerald',
    popular: false,
  },
  {
    id: 'sp2',
    name: 'Premium',
    price: 99.99,
    period: 'month',
    features: [
      'Full gym access 24/7',
      'All equipment & machines',
      'Unlimited group classes',
      'Personal workout plan',
      'Diet plan consultation',
      'Sauna & spa access',
      'Mobile app access',
    ],
    color: 'from-primary-500 to-accent-emerald',
    popular: true,
  },
  {
    id: 'sp3',
    name: 'Elite',
    price: 149.99,
    period: 'month',
    features: [
      'Everything in Premium',
      '3 PT sessions/week',
      'Custom nutrition plan',
      'Body composition analysis',
      'Priority class booking',
      'Guest passes (2/month)',
      'Merchandise discounts',
      'VIP lounge access',
    ],
    color: 'from-primary-500 to-accent-emerald',
    popular: false,
  },
];

// --- NOTIFICATIONS ---
// --- DASHBOARD STATS ---
// --- RECENT ACTIVITY ---
export const mockRecentActivity = [
  { id: 'ra1', action: 'New member signup', user: 'Robert Brown', time: '10 min ago', icon: '👤', color: 'text-emerald-400' },
  { id: 'ra2', action: 'Payment received', user: 'John Doe', time: '25 min ago', icon: '💳', color: 'text-primary-400' },
  { id: 'ra3', action: 'Class completed', user: 'Morning Yoga Flow', time: '1 hour ago', icon: '✅', color: 'text-blue-400' },
  { id: 'ra4', action: 'Workout plan uploaded', user: 'Mike Thompson', time: '2 hours ago', icon: '📋', color: 'text-amber-400' },
  { id: 'ra5', action: 'Membership renewed', user: 'Jane Smith', time: '3 hours ago', icon: '🔄', color: 'text-violet-400' },
  { id: 'ra6', action: 'QR check-in', user: 'Alex Rivera', time: '4 hours ago', icon: '📱', color: 'text-cyan-400' },
];

// --- FEATURES FOR LANDING ---
export const landingFeatures = [
  {
    icon: '📅',
    title: 'Class Scheduling',
    description: 'Book and manage group fitness classes with real-time availability tracking.',
  },
  {
    icon: '🏋️',
    title: 'Workout Plans',
    description: 'Custom workout programs designed by certified trainers for your goals.',
  },
  {
    icon: '🥗',
    title: 'Diet Plans',
    description: 'Personalized nutrition guidance to complement your training regimen.',
  },
  {
    icon: '📊',
    title: 'Progress Tracking',
    description: 'Track your attendance, workouts, and body metrics over time.',
  },
  {
    icon: '💳',
    title: 'Easy Payments',
    description: 'Secure payment processing with Stripe and PayPal integration.',
  },
  {
    icon: '📱',
    title: 'QR Attendance',
    description: 'Quick check-in/check-out with QR code scanning technology.',
  },
];

// --- TESTIMONIALS ---

