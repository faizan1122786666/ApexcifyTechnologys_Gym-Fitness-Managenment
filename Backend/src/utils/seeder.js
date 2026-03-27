const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from Backend root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Class = require('../models/Class');
const connectDB = require('../config/db');

// ─── SEED DATA ──────────────────────────────────────────────

const adminUser = {
    name: 'Admin FitnessDesk',
    email: 'admin@fitnessdesk.com',
    password: 'admin123',
    role: 'admin',
};

const trainers = [
    {
        name: 'Sarah Johnson',
        email: 'sarah@fitnessdesk.com',
        password: 'trainer123',
        role: 'trainer',
        profilePic: '',
    },
    {
        name: 'Mike Rodriguez',
        email: 'mike@fitnessdesk.com',
        password: 'trainer123',
        role: 'trainer',
        profilePic: '',
    },
    {
        name: 'Emily Chen',
        email: 'emily@fitnessdesk.com',
        password: 'trainer123',
        role: 'trainer',
        profilePic: '',
    },
];

const sampleMember = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'member123',
    role: 'member',
};

const subscriptionPlans = [
    {
        name: 'Basic Plan',
        price: 29.99,
        period: 'month',
        features: [
            'Access to gym floor',
            'Locker room access',
            'Free Wi-Fi',
            'Basic fitness assessment',
        ],
        color: 'from-slate-500 to-gray-600',
        popular: false,
    },
    {
        name: 'Premium Plan',
        price: 49.99,
        period: 'month',
        features: [
            'Everything in Basic',
            'All group classes',
            'Personal trainer (1 session/week)',
            'Nutrition guidance',
            'Sauna & steam room',
        ],
        color: 'from-violet-600 to-indigo-600',
        popular: true,
    },
    {
        name: 'Elite Plan',
        price: 79.99,
        period: 'month',
        features: [
            'Everything in Premium',
            'Unlimited personal training',
            'Custom meal plans',
            'Priority class booking',
            'Guest passes (2/month)',
            'Exclusive member events',
        ],
        color: 'from-amber-500 to-orange-600',
        popular: false,
    },
    {
        name: 'Annual Basic',
        price: 299.99,
        period: 'year',
        features: [
            'Access to gym floor',
            'Locker room access',
            'Free Wi-Fi',
            'Basic fitness assessment',
            '2 months free vs monthly',
        ],
        color: 'from-emerald-500 to-teal-600',
        popular: false,
    },
];

// ─── SEED FUNCTIONS ─────────────────────────────────────────

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Subscription.deleteMany({});
        await Class.deleteMany({});

        console.log('🗑️  Cleared existing data');

        // Create admin
        const admin = await User.create(adminUser);
        console.log(`👑 Admin created: ${admin.email} (password: admin123)`);

        // Create trainers
        const createdTrainers = [];
        for (const t of trainers) {
            const trainer = await User.create(t);
            createdTrainers.push(trainer);
            console.log(`🏋️ Trainer created: ${trainer.email} (password: trainer123)`);
        }

        // Create sample member
        const member = await User.create(sampleMember);
        console.log(`👤 Member created: ${member.email} (password: member123)`);

        // Create subscription plans
        const createdPlans = await Subscription.insertMany(subscriptionPlans);
        console.log(`💎 ${createdPlans.length} subscription plans created`);

        // Create sample classes assigned to trainers
        const sampleClasses = [
            {
                className: 'Morning Yoga',
                description: 'Start your day with a rejuvenating yoga session focusing on flexibility and mindfulness.',
                trainer: createdTrainers[0]._id,
                schedule: { day: 'Monday', time: '07:00 AM' },
                capacity: 20,
                price: 0,
            },
            {
                className: 'HIIT Blast',
                description: 'High-intensity interval training to burn maximum calories in minimum time.',
                trainer: createdTrainers[1]._id,
                schedule: { day: 'Tuesday', time: '06:00 PM' },
                capacity: 15,
                price: 10,
            },
            {
                className: 'Strength Training',
                description: 'Build muscle and increase strength with guided weight training exercises.',
                trainer: createdTrainers[1]._id,
                schedule: { day: 'Wednesday', time: '05:00 PM' },
                capacity: 12,
                price: 15,
            },
            {
                className: 'Spin Class',
                description: 'High-energy indoor cycling workout set to motivating music.',
                trainer: createdTrainers[2]._id,
                schedule: { day: 'Thursday', time: '06:30 PM' },
                capacity: 25,
                price: 0,
            },
            {
                className: 'Pilates Core',
                description: 'Strengthen your core and improve posture with controlled Pilates movements.',
                trainer: createdTrainers[2]._id,
                schedule: { day: 'Friday', time: '08:00 AM' },
                capacity: 18,
                price: 0,
            },
            {
                className: 'Weekend Bootcamp',
                description: 'Full-body outdoor bootcamp combining cardio, strength, and agility drills.',
                trainer: createdTrainers[0]._id,
                schedule: { day: 'Saturday', time: '09:00 AM' },
                capacity: 30,
                price: 5,
            },
        ];

        const createdClasses = await Class.insertMany(sampleClasses);
        console.log(`📅 ${createdClasses.length} classes created`);

        console.log('\n✅ Database seeded successfully!\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  LOGIN CREDENTIALS FOR TESTING:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  👑 Admin:   admin@fitnessdesk.com / admin123');
        console.log('  🏋️ Trainer: sarah@fitnessdesk.com / trainer123');
        console.log('  🏋️ Trainer: mike@fitnessdesk.com  / trainer123');
        console.log('  🏋️ Trainer: emily@fitnessdesk.com / trainer123');
        console.log('  👤 Member:  john@example.com      / member123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
};

const destroyDatabase = async () => {
    try {
        await connectDB();

        await User.deleteMany({});
        await Subscription.deleteMany({});
        await Class.deleteMany({});

        console.log('🗑️  All data destroyed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Destroy failed:', error.message);
        process.exit(1);
    }
};

// Run with: node src/utils/seeder.js
// Destroy with: node src/utils/seeder.js -d
if (process.argv[2] === '-d') {
    destroyDatabase();
} else {
    seedDatabase();
}
