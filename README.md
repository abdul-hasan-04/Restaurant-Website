# Villet Chef Restaurant

A modern restaurant ordering and management application built with React, Vite, Supabase, and Tailwind CSS.

## Features

- **Customer Dashboard** – Manage customer accounts and profiles.
- **Menu Browsing** – Explore restaurant meals and categories.
- **Shopping Cart** – Add, update, and manage cart items.
- **Checkout** – Place restaurant orders.
- **Order Management** – View and manage customer orders.
- **Admin Dashboard** – Manage restaurant operations.
- **Menu Management** – Add, update, and manage menu items.
- **Authentication** – Secure user authentication and protected routes.
- **Responsive Design** – Supports desktop and mobile devices.
- **Theme Support** – Light and dark themes.

## Technologies Used

| Technology | Purpose |
|---|---|
| React 19 | User interface |
| Vite 8 | Development and build tool |
| Supabase | Backend, database and authentication |
| Tailwind CSS 4 | Styling |
| React Router | Application routing |
| React Hook Form | Form management |
| Lucide React | Icons |
| React Toastify | Notifications |

## Getting Started

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the project

```bash
cd "Villet Chef Restaurant"
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root and configure your Supabase credentials.

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

Make sure these variable names match those used in your Supabase configuration.

### 5. Start the development server

```bash
npm run dev
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint