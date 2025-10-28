# Hotel Reservation System

A hotel amenity reservation system (tennis court, swimming pool, gym, etc.)

## 📋 Description

A full-featured web application for managing hotel amenity reservations. The system consists of:
- **Backend API** (NestJS) - REST API server
- **Frontend UI** (Angular) - User interface
- **MongoDB** - Database
- **Docker** - Containerization for easy deployment

## 🏗️ Project Structure

```
red-api/
├── apps/
│   ├── api/                    # Backend API (NestJS)
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── amenity/    # Amenities (tennis court, pool, etc.)
│   │   │   │   ├── reservation/# Reservations
│   │   │   │   ├── user/       # Users
│   │   │   │   └── csv-parser/ # CSV parser
│   │   │   ├── common/         # Shared utilities and guards
│   │   │   └── config/         # Configuration
│   │   └── main.ts
│   └── ui/                     # Frontend (Angular)
│       └── src/
│           ├── app/
│           │   ├── components/ # Angular components
│           │   └── services/   # API services
│           └── main.ts
├── libs/
│   └── shared/                 # Shared interfaces and types
├── docker-compose.yml          # Docker Compose configuration
├── Dockerfile.api              # API Dockerfile
├── Dockerfile.ui               # UI Dockerfile
└── SEEDING.md                  # Database initialization documentation
```

### Backend API Modules

- **Amenity** - Manage amenities (pool, tennis court, etc.)
- **User** - User management and authentication
- **Reservation** - Reservation management
- **CSV Parser** - CSV file upload and parsing

### Frontend Components

- **Login** - Login page
- **Header** - Navigation header
- **Reservation Search** - Search and view reservations
- **CSV Parser** - CSV file upload

## 🚀 Installation and Setup

### Prerequisites

- **Node.js** 20.x or higher
- **npm** or **yarn**
- **Docker** and **Docker Compose** (for containerized deployment)
- **MongoDB** 7.x (if running without Docker)

### Local Development

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Run in Development Mode

Run all applications simultaneously (API + UI):
```bash
npm run dev
```

Or run applications separately:

```bash
# Run UI only
npm run serve:ui

# Run API only
npm run serve:api
```

**Application Access:**
- Frontend UI: http://localhost:4200
- Backend API: http://localhost:3333
- MongoDB: localhost:27017 (if running locally)

#### 3. Build the Project

```bash
npm run build
```

## 🧪 Testing

### Run All Tests

```bash
npm run test
```

### API Tests

```bash
npm run test:api
```

Run tests with code coverage:
```bash
npm run test:api:coverage
```

Run tests in watch mode:
```bash
npm run test:api:watch
```

### UI Tests

```bash
npm run test:ui
```

## 🐳 Running with Docker

### Using Docker Compose

Easiest way to run the entire application in containers:

```bash
docker-compose up
```

Or in the background:

```bash
docker-compose up -d
```

After startup, access the application at:
- **Frontend UI**: http://localhost:4200
- **Backend API**: http://localhost:3333
- **MongoDB**: localhost:27017

### Stopping Containers

```bash
docker-compose down
```

Stop and remove all data (volumes):
```bash
docker-compose down -v
```

### Database Initialization

On first startup, MongoDB is automatically initialized with test data:
- 5 amenities (pool, tennis court, etc.)
- 3 users (john_doe, jane_smith, admin)
- 20 reservations

Password for all test users: `password123`

For more details on database initialization, see [SEEDING.md](./SEEDING.md)

### Useful Docker Commands

View logs:
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs api
docker-compose logs ui
docker-compose logs mongodb
```

View logs in real-time:
```bash
docker-compose logs -f
```

Rebuild images:
```bash
docker-compose build
docker-compose up -d
```

Execute commands in containers:
```bash
# Connect to MongoDB
docker exec -it red-api-mongodb mongosh hotel-reservation

# Execute command in API container
docker exec -it red-api-server sh
```

## 📚 Available Commands

### Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Run API and UI in development mode |
| `npm run serve:ui` | Run UI only |
| `npm run serve:api` | Run API only |
| `npm run build` | Build all applications |

### Testing Commands

| Command | Description |
|---------|-------------|
| `npm run test` | Run all tests |
| `npm run test:api` | Run API tests |
| `npm run test:api:watch` | Run API tests in watch mode |
| `npm run test:api:coverage` | Run API tests with code coverage |
| `npm run test:ui` | Run UI tests |

### Code Quality Commands

| Command | Description |
|---------|-------------|
| `npm run lint` | Lint code |
| `npm run format` | Format code |

### Docker Commands

| Command | Description |
|---------|-------------|
| `docker-compose up` | Start all services |
| `docker-compose up -d` | Start in background mode |
| `docker-compose down` | Stop services |
| `docker-compose down -v` | Stop and remove volumes |
| `docker-compose logs` | View logs |
| `docker-compose logs -f` | View logs in real-time |
| `docker-compose build` | Rebuild images |

## 🔧 Configuration

### Environment Variables

**API** (in Docker):
- `PORT`: 3000
- `NODE_ENV`: production
- `MONGODB_URI`: mongodb://mongodb:27017/hotel-reservation

**MongoDB** (in Docker):
- Port: 27017
- Database: hotel-reservation
- Data is persisted in `mongodb_data` volume

### Proxy Configuration

UI proxies requests to API through configuration in `apps/ui/proxy.conf.json`:
```json
{
  "/api": {
    "target": "http://localhost:3333",
    "secure": false
  }
}
```

## 📖 API Endpoints

Detailed API documentation: [API_EXAMPLES.md](./API_EXAMPLES.md)

### Main endpoints:

- `GET /api` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/reservations/by-day` - Day reservations
- `GET /api/reservations/by-user` - User reservations
- `POST /api/csv-parser/upload` - CSV file upload

## 🛠️ Technologies

### Backend
- **NestJS** - Node.js framework
- **MongoDB** with **Mongoose** - Database
- **Express** - Web server
- **bcrypt** - Password hashing
- **class-validator** - Data validation
- **express-session** - Session management

### Frontend
- **Angular** 20.x - Framework
- **RxJS** - Reactive programming
- **Axios** - HTTP client
- **SCSS** - Styling

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Container orchestration
- **Nginx** - Web server for production UI

### Testing
- **Jest** - Testing framework
- **Playwright** - E2E testing

### Build Tools
- **Nx** - Monorepo
- **Webpack** - Build tool
- **TypeScript** - Programming language

## 📝 Additional Documentation

- [SEEDING.md](./SEEDING.md) - Database initialization
- [API_EXAMPLES.md](./API_EXAMPLES.md) - API usage examples
- [apps/api/README.md](./apps/api/README.md) - API documentation

## 🤝 Contributing

1. Create a branch for a new feature
2. Make your changes
3. Run tests: `npm run test`
4. Run linter: `npm run lint`
5. Create a Pull Request

## 📄 License

ISC

