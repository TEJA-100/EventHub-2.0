# EventHUB Features

EventHUB is a premium, centralized campus engagement platform designed to bridge the gap between students and college events.

## 🚀 Key Features

### 1. Premium Splash Screen & Navigation
- **EH Logo Animation**: A high-end, pulsing EH logo animation upon application load.
- **Smart Redirect**: Automatic transition from splash screen to the login portal.
- **Modern Navigation**: Sleek, glassmorphic navbar for effortless access to Explore, Profile, and Admin sections.

### 2. Event Discovery & Exploration
- **Centralized Feed**: A clean, centralized discovery feed for all campus events.
- **Category-Based Filtering**: Easily find events in Tech, Cultural, Sports, Arts, and more.
- **Dynamic Event Cards**: Premium event cards displaying dates, locations, and organizers at a glance.

### 3. Advanced Event Management (For Colleges)
- **Admin Portal**: Dedicated workspace for college organizers to manage their campus presence.
- **Event Creation Engine**: Full-featured form to publish events with details like:
    - Title & Description
    - Date & Location
    - Total Capacity
- **Image Support**: Upload custom high-resolution images for each event to boost engagement.
- **Intelligent Fallbacks**: Automatic category-based icons for events without custom images.

### 4. Secure Authentication & RBAC
- **Unified Profiles**: Seamless onboarding with specialized Student and College Admin accounts.
- **Global Middleware**: Intelligent route protection that automatically directs users based on auth status and permissions.
- **Secure Session Management**: High-security, server-side JWT sessions using `httpOnly` secure cookies.
- **Role-Based Guarding**: Strict access control for `/college` and `/admin` portals, preventing unauthorized entry.
- **Dynamic Interface**: A responsive UI that personalizes greetings and navigation menus in real-time based on the user's role.
- **Admin Insights**: Comprehensive tracking of registrations and participant dynamics for organizers.

### 5. Future-Ready Architecture
- **Tech Stack**: Built with Next.js (App Router), Prisma ORM, and Supabase (PostgreSQL).
- **Design System**: A bespoke Vanilla CSS design system featuring:
    - Glassmorphism effects
    - Smooth micro-animations
    - Responsive, mobile-first layouts
    - Harmony-driven color palettes

---
*EventHub: Where every student finds their stage.*
