# Apartment Maintenance and Rental Management System

A full-stack apartment management system built with Spring Boot and MySQL.

## Features
- Apartment management (CRUD)
- Tenant management with automatic flat assignment
- Rent payment tracking
- Maintenance complaints (Pending → In Progress → Resolved)
- Maintenance charges tracking
- Notice board for announcements
- JWT Authentication with role-based access (Admin, Tenant, Owner)

## Tech Stack
- Java 21
- Spring Boot 4.0
- Spring Security + JWT
- Spring Data JPA + Hibernate
- MySQL 8.0
- Maven

## Setup Instructions
1. Clone the repository
2. Create MySQL database: `CREATE DATABASE your_db_name;`
3. Copy `application.properties.example` to `application.properties`
4. Update database credentials in `application.properties`
5. Run the application using IntelliJ or `./mvnw spring-boot:run`

## API Endpoints

### Authentication (Public)
- POST `/auth/signup` - Register new user
- POST `/auth/login` - Login and get JWT token

### Apartments (Admin only)
- POST `/apartments` - Add apartment
- GET `/apartments` - Get all apartments
- GET `/apartments/{id}` - Get one apartment
- PUT `/apartments/{id}` - Update apartment
- DELETE `/apartments/{id}` - Delete apartment

### Tenants (Admin, Tenant, Owner)
- POST `/tenants/apartment/{apartmentId}` - Add tenant
- GET `/tenants` - Get all tenants
- GET `/tenants/{id}` - Get one tenant
- DELETE `/tenants/{id}` - Delete tenant

### Rent Payments (Admin, Tenant)
- POST `/rent/tenant/{tenantId}/apartment/{apartmentId}` - Create payment
- PUT `/rent/{id}/pay` - Mark as paid
- GET `/rent` - Get all payments
- GET `/rent/{id}` - Get one payment

### Maintenance Complaints (Admin, Tenant, Owner)
- POST `/complaints/tenant/{tenantId}/apartment/{apartmentId}` - Raise complaint
- PUT `/complaints/{id}/status?status=` - Update status
- GET `/complaints` - Get all
- GET `/complaints/{id}` - Get one

### Maintenance Charges (Admin, Tenant, Owner)
- POST `/maintenance-charges/tenant/{tenantId}/apartment/{apartmentId}` - Create charge
- PUT `/maintenance-charges/{id}/pay` - Mark as paid
- GET `/maintenance-charges` - Get all
- GET `/maintenance-charges/{id}` - Get one

### Notices (Admin only)
- POST `/notices` - Post notice
- GET `/notices` - Get all notices
- DELETE `/notices/{id}` - Delete notice

## Security
- All endpoints protected with JWT tokens
- Passwords encrypted with BCrypt
- Role-based access control (ADMIN, TENANT, OWNER)

## Author
Hafsa Firdous Mogal