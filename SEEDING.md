# Database Seeding

The application uses MongoDB's automatic initialization feature to seed the database with initial data.

## Overview

MongoDB automatically executes initialization scripts when the database is first created. These scripts are located in `.local/dump/` and are mounted into the container's `/docker-entrypoint-initdb.d/` directory.

## Seeded Data

### Amenities (5 items)
- Swimming Pool
- Tennis Court
- Gym & Fitness Center
- Conference Room
- BBQ Area

### Users (3 items)
All users share the password: `password123`

| Username | First Name | Last Name | Email |
|----------|-----------|-----------|-------|
| john_doe | John | Doe | john.doe@example.com |
| jane_smith | Jane | Smith | jane.smith@example.com |
| admin | Admin | User | admin@example.com |

### Reservations (20 items)
- Distributed across all amenities
- Spread across the next 20 days
- Time slots from 9 AM to 9 PM

## How It Works

1. The `docker-compose.yml` mounts `.local/dump/` to `/docker-entrypoint-initdb.d/`
2. When MongoDB starts for the first time, it executes all `.js` and `.sh` files in that directory
3. The `01-init-db.js` script populates the database with initial data
4. Subsequent container starts **do not** re-execute the scripts

## Usage

### First Time Setup

```bash
# Start the application (will automatically seed the database)
docker-compose up -d

# Check the logs to see the seeding process
docker logs red-api-mongodb
```

### Re-seeding the Database

If you want to reset the database and re-seed it:

```bash
# Stop containers and remove volumes
docker-compose down -v

# Restart (will trigger re-initialization)
docker-compose up -d
```

### Verifying Seeded Data

```bash
# Connect to MongoDB shell
docker exec -it red-api-mongodb mongosh hotel-reservation

# In the MongoDB shell:
db.amenities.countDocuments()     # Should return 5
db.users.countDocuments()         # Should return 3
db.reservations.countDocuments()  # Should return 20
```

## Configuration

The seeding is configured in `docker-compose.yml`:

```yaml
mongodb:
  volumes:
    - mongodb_data:/data/db
    - ./.local/dump:/docker-entrypoint-initdb.d
```

## Adding More Scripts

To add additional initialization scripts:

1. Create a new `.js` or `.sh` file in `.local/dump/`
2. Name it with a number prefix (e.g., `02-add-more-data.js`) to control execution order
3. Scripts run in alphabetical order
4. Restart with `docker-compose down -v && docker-compose up -d`

## Important Notes

- **Scripts run only once**: They execute only when the database is first created
- **Data persistence**: The `mongodb_data` volume preserves data between container restarts
- **No re-execution**: If you want to re-run the scripts, you must delete the volume
- **Script location**: All initialization scripts must be in `.local/dump/`
