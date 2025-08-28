# Marketplace Prototype

A complete marketplace application inspired by modern e-commerce platforms, built with React, Node.js, and PostgreSQL.

## Features

- 🛍️ **Complete marketplace experience** - Browse 40 products in responsive grid layout
- 🔐 **JWT Authentication** - Secure login/signup with protected routes
- 🛒 **Shopping cart & favorites** - Persistent cart and wishlist functionality
- 🌍 **Internationalization** - Support for Russian and Uzbek languages
- 🌙 **Dark mode** - Toggle between light and dark themes
- 📱 **Responsive design** - Mobile-first approach with desktop optimization
- 🎯 **Search functionality** - Debounced search across products
- ✨ **Smooth animations** - Framer Motion powered interactions
- ♿ **Accessibility** - ARIA labels, keyboard navigation, screen reader support

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- React i18next for internationalization
- React Router for navigation
- React Helmet for SEO

### Backend
- Node.js with Express
- PostgreSQL with Prisma ORM
- JWT authentication
- bcrypt for password hashing
- Rate limiting and validation

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (or Docker)

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd marketplace-prototype
npm run install:all
```

2. **Set up environment variables**

Create `server/.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/marketplace"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=3001
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:3001
```

3. **Set up database**
```bash
npm run db:setup
```

4. **Start development servers**
```bash
npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Demo Credentials
```
Email: demo@marketplace.com
Password: demo123
```

## Project Structure

```
marketplace-prototype/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── context/       # React context providers
│   │   ├── services/      # API service functions
│   │   ├── utils/         # Utility functions
│   │   ├── locales/       # Translation files
│   │   └── types/         # TypeScript type definitions
│   └── public/            # Static assets
├── server/                # Node.js backend
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── services/      # Business logic
│   │   └── types/         # TypeScript types
│   ├── prisma/            # Database schema and migrations
│   └── tests/             # Backend tests
└── docs/                  # Documentation
```

## Key Components

### Frontend Components
- **Header** - Navigation with search, cart, and user actions
- **ProductGrid** - Responsive 10×4 product layout
- **ProductCard** - Individual product display with actions
- **CatalogSidebar** - Animated category navigation
- **AuthModals** - Login and signup forms
- **Cart** - Shopping cart management
- **ProductDetail** - Full product information page

### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/products` - Get products with search/filter
- `GET /api/products/:id` - Get product details
- `GET/POST /api/cart` - Cart management
- `GET/POST/DELETE /api/favorites` - Favorites management

## Development Guide

### Adding New Products
Edit `server/prisma/seed.ts` to add more products to the database.

### Translations
Add new translations in `client/src/locales/[lang]/common.json`.

### Styling
Custom Tailwind classes are defined in `client/tailwind.config.js`.

### Dark Mode
Theme state is managed in `client/src/context/ThemeContext.tsx`.

## Testing

Run backend tests:
```bash
cd server && npm test
```

Run E2E tests:
```bash
cd client && npm run test:e2e
```

## Deployment

1. Build the frontend:
```bash
cd client && npm run build
```

2. Set up production environment variables
3. Deploy backend to your hosting provider
4. Deploy frontend build to static hosting (Netlify, Vercel, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is for educational and demonstration purposes only. Do not use trademarked logos or content from real marketplace platforms.
