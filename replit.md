# RevLimits - Automotive News Platform

## Overview

RevLimits is a modern automotive news and review platform designed for the Indian market. The application serves as a content management system and public-facing website for automotive journalism, featuring car news, bike news, reviews, and industry insights. The platform includes both a public interface for readers and an admin panel for content management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client is built using React with TypeScript, leveraging modern development patterns and libraries:
- **React Router**: Uses Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Radix UI components with shadcn/ui design system for consistent, accessible UI components
- **Styling**: Tailwind CSS with custom CSS variables for theming, supporting dark mode
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Build System**: Vite for fast development and optimized production builds

### Backend Architecture
The server follows a REST API architecture using Express.js:
- **Framework**: Express.js with TypeScript for type safety
- **Route Organization**: Modular route registration system with centralized error handling
- **Storage Layer**: Abstracted storage interface with in-memory implementation (IStorage pattern)
- **Development Tools**: Custom Vite middleware integration for seamless full-stack development
- **Logging**: Request/response logging middleware for API monitoring

### Data Layer
The application uses a flexible data architecture:
- **ORM**: Drizzle ORM configured for PostgreSQL with type-safe database interactions
- **Schema**: Centralized schema definitions in `shared/schema.ts` with Zod validation
- **Database**: PostgreSQL as the production database (Neon Database integration)
- **Migrations**: Drizzle Kit for database schema migrations
- **Development**: In-memory storage implementation with seed data for rapid development

### Component Architecture
The UI follows a modular component structure:
- **Design System**: shadcn/ui components providing consistent, accessible building blocks
- **Custom Components**: Domain-specific components for articles, navigation, admin panels
- **Layout Components**: Reusable layout components (Navigation, Footer, Sidebar)
- **Page Components**: Route-level components handling specific application views

### Development Architecture
The project uses a monorepo structure with shared code:
- **Shared Types**: Common TypeScript interfaces and schemas used across client and server
- **Path Aliases**: Configured import aliases for clean code organization
- **Development Server**: Integrated Vite dev server with Express backend
- **Build Process**: Separate build processes for client (Vite) and server (esbuild)

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: Type-safe database interactions and schema management
- **Drizzle Kit**: Database migration and schema management tools

### UI and Styling
- **Radix UI**: Headless component library providing accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: Pre-built component library based on Radix UI and Tailwind
- **Lucide React**: Icon library for consistent iconography

### State Management and Data Fetching
- **TanStack Query**: Server state management, caching, and synchronization
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema definition

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking and enhanced developer experience
- **esbuild**: Fast JavaScript bundler for server-side code
- **PostCSS**: CSS processing with Autoprefixer

### Routing and Navigation
- **Wouter**: Lightweight client-side routing library
- **React**: Core library for building user interfaces