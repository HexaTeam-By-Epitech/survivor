# JEB Incubator Frontend - API Routes Documentation

This document outlines all the API routes that the JEB Incubator frontend application expects from the backend server.

## Base Configuration

- **Development Backend URL**: `http://localhost:4242`
- **Production Backend URL**: `/api` (proxied)
- **Content-Type**: `application/json`
- **Authentication**: Bearer token in Authorization header

## Authentication Routes

### POST /auth/login
Login with user credentials
- **Request Body**: `{ email: string, password: string }`
- **Response**: `{ data: { token: string, user: User } }`

### POST /auth/signup
Register a new user account
- **Request Body**: `{ name: string, email: string, password: string }`
- **Response**: `{ data: { token: string, user: User } }`

## Startup Routes

### GET /startups
Get all startups with optional filtering
- **Query Parameters**:
  - `page?: number` - Page number for pagination
  - `limit?: number` - Number of items per page
  - `search?: string` - Search query to filter startups
- **Response**: `{ data: Startup[] }`

### GET /startups/:id
Get a specific startup by ID
- **Path Parameters**: `id: number`
- **Response**: `{ data: Startup }`

### POST /startups
Create a new startup (authenticated)
- **Request Body**: `Partial<Startup>`
- **Response**: `{ data: Startup }`

### PUT /startups/:id
Update an existing startup (authenticated)
- **Path Parameters**: `id: number`
- **Request Body**: `Partial<Startup>`
- **Response**: `{ data: Startup }`

### DELETE /startups/:id
Delete a startup (authenticated)
- **Path Parameters**: `id: number`
- **Response**: `{ data: void }`

## Partner Routes

### GET /partners
Get all partners with optional filtering
- **Query Parameters**:
  - `page?: number` - Page number for pagination
  - `limit?: number` - Number of items per page
  - `search?: string` - Search query to filter partners
- **Response**: `{ data: Partner[] }`

### GET /partners/:id
Get a specific partner by ID
- **Path Parameters**: `id: number`
- **Response**: `{ data: Partner }`

### POST /partners
Create a new partner (authenticated)
- **Request Body**: `Partial<Partner>`
- **Response**: `{ data: Partner }`

### PUT /partners/:id
Update an existing partner (authenticated)
- **Path Parameters**: `id: number`
- **Request Body**: `Partial<Partner>`
- **Response**: `{ data: Partner }`

### DELETE /partners/:id
Delete a partner (authenticated)
- **Path Parameters**: `id: number`
- **Response**: `{ data: void }`

## Project Routes

### GET /projects
Get all projects with optional filtering
- **Query Parameters**:
  - `page?: number` - Page number for pagination
  - `limit?: number` - Number of items per page
  - `startup_id?: number` - Filter by startup ID
- **Response**: `{ data: Project[] }`

### GET /projects/:id
Get a specific project by ID
- **Path Parameters**: `id: number`
- **Response**: `{ data: Project }`

### POST /projects
Create a new project (authenticated)
- **Request Body**: `Partial<Project>`
- **Response**: `{ data: Project }`

### PUT /projects/:id
Update an existing project (authenticated)
- **Path Parameters**: `id: number`
- **Request Body**: `Partial<Project>`
- **Response**: `{ data: Project }`

### DELETE /projects/:id
Delete a project (authenticated)
- **Path Parameters**: `id: number`
- **Response**: `{ data: void }`

## User Routes

### GET /users
Get all users with optional filtering
- **Query Parameters**:
  - `page?: number` - Page number for pagination
  - `limit?: number` - Number of items per page
  - `type?: 'founder' | 'admin' | 'investor'` - Filter by user type
- **Response**: `{ data: User[] }`

### GET /users/:id
Get a specific user by ID
- **Path Parameters**: `id: number`
- **Response**: `{ data: User }`

### POST /users
Create a new user (authenticated)
- **Request Body**: `Partial<User>`
- **Response**: `{ data: User }`

### PUT /users/:id
Update an existing user (authenticated)
- **Path Parameters**: `id: number`
- **Request Body**: `Partial<User>`
- **Response**: `{ data: User }`

### DELETE /users/:id
Delete a user (authenticated)
- **Path Parameters**: `id: number`
- **Response**: `{ data: void }`

## Event Routes

### GET /events
Get all events with optional filtering
- **Query Parameters**:
  - `page?: number` - Page number for pagination
  - `limit?: number` - Number of items per page
  - `upcoming?: boolean` - Filter for upcoming events only
- **Response**: `{ data: Event[] }`

### GET /events/:id
Get a specific event by ID
- **Path Parameters**: `id: number`
- **Response**: `{ data: Event }`

### POST /events
Create a new event (authenticated)
- **Request Body**: `Partial<Event>`
- **Response**: `{ data: Event }`

### PUT /events/:id
Update an existing event (authenticated)
- **Path Parameters**: `id: number`
- **Request Body**: `Partial<Event>`
- **Response**: `{ data: Event }`

### DELETE /events/:id
Delete an event (authenticated)
- **Path Parameters**: `id: number`
- **Response**: `{ data: void }`

## News Routes

### GET /news
Get all news with optional filtering
- **Query Parameters**:
  - `page?: number` - Page number for pagination
  - `limit?: number` - Number of items per page
  - `company_id?: number` - Filter by company ID
- **Response**: `{ data: News[] }`

### GET /news/:id
Get a specific news item by ID
- **Path Parameters**: `id: number`
- **Response**: `{ data: News }`

### POST /news
Create a new news item (authenticated)
- **Request Body**: `Partial<News>`
- **Response**: `{ data: News }`

### PUT /news/:id
Update an existing news item (authenticated)
- **Path Parameters**: `id: number`
- **Request Body**: `Partial<News>`
- **Response**: `{ data: News }`

### DELETE /news/:id
Delete a news item (authenticated)
- **Path Parameters**: `id: number`
- **Response**: `{ data: void }`

## Reference Data Routes

### GET /reference/sectors
Get all available sectors
- **Response**: `{ data: Sector[] }`

### GET /reference/legal-statuses
Get all available legal statuses
- **Response**: `{ data: LegalStatus[] }`

### GET /reference/partner-types
Get all available partner types
- **Response**: `{ data: PartnerType[] }`

### GET /reference/project-statuses
Get all available project statuses
- **Response**: `{ data: ProjectStatus[] }`

### GET /reference/event-categories
Get all available event categories
- **Response**: `{ data: EventCategory[] }`

### GET /reference/target-audiences
Get all available target audiences
- **Response**: `{ data: TargetAudience[] }`

### GET /reference/investor-types
Get all available investor types
- **Response**: `{ data: InvestorType[] }`

### GET /reference/investment-focus
Get all available investment focus areas
- **Response**: `{ data: InvestmentFocus[] }`

## Data Types

### Account
```typescript
interface Account {
  id: number;
  email: string;
  phone_number?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}
```

### Company (Base for Startups and Partners)
```typescript
interface Company {
  id: number;
  account_id: number;
  name: string;
  legal_status_id?: number;
  address?: string;
  phone_number?: string;
  description?: string;
  account?: Account;
  legal_status?: LegalStatus;
  social_medias?: SocialMedia[];
}
```

### Startup
```typescript
interface Startup {
  id: number;
  company_id: number;
  website_url?: string;
  company: Company;
}
```

### Partner
```typescript
interface Partner {
  id: number;
  company_id: number;
  partner_type_id: number;
  company: Company;
  partner_type: PartnerType;
}
```

### User
```typescript
interface User {
  id: number;
  account_id: number;
  first_name: string;
  last_name: string;
  role: 'founder' | 'admin' | 'investor';
  investor_type_id?: number;
  investment_focus_id?: number;
  account: Account;
  investor_type?: InvestorType;
  investment_focus?: InvestmentFocus;
}
```

### Project
```typescript
interface Project {
  id: number;
  startup_id: number;
  name: string;
  description?: string;
  status_id: number;
  start_date?: string;
  end_date?: string;
  startup: Startup;
  status: ProjectStatus;
}
```

### Event
```typescript
interface Event {
  id: number;
  name: string;
  description?: string;
  event_date: string;
  location?: string;
  category_id: number;
  target_audience_id: number;
  category: EventCategory;
  target_audience: TargetAudience;
}
```

### News
```typescript
interface News {
  id: number;
  company_id: number;
  title: string;
  content: string;
  publication_date: string;
  company: Company;
}
```

## Error Responses

All endpoints may return error responses in the following format:

```typescript
interface ApiErrorResponse {
  error: {
    message: string;
    code?: string;
    details?: any;
  };
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Authentication

The frontend expects JWT tokens for authenticated routes. Tokens should be stored in localStorage under the key `auth_token` and sent in the Authorization header:

```
Authorization: Bearer <token>
```

## Current Implementation Status

As of now, the frontend is configured to work primarily with **startups** data. The application will:

1. **Fetch startups** on initialization
2. **Display startups** in the discover page
3. **Search through startups** in the search page
4. **Show featured startups** on the home page

Partners, projects, events, news, and user management features are implemented in the API service but not actively used in the current UI components.
