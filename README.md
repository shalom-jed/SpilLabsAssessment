# SPIL Labs Sales Order System

A full-stack Sales Order Management web application built as part of the SPIL Labs technical assessment.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend API | .NET Core 10 Web API |
| ORM | Entity Framework Core 10 |
| Database | SQL Server / SQL Server Express |
| Frontend | React 19 (Vite) |
| State Management | Redux Toolkit |
| Styling | Tailwind CSS |
| HTTP Client | Axios |

---

## Project Structure

```
/SpilLabsAssessment
  /backend
    /API                        ← .NET Core Web API (Clean Architecture)
      /Controllers              ← API layer (routing, HTTP)
      /Application
        /Interfaces             ← Service & Repository interfaces
        /Services               ← Business Logic Layer
        /Mappings               ← AutoMapper profiles
      /Domain
        /Entities               ← Domain models (Client, Item, SalesOrder, SalesOrderLine)
      /Infrastructure
        /Data                   ← EF Core DbContext
        /Repositories           ← Data Access Layer
      /Models                   ← DTOs
      /Migrations               ← EF Core migrations
  /frontend                     ← React (Vite) SPA
    /src
      /pages                    ← Home (orders list) & SalesOrder (form)
      /redux/slices             ← Redux Toolkit state slices
      /services                 ← Axios API client
  /database
    SpilLabsDB_Setup.sql        ← Complete database creation script + seed data
```

---

## Features

### Screen 1 – Sales Order Form
- Customer Name dropdown (loaded from `Clients` table)
- Auto-fill address fields on customer selection
- Item Code **and** Description both as synced dropdowns (loaded from `Items` table)
- Price auto-fills when an item is selected
- Dynamic calculations per line: `Excl = Qty × Price`, `Tax = Excl × TaxRate/100`, `Incl = Excl + Tax`
- Multiple line items per order
- Grand totals: Total Excl / Total Tax / Total Incl
- Save (POST) and Update (PUT) support
- 🖨️ Print button for browser-native printing

### Screen 2 – Home (Orders Grid)
- Default landing screen
- Lists all saved orders with sortable columns
- **Add New** button → opens blank Sales Order form
- **Edit** button per row + double-click → opens order pre-populated for editing
- Columns: Order ID, Invoice No., Customer Name, Date, Reference No., Total Excl, Total Tax, Total Incl

---

## Setup & Run

### Prerequisites
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- SQL Server Express (or SQL Server)

### 1. Database Setup
```sql
-- Run this script in SQL Server Management Studio or Azure Data Studio:
database/Database_Schema.sql
```

### 2. Backend
```bash
# Copy and configure connection string
cp backend/API/appsettings.json.example backend/API/appsettings.json
# Edit appsettings.json and set your SQL Server instance name

cd backend/API
dotnet run
# API runs at: http://localhost:5021
# Swagger UI: http://localhost:5021/swagger
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
# App runs at: http://localhost:5173
```

---

## Architecture

Follows **N-Tier (Layered) Clean Architecture**:

```
Controllers (API Layer)
    ↓
Services (Business Logic Layer)
    ↓
Repositories (Data Access Layer)
    ↓
Entity Framework Core → SQL Server
```

- **DTOs + AutoMapper** used for data transfer between API and domain
- **Dependency Injection** built into .NET Core wires all layers
- **Redux Toolkit** manages all frontend state (clients, items, orders)
- **React Router** handles navigation between Home and Sales Order screens
