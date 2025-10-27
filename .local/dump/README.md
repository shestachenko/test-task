# MongoDB Initialization Scripts

This directory contains MongoDB initialization scripts that automatically populate the database when the container starts for the first time.

## How It Works

When MongoDB starts for the first time, it automatically executes all `.js` and `.sh` files in the `/docker-entrypoint-initdb.d/` directory (which is mounted from `./.local/dump/`).

## Scripts

- **`01-init-db.js`** - Main initialization script that seeds the database with:
  - **5 Amenities**: Swimming Pool, Tennis Court, Gym & Fitness Center, Conference Room, BBQ Area
  - **3 Users**: john_doe, jane_smith, admin (password: `password123`)
  - **20 Reservations**: Distributed across amenities and users for the next 20 days

## Naming Convention

Scripts are executed in alphabetical order. The `01-` prefix ensures this script runs first if more scripts are added later.

## Test Credentials

| Username | Password |
|----------|----------|
| john_doe | password123 |
| jane_smith | password123 |
| admin | password123 |

## Re-seeding

To re-seed the database:

```bash
# Stop and remove containers and volumes
docker-compose down -v

# Restart (this will trigger re-initialization)
docker-compose up -d
```

## Notes

- The script runs only once when the database is first created
- If the database already exists, these scripts are **not** executed
- The data persists in the `mongodb_data` volume between container restarts
- To force re-seeding, you must delete the volume (use `docker-compose down -v`)
