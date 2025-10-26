# 🚀 NestJS API Architecture

Clean CRUD architecture with Controllers, Services, and Repositories pattern.

---

## 📁 Project Structure

```
apps/api/src/
├── app/
│   ├── app.module.ts          # Main application module
│   ├── app.controller.ts      # Root controller
│   └── app.service.ts         # Root service
│
├── common/                     # Shared utilities
│   ├── interfaces/
│   │   ├── base-entity.interface.ts      # Base entity with id, timestamps
│   │   └── repository.interface.ts       # Generic repository interface
│   ├── dto/
│   │   └── base-response.dto.ts          # Standardized API response
│   └── repositories/
│       └── base.repository.ts            # Abstract base repository
│
├── modules/                    # Feature modules
│   └── example/               # Example CRUD module
│       ├── controllers/
│       │   └── example.controller.ts     # HTTP endpoints
│       ├── services/
│       │   └── example.service.ts        # Business logic
│       ├── repositories/
│       │   └── example.repository.ts     # Data access layer
│       ├── entities/
│       │   └── example.entity.ts         # Data model
│       ├── dto/
│       │   ├── create-example.dto.ts     # Create DTO
│       │   └── update-example.dto.ts     # Update DTO
│       └── example.module.ts             # Module definition
│
└── main.ts                     # Application entry point
```

---

## 🏗️ Architecture Layers

### 1. **Controller Layer**
- Handles HTTP requests/responses
- Validates input data
- Delegates business logic to services
- Returns standardized responses

**Example:**
```typescript
@Controller('examples')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get()
  async findAll(): Promise<BaseResponseDto<ExampleEntity[]>> {
    const items = await this.exampleService.findAll();
    return BaseResponseDto.ok(items);
  }
}
```

### 2. **Service Layer**
- Contains business logic
- Orchestrates operations
- Handles errors and exceptions
- Calls repository methods

**Example:**
```typescript
@Injectable()
export class ExampleService {
  constructor(private readonly exampleRepository: ExampleRepository) {}

  async findAll(): Promise<ExampleEntity[]> {
    return this.exampleRepository.findAll();
  }
}
```

### 3. **Repository Layer**
- Data access abstraction
- CRUD operations
- In-memory storage (can be replaced with DB)
- Extends BaseRepository for common operations

**Example:**
```typescript
@Injectable()
export class ExampleRepository extends BaseRepository<ExampleEntity> {
  async findByName(name: string): Promise<ExampleEntity[]> {
    return this.items.filter(item => item.name.includes(name));
  }
}
```

---

## 🔄 CRUD Operations

### Base Repository Methods

All repositories inherit these methods from `BaseRepository`:

| Method | Description | Returns |
|--------|-------------|---------|
| `findAll()` | Get all items | `Promise<T[]>` |
| `findById(id)` | Get item by ID | `Promise<T \| null>` |
| `create(data)` | Create new item | `Promise<T>` |
| `update(id, data)` | Update existing item | `Promise<T \| null>` |
| `delete(id)` | Delete item | `Promise<boolean>` |

---

## 📝 Creating New Module

### Step 1: Generate Module Structure

Create folder structure:
```
modules/your-module/
├── controllers/
├── services/
├── repositories/
├── entities/
├── dto/
└── your-module.module.ts
```

### Step 2: Define Entity

```typescript
// entities/your-entity.entity.ts
import {BaseEntity} from '../../../common/interfaces/base-entity.interface';

export interface YourEntity extends BaseEntity {
  name: string;
  // Add your fields
}
```

### Step 3: Create DTOs

```typescript
// dto/create-your.dto.ts
export class CreateYourDto {
  name: string;
  // Add your fields
}

// dto/update-your.dto.ts
export class UpdateYourDto {
  name?: string;
  // Add your fields (all optional)
}
```

### Step 4: Create Repository

```typescript
// repositories/your.repository.ts
import {Injectable} from '@nestjs/common';
import {BaseRepository} from '../../../common/repositories/base.repository';
import {YourEntity} from '../entities/your.entity';

@Injectable()
export class YourRepository extends BaseRepository<YourEntity> {
  // Add custom methods if needed
}
```

