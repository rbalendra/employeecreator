# Talent Forge

### Table of Contents
- [🔍 Overview](#Overview)
- [🎯 Project Objectives](#Project-objectives)
- [🔨 Tech Stack](#Tech-Stack)
- [✨ Key Features](#Key-features)
- [📸 Screenshots](#Screenshots)
- [⚙️ Installation Guide](#installation-guide)
- [🧩 Challenges](#Challenges)
- [🚀 Areas for Growth](#Areas-for-growth)

## Overview
Talent Forge is a modern, full-stack employee management system that transforms how organisations handle their workforce data. With an emphasis on user experience and data visualisation, it provides both detailed individual employee management and comprehensive dashboard analytics.

## Project Objectives
- Create an intuitive, professional-grade employee management system
- Implement modern React patterns with TypeScript for type safety
- Build a scalable Spring Boot backend with clean architecture
- Provide meaningful data visualisation for HR insights
- Ensure responsive design across all device types
- Implement comprehensive form validation and error handling
- Learn and apply modern full-stack development practices

## Tech Stack
- Frontend: React 19, TypeScript, Vite, TailwindCSS
- Form Management: React Hook Form with Zod validation
- Charts: Recharts for data visualisation
- Backend: Java, Spring Boot, Spring Data JPA, Maven
- Database: MySQL with Hibernate ORM
- Image Storage: Cloudinary integration
- Testing: Vitest for unit testing

## Screenshots 
### Dashboard showing visualisation and key numbers of employee data
<img alt="image" src="https://github.com/user-attachments/assets/340122f1-42c9-4ba4-b9b6-37ecf7343c40" width="800" />

### Employees list (active and in-active displayed)
<img alt="image" src="https://github.com/user-attachments/assets/d5a050bd-c8e5-4c6d-82cf-3f7c3e1e90b8" width="800"/>

### Individual employee card with more information
<img alt="image" src="https://github.com/user-attachments/assets/95396021-60db-405e-a001-b676fd53dccb" width="800"/>

### Add new employee form / Update existing employee form
<img alt="image" src="https://github.com/user-attachments/assets/dd1aa0e1-8ed4-4c9b-b40e-269ea5904eae" width="800"/>

### Add new employee form / Update existing employee form
<img  alt="image" src="https://github.com/user-attachments/assets/49984714-8228-438c-a67f-5c90fef6f44c" width="800"/>

## Key Features
Frontend (React + TypeScript + Vite):
- Modern UI/UX: Built with Tailwind CSS for responsive, mobile-first design
- Comprehensive Employee Management: Add, edit, view, and delete employee records
- Advanced Search & Filtering: Real-time search with multiple filter options (contract type, employment basis, status)
- Interactive Dashboard: Visual analytics with pie charts showing employment distributions
- Form Validation: Robust client-side validation using React Hook Form + Zod schemas
- Image Upload: Seamless profile photo management with Cloudinary integration
- Employee Status Tracking: Dynamic status calculation based on employment dates
- Modal Details View: Detailed employee information in a professional ID card layout
- Toast Notifications: User-friendly feedback for all operations
- Responsive Design: Optimised for desktop, tablet, and mobile devices

Backend (Spring Boot):
- RESTful API: Complete CRUD operations with standardised endpoints
- Advanced Search: Flexible search functionality with multiple parameter support
- Data Validation: Server-side validation with meaningful error responses
- JPA Integration: Efficient database operations with Hibernate
- Pagination Support: Scalable data retrieval for large datasets
- Employee Status Logic: Sophisticated business logic for active/inactive status determination

Image Management (Cloudinary):
- Secure Upload: Direct file upload to Cloudinary CDN
- Real-time Preview: Immediate image preview during upload
- Optimised Storage: Automatic image optimisation and delivery
- Error Handling: Robust upload error management and user feedback

## Installation Guide
Prerequisites

Before running the application, ensure you have:
- ☕ Java Development Kit (JDK) 17+
- 📦 Apache Maven 3.6+
- 🐬 MySQL 8.0+
- 🟢 Node.js 18+
- 📱 npm

#### 🧩 Backend Setup (Spring Boot)

#### 1) Clone the repository:
```md
git clone https://github.com/yourusername/employeecreator.git
cd employeecreator
```
#### 2) Configure mySQL Database:
```sql
-- Log into MySQL
mysql -u root -p

-- Create database
CREATE DATABASE empcreator;
```
#### 3) Configure Application Properties:
Create ``application.properties``:
```java
spring.application.name=employeecreator
spring.datasource.url=jdbc:mysql://localhost:3306/${DB_NAME}
spring.datasource.username=${MYSQL_USER}
spring.datasource.password=${MYSQL_PASS}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```
#### 4) Set Environment Variables:
```java
export DB_NAME=empcreator
export MYSQL_USER=root
export MYSQL_PASS=yourpassword
```
#### 5) Install Dependencies & Run: 
```java
mvn clean install
mvn spring-boot:run
```

The backend will be available at ``http://localhost:8080``


#### ⚛️ Frontend Setup (React + Vite)

#### 1) Navigate to frontend directory
```bash
cd frontend
```

#### 2) Install Dependencies
```bash
npm install
```

#### 3) Configure Environment Variables: 
Create ``.env`` file:
```bash
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

#### 4) Run Development Server:
```bash
npm run dev
```
The frontend will be available at ``http://localhost:5173``


#### Frontend Tests:
```bash
cd frontend
npm run test
# or with UI
npm run test:ui
```
#### Backend Tests:
```bash
mvn test
```
## Challenges
- **Complex State Management:** Implementing efficient employee status calculation logic that considers both ``ongoing`` flags and finish dates
- **Form Validation Synchronisation:** Ensuring frontend Zod schemas match backend validation constraints
- **Image Upload Integration:** Seamlessly integrating Cloudinary with React Hook Form for real-time preview
- **Responsive Chart Design:** Making Recharts responsive across different screen sizes
- **Type Safety:** Maintaining strict TypeScript typing across complex form data and API responses


## Recent Implementation of [Pollination AI](https://pollinations.ai)
- Text-to-Image Generation: Integrated Pollinations AI API for generating professional employee avatars and creative portraits
- Pre-defined Style Options: Three one-click generation styles - Male Professional, Female Professional, and Creative Artistic portraits
- Real-time Processing: Fetch-based service layer handles API calls with loading states and error handling
- Form Integration: Generated images automatically populate the employee thumbnail field in the creation form
- No API Key Required: Utilises Pollinations' free tier for seamless image generation without authentication


https://github.com/user-attachments/assets/7e8117fe-431a-4622-bf77-1ecb864890b7



## Areas for Growth

### 🔐 Authentication & Authorization
- Implement JWT-based authentication
- Role-based access control (Admin, HR, Manager, Employee)
- Secure API endpoints with proper authorisation

### 📊 Enhanced Analytics
- Employee performance tracking
- Department-wise analytics (new departments)
- Historical data visualisation
- Export functionality (PDF, Excel)

### 🏗️ Infrastructure Improvements
- Docker containerization
- CI/CD pipeline setup
- Production deployment automation
- Performance monitoring and logging

### 🎨 UX Enhancements
- Dark mode support
- Advanced filtering with saved searches
- Drag-and-drop file uploads
