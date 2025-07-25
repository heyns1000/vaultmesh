# VaultMesh™ Application

## Overview

VaultMesh™ is a full-stack web application built as a modern mesh network infrastructure platform. The application features a React frontend with TypeScript, an Express backend, and PostgreSQL database with Drizzle ORM. The system is designed around a futuristic technology theme with features including terminal access, analytics dashboards, payment integration via PayPal, and multi-sector support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Theme System**: Custom theme provider supporting light/dark modes and "hyper mode"

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **API Design**: RESTful endpoints with JSON responses
- **File Structure**: Separate route handlers and business logic
- **Development**: tsx for TypeScript execution in development

### Database Architecture
- **Database**: PostgreSQL (configured for production)
- **ORM**: Drizzle ORM with migrations
- **Schema**: Centralized schema definition in shared directory
- **Connection**: Neon Database serverless driver for PostgreSQL
- **Development Storage**: In-memory storage fallback for development

## Key Components

### Frontend Components
- **Header**: Navigation with theme toggles and language selection
- **Terminal**: Interactive command-line interface simulation
- **Charts**: Custom Canvas-based components for data visualization
- **PayPal Integration**: Payment processing components
- **Theme System**: Light/dark mode with "hyper mode" overlay

### Backend Services
- **Route Management**: Centralized route registration system
- **PayPal Integration**: Complete payment processing workflow
- **Storage Abstraction**: Interface-based storage with memory fallback
- **API Endpoints**: Health checks, metrics, share prices, terminal commands

### Pages and Features
- **Home**: Landing page with features and pricing
- **Sectors**: Industry-specific solutions
- **Terminal**: Command-line interface page
- **Packages**: Subscription tiers with PayPal checkout
- **AgroChain**: Specialized agricultural technology features
- **Authentication**: Login and signup pages

## Data Flow

### Client-Server Communication
1. React components make API calls using TanStack Query
2. Express server handles requests and returns JSON responses
3. PayPal integration handles payment processing
4. Terminal commands are processed server-side and return simulated responses

### Theme and State Management
1. Theme context provides global theme state
2. CSS variables update dynamically based on theme selection
3. Local storage persists user preferences
4. Components consume theme context for styling

### Database Operations
1. Drizzle ORM provides type-safe database operations
2. Schema definitions are shared between client and server
3. Migrations are managed through Drizzle Kit
4. Development uses in-memory storage, production uses PostgreSQL

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Query
- **UI Components**: Radix UI primitives, shadcn/ui components
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **Backend**: Express, Drizzle ORM, Neon Database
- **Payment Processing**: PayPal Server SDK
- **Development Tools**: Vite, TypeScript, tsx

### Database and Storage
- **PostgreSQL**: Primary database for production
- **Neon Database**: Serverless PostgreSQL provider
- **Drizzle ORM**: Type-safe database toolkit
- **connect-pg-simple**: PostgreSQL session store

### Payment Integration
- **PayPal Server SDK**: Complete payment processing
- **PayPal Hosted Buttons**: Frontend payment components

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with HMR
- tsx for TypeScript execution
- In-memory storage for development data
- PayPal Sandbox for payment testing

### Production Build
- Vite builds optimized static assets
- esbuild bundles server code for Node.js
- Static files served from Express
- PostgreSQL database via Neon

### Environment Configuration
- Environment variables for database connection
- PayPal credentials for payment processing
- Separate configurations for development and production
- Replit integration for development environment

The application follows a monorepo structure with shared TypeScript definitions, modern development practices, and a focus on type safety throughout the stack.