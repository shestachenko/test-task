// MongoDB initialization script
// This script runs automatically when the database is first initialized

print('Starting database initialization...');

// Switch to the hotel-reservation database
db = db.getSiblingDB('hotel-reservation');

// Clear existing collections (if any)
db.amenities.deleteMany({});
db.users.deleteMany({});
db.reservations.deleteMany({});

print('Cleared existing collections');

// ==========================================
// Seed Amenities (5 items)
// ==========================================
print('Inserting amenities...');

const amenities = [
  {name: 'Swimming Pool', createdAt: new Date(), updatedAt: new Date()},
  {name: 'Tennis Court', createdAt: new Date(), updatedAt: new Date()},
  {name: 'Gym & Fitness Center', createdAt: new Date(), updatedAt: new Date()},
  {name: 'Conference Room', createdAt: new Date(), updatedAt: new Date()},
  {name: 'BBQ Area', createdAt: new Date(), updatedAt: new Date()}
];

const insertResult = db.amenities.insertMany(amenities);
const amenityIds = insertResult.insertedIds;
print(`✓ Inserted ${amenities.length} amenities`);

// ==========================================
// Seed Users (3 items)
// Note: Passwords are pre-hashed with bcrypt
// All users have password: password123
// ==========================================
print('Inserting users...');

// Pre-hashed password for 'password123' using bcrypt with salt rounds 10
const hashedPassword = '$2b$10$8Lvidp8P0HyZ8ti1rNkXZ.E.2cUHpDP21DJ/HnerugH4i0LoBBlx6';

const users = [
  {
    username: 'john_doe',
    password: hashedPassword,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    username: 'jane_smith',
    password: hashedPassword,
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@example.com',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    username: 'admin',
    password: hashedPassword,
    first_name: 'Admin',
    last_name: 'User',
    email: 'admin@example.com',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

db.users.insertMany(users);
print(`✓ Inserted ${users.length} users (password: password123)`);

// ==========================================
// Seed Reservations (20 items)
// ==========================================
print('Inserting reservations...');

const reservations = [];

// Get inserted amenity IDs (convert to array)
const amenityIdArray = Object.values(amenityIds).map(id => id.toString());

// Get inserted user IDs (convert to array)
const userInsertResult = db.users.find({}, {_id: 1}).toArray();
const userIdArray = userInsertResult.map(user => user._id.toString());

// Generate reservations for the next 20 days
for (let i = 0; i < 20; i++) {
  const date = new Date();
  date.setDate(date.getDate() + i);
  
  // Set time to midnight
  date.setHours(0, 0, 0, 0);
  
  // Generate time slots (9 AM to 9 PM in 1-hour increments)
  const hour = 9 + (i % 12); // Cycle through 9 AM to 9 PM
  const startTime = hour * 60;
  const endTime = (hour + 1) * 60;
  
  const amenityIndex = i % 5; // Cycle through amenities 0-4
  const amenityId = amenityIdArray[amenityIndex]; // Use MongoDB ObjectId as string
  const userIndex = i % 3; // Cycle through users 0-2
  const userId = userIdArray[userIndex]; // Use MongoDB ObjectId as string
  
  reservations.push({
    amenityId: amenityId,
    userId: userId,
    startTime: startTime,
    endTime: endTime,
    date: date,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

db.reservations.insertMany(reservations);
print(`✓ Inserted ${reservations.length} reservations`);

// ==========================================
// Summary
// ==========================================
print('\n========================================');
print('Database initialization completed!');
print('========================================');
print('Summary:');
print(`  - Amenities: ${db.amenities.countDocuments()}`);
print(`  - Users: ${db.users.countDocuments()}`);
print(`  - Reservations: ${db.reservations.countDocuments()}`);
print('\nTest Credentials:');
print('  Username: john_doe, jane_smith, or admin');
print('  Password: password123');
print('========================================\n');
