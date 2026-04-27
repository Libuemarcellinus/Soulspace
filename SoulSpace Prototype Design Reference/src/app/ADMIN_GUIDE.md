# SoulSpace Admin Dashboard Guide

## Overview

The SoulSpace Admin Dashboard is a separate management interface for platform administrators. It features a dark, glassmorphic design that matches the main app's ethereal aesthetic with purple gradients and smooth animations.

## Accessing the Admin Panel

**URL**: `/admin/login`

The admin section is completely separate from the main user-facing app. Simply navigate to `/admin/login` to access the admin login page.

### Login

- **Email**: Enter admin email
- **Password**: Enter admin password
- Click **Sign In**

> Note: This is a demo implementation. In production, this would authenticate against a real backend API.

## Navigation

### Desktop
- **Sidebar**: Located on the left side with all navigation options
- **Logout**: At the bottom of the sidebar

### Mobile
- **Top Bar**: Shows SoulSpace logo and hamburger menu
- **Bottom Navigation**: Quick access to all sections
- **Logout**: Available in the hamburger menu

## Dashboard Sections

### 1. Dashboard (Overview)
**Path**: `/admin/dashboard`

Displays platform-wide metrics:
- **6 Stat Cards**: Total Souls, Reported Souls, Removed Souls, Total Circles, Total Moods, Blocked Users
- **Mood Distribution Chart**: Bar chart showing souls grouped by mood
- **Recent Souls**: List of the last 10 posts with mood badges

### 2. Souls
**Path**: `/admin/souls`

Manage all posts on the platform with three tabs:
- **All**: View all souls posted on the platform
- **Reported**: View souls that have been flagged by users (with Remove button)
- **Removed**: View souls that have been removed by moderators

Each soul displays:
- Mood badge (colored pill)
- Post content (truncated to 2 lines)
- Date posted
- Report indicator (if reported)

### 3. Circles
**Path**: `/admin/circles`

Manage community circles:
- **Grid View**: Cards showing circle icon, name, member count, and status
- **Active/Inactive Toggle**: Switch to enable/disable circles
- **Create Circle Button**: Opens dialog to create new circles
  - Circle Name input
  - Circle Icon (emoji) input

### 4. Moods
**Path**: `/admin/moods`

Manage available mood tags:
- **Grid View**: Cards showing mood icon, name, and status
- **Active/Inactive Toggle**: Switch to enable/disable moods
- **Create Mood Button**: Opens dialog to create new moods
  - Mood Name input
  - Mood Icon (emoji) input

### 5. Users
**Path**: `/admin/users`

View blocked users:
- List of blocked users with:
  - Username
  - Reason for blocking
  - Date blocked
- Empty state when no users are blocked

## Design Features

### Visual Style
- **Background**: Dark gradient from slate-900 → purple-900 → slate-900
- **Cards**: Glassmorphic design with backdrop blur and semi-transparent backgrounds
- **Borders**: Subtle slate borders with 50% opacity
- **Accents**: Purple and pink gradients for buttons and active states
- **Border Radius**: Consistent rounded corners (rounded-2xl/3xl)

### Loading States
Every screen includes skeleton loaders that appear while data is fetching, providing a smooth user experience.

### Empty States
All list views include thoughtful empty states with:
- Relevant emoji icon
- Clear heading
- Helpful description

### Responsive Design
- **Mobile-first**: Optimized for phone screens
- **Desktop**: Expands to use sidebar navigation
- **Tablet**: Adapts layout for medium screens

### Animations
- Page transitions with fade effects
- Staggered list item animations
- Hover states on interactive elements
- Smooth toggle switches

## Technical Implementation

### Authentication
- Uses localStorage for demo purposes
- Protected routes redirect to login if not authenticated
- Logout clears authentication and redirects to login

### State Management
- React hooks for local state
- Mock data for demonstration
- Simulated loading delays for realistic UX

### Routing
- React Router v7 with Data mode
- Nested routes for admin sections
- Protected route wrapper for authentication

## Future Enhancements

For production deployment, consider:
1. Real authentication with JWT tokens
2. API integration for data fetching
3. Role-based permissions
4. Activity logging
5. Advanced filtering and search
6. Bulk actions
7. Export functionality
8. Real-time updates with WebSockets
