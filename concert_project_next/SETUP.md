# Quick Start Guide - Out2Nite Next.js Frontend

## 🚀 Installation & Setup

### 1. Install Dependencies
```bash
cd concert_project_next
npm install
```

### 2. Configure Environment
```bash
# Copy the example environment file
cp .env.local.example .env.local

# Edit .env.local with your backend URL
# Default is http://localhost:8000
```

### 3. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home/landing page
│   ├── globals.css          # Global styles
│   ├── providers.tsx        # React context providers
│   ├── login/
│   │   └── page.tsx         # Login page
│   ├── register/
│   │   └── page.tsx         # Registration page
│   ├── map/
│   │   └── page.tsx         # Interactive map view
│   └── list/
│       └── page.tsx         # Events list view
├── components/
│   ├── Header.tsx           # Navigation header
│   └── ProtectedRoute.tsx   # Route protection wrapper
├── lib/
│   ├── api.ts              # Axios client setup
│   ├── auth.ts             # Zustand auth store
│   └── styles.ts           # Utility style constants
└── types/
    ├── User.ts             # User interfaces
    └── Concert.ts          # Activity/Event interfaces
```

---

## 🔑 Key Features

### 🎨 Modern Design
- Dark theme with gradient accents
- Smooth Framer Motion animations
- Fully responsive (mobile, tablet, desktop)
- Custom Tailwind CSS configuration

### 🔐 Authentication
- JWT token-based auth
- Login & registration pages
- Automatic session persistence
- Protected routes

### 🗺️ Map View
- Leaflet.js integration
- Real-time activity markers
- Search and filter functionality
- Activity details modal

### 📋 List View
- Grid layout with cards
- Filter by event type
- Search functionality
- Expandable event details

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## 📝 API Integration

The app expects these endpoints from the backend:

### Authentication
- `POST /api/auth/login/` - Login user
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/logout/` - Logout user
- `GET /api/auth/me/` - Get current user

### Activities
- `GET /api/activities/` - Get all activities/events

---

## 🎯 Styling System

We use **Tailwind CSS** with custom configuration:

### Custom Colors
- `primary` (#6366f1) - Main brand color
- `secondary` (#8b5cf6) - Secondary actions
- `accent` (#ec4899) - Highlights
- `dark-900`, `dark-800`, etc. - Dark theme palette

### Utilities
See `src/lib/styles.ts` for reusable style constants:
```typescript
import { buttonStyles, cardStyles, inputStyles } from '@/lib/styles'
```

---

## 🔄 State Management

Using **Zustand** for auth state:

```typescript
import { useAuthStore } from '@/lib/auth'

export function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthStore()
  // ...
}
```

---

## 🚀 Deployment

### Build
```bash
npm run build
```

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Set `NEXT_PUBLIC_API_URL` environment variable
4. Deploy!

### Deploy to Other Platforms
- **Netlify**: Similar to Vercel, set environment variables
- **Docker**: Create a Dockerfile based on Node.js 18+
- **Traditional Server**: Build and run with Node.js

---

## 🐛 Troubleshooting

### API Connection Issues
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure backend is running
- Check CORS settings in Django backend

### Login Not Working
- Clear browser cookies/local storage
- Check backend authentication endpoints
- Verify user credentials

### Map Not Showing
- Ensure Leaflet CSS is loaded in layout.tsx
- Check browser console for errors
- Verify activities data from API

---

## 📦 Dependencies

**Key Libraries:**
- `next` - React framework
- `react` & `react-dom` - UI library
- `typescript` - Type safety
- `tailwindcss` - Styling
- `framer-motion` - Animations
- `zustand` - State management
- `axios` - HTTP client
- `react-leaflet` & `leaflet` - Maps
- `lucide-react` - Icons

See `package.json` for full list.

---

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 🤝 Contributing

Guidelines for working on the project:

1. **Code Style**: Follow ESLint + Prettier config
2. **Components**: Place in `src/components/`
3. **Pages**: Add to `src/app/`
4. **Types**: Update `src/types/`
5. **Styles**: Use Tailwind classes + CSS modules

---

## 📞 Support

For issues or questions:
- Check the README.md
- Review code comments
- Check browser console for errors

---

**Happy coding! 🎉**
