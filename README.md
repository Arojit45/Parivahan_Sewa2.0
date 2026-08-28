# Parivahan Sewa 2.0

Parivahan Sewa 2.0 is a modern, comprehensive digital platform designed to streamline vehicle and driving-related services for citizens of India. It serves as a unified portal for vehicle registration, driving licenses, challan management, and fleet operations, bringing the traditional RTO (Regional Transport Office) services into a seamless, user-friendly digital experience.

## 🌟 Key Features

### For Citizens
* **Unified Dashboard**: A central hub showing a 360-degree view of your vehicles, driving licenses, and compliance status.
* **Vehicle Health Score**: An intelligent scoring system (out of 100) based on the validity of RC, Insurance, PUC, Tax, and pending Challans.
* **Smart Challan Management**: View pending challans, understand why they were issued, pay them online, or dispute them if you disagree.
* **Guardian Mode (Geofencing)**: Set geographical boundaries for your vehicles and receive alerts (SMS/Push) if the vehicle breaches the designated area.
* **Live Location Tracking**: Track your vehicle's live location on an interactive map.
* **Ask My Vehicle (AI Assistant)**: An intelligent AI assistant powered by Gemini to answer queries related to your vehicle and transport regulations.
* **Multi-Language Support**: Fully localized in 11 Indian languages (Hindi, Bengali, Tamil, Telugu, Kannada, Malayalam, Marathi, Gujarati, Punjabi, Odia, and English) using native translations.
* **Guided Processes (Wizards)**: Step-by-step wizards for complex processes like Vehicle Registration and Driving License applications.
* **My Documents**: A secure digital vault to view and download RC, PUC, Insurance, and Tax certificates.

### For Fleet Owners
* **Fleet Gateway & Dashboard**: Specialized tools for managing multiple vehicles, tracking fleet compliance, and monitoring overall fleet health in real-time.

## 🏗️ Tech Stack

This project is built using a modern, scalable, and robust technology stack.

### Frontend
* **Framework**: React 19 with Vite (blazing fast build tool)
* **Styling**: Tailwind CSS v4 for utility-first, responsive design
* **Routing**: React Router DOM v7
* **Mapping & GIS**: React Leaflet (OpenStreetMap integration)
* **3D & Animations**: Three.js, React Three Fiber, Framer Motion
* **Icons**: Lucide React
* **PDF Generation**: jsPDF
* **Localization**: Custom Native DOM Translator (with fallback support)

### Backend
* **Framework**: Spring Boot 3 (Java 17)
* **Database**: PostgreSQL (Production) / H2 (Development & Testing)
* **ORM**: Spring Data JPA (Hibernate)
* **Security**: Spring Security with Stateless JWT Authentication
* **SMS Gateway**: Twilio SDK integration for real-time alerts
* **Build Tool**: Maven

### Deployment & DevOps
* **Containerization**: Docker (Multi-stage builds using Eclipse Temurin JRE Alpine)
* **Cloud Hosting**: Backend deployed on Render (includes a Keep-Alive scheduler to prevent free-tier sleep), Frontend deployed on Vercel.

## 📁 Project Structure

```text
Parivahan Sewa 2.0/
├── Backend/                 # Spring Boot Java Backend
│   ├── src/main/java/...    # Application source code (Controllers, Services, Repositories, Security)
│   ├── pom.xml              # Maven dependencies
│   └── Dockerfile           # Docker configuration for containerized deployment
│
└── Frontend/                # React Vite Frontend
    ├── src/                 
    │   ├── components/      # Reusable UI components (Dashboard widgets, Modals, Maps)
    │   ├── contexts/        # React Contexts (Auth, Dashboard, Language, Wizards)
    │   ├── pages/           # Application pages (Auth, Dashboard, Challan, Fleet, etc.)
    │   ├── utils/           # API clients, translations, hooks (e.g., useKeepAlive)
    │   ├── App.jsx          # Root component and Routing configuration
    │   └── main.jsx         # Application entry point
    ├── package.json         # Node.js dependencies and scripts
    └── index.css            # Global Tailwind styles
```

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18 or higher recommended) for the frontend
* **Java 17** (JDK) and **Maven** for the backend
* **PostgreSQL** (optional for local dev, H2 can be used)

### 1. Running the Backend (Spring Boot)
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Build and run the application using Maven:
   ```bash
   mvn spring-boot:run
   ```
   *The backend will start on `http://localhost:8080`. Note that Swagger/OpenAPI docs (if configured) or health endpoints can be accessed here.*

### 2. Running the Frontend (React + Vite)
1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will start on `http://localhost:5173`. Open this URL in your browser to interact with the application.*

## 🔧 Core Architectural Concepts

* **Keep-Alive Mechanism**: The frontend implements a silent `useKeepAlive` hook at the root level (`App.jsx`) that pings a public `/api/ping` backend endpoint every 60 seconds. This ensures that cloud-hosted free-tier instances (like Render) do not spin down due to inactivity.
* **Stateless Authentication**: The system uses JSON Web Tokens (JWT). Upon successful login, the token is stored locally and attached as a `Bearer` token in the `Authorization` header for all subsequent protected API requests via the centralized `api.js` client.
* **Context-Driven State**: Global states like Authentication (`AuthContext`), Language/Localization (`LanguageContext`), and Dashboard Data (`DashboardContext`) are managed via React Context APIs to prevent prop drilling and ensure snappy UI updates.
* **Component-Based Dashboard**: The dashboard is highly modular, split into components like `LiveLocationMap`, `ComplianceStatus`, `HealthSummary`, and `GuidedProcesses`, making it easy to maintain and extend.

---
*Designed with ❤️ for a better digital transport ecosystem.*