### Step 5: Create Service

```typescript
// services/your.service.ts
import {Injectable, NotFoundException} from '@nestjs/common';
import {YourRepository} from '../repositories/your.repository';
import {CreateYourDto} from '../dto/create-your.dto';
import {UpdateYourDto} from '../dto/update-your.dto';

@Injectable()
export class YourService {
  constructor(private readonly yourRepository: YourRepository) {}

  async findAll() {
    return this.yourRepository.findAll();
  }

  async findById(id: string) {
    const item = await this.yourRepository.findById(id);
    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    return item;
  }

  async create(createDto: CreateYourDto) {
    return this.yourRepository.create(createDto);
  }

  async update(id: string, updateDto: UpdateYourDto) {
    const updated = await this.yourRepository.update(id, updateDto);
    if (!updated) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.yourRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
  }
}
```

### Step 6: Create Controller

```typescript
// controllers/your.controller.ts
import {Controller, Get, Post, Put, Delete, Body, Param} from '@nestjs/common';
import {YourService} from '../services/your.service';
import {CreateYourDto} from '../dto/create-your.dto';
import {UpdateYourDto} from '../dto/update-your.dto';
import {BaseResponseDto} from '../../../common/dto/base-response.dto';

@Controller('your-endpoint')
export class YourController {
  constructor(private readonly yourService: YourService) {}

  @Get()
  async findAll() {
    const items = await this.yourService.findAll();
    return BaseResponseDto.ok(items);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const item = await this.yourService.findById(id);
    return BaseResponseDto.ok(item);
  }

  @Post()
  async create(@Body() createDto: CreateYourDto) {
    const item = await this.yourService.create(createDto);
    return BaseResponseDto.ok(item, 'Created successfully');
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateYourDto) {
    const item = await this.yourService.update(id, updateDto);
    return BaseResponseDto.ok(item, 'Updated successfully');
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.yourService.delete(id);
    return BaseResponseDto.ok(null, 'Deleted successfully');
  }
}
```

### Step 7: Create Module

```typescript
// your-module.module.ts
import {Module} from '@nestjs/common';
import {YourController} from './controllers/your.controller';
import {YourService} from './services/your.service';
import {YourRepository} from './repositories/your.repository';

@Module({
  controllers: [YourController],
  providers: [YourService, YourRepository],
  exports: [YourService],
})
export class YourModule {}
```

### Step 8: Register in AppModule

```typescript
// app/app.module.ts
import {YourModule} from '../modules/your-module/your-module.module';

@Module({
  imports: [YourModule],
  // ...
})
export class AppModule {}
```

---

## 🧪 Testing Example Endpoints

### Start API
```bash
npm run serve:api
```

API runs on: http://localhost:3333

### Example Requests

**Create:**
```bash
curl -X POST http://localhost:3333/examples \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "description": "Test description"}'
```

**Get All:**
```bash
curl http://localhost:3333/examples
```

**Get By ID:**
```bash
curl http://localhost:3333/examples/{id}
```

**Update:**
```bash
curl -X PUT http://localhost:3333/examples/{id} \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated"}'
```

**Delete:**
```bash
curl -X DELETE http://localhost:3333/examples/{id}
```

**Search by Name:**
```bash
curl http://localhost:3333/examples?name=test
```

---

## 📦 Response Format

All endpoints return standardized response:

```typescript
{
  "success": true,
  "data": { /* your data */ },
  "message": "Optional success message"
}
```

Error response:
```typescript
{
  "success": false,
  "error": "Error message"
}
```

---

## 🔧 Next Steps

1. Replace in-memory storage with real database (TypeORM, Prisma, etc.)
2. Add validation decorators to DTOs (class-validator)
3. Add authentication/authorization
4. Add pagination, filtering, sorting
5. Add Swagger documentation
6. Add unit/integration tests

---

**Happy Coding! 🚀**
