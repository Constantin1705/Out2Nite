# Out2Nite - Next.js Frontend

Modern, fast, and beautiful frontend for Out2Nite built with Next.js 15+, React 19, TypeScript, and Tailwind CSS.

## Features

✨ **Modern Stack**
- Next.js 15 with App Router
- React 19 with latest hooks
- TypeScript for type safety
- Tailwind CSS for styling
- Framer Motion for animations

🎨 **Beautiful UI**
- Dark theme with gradient accents
- Smooth animations and transitions
- Responsive design for all devices
- Modern card components
- Interactive map integration

🔐 **Authentication**
- User login and registration
- Secure token-based authentication
- Persistent session management
- Protected routes

🗺️ **Features**
- Interactive map view of events
- List view with filtering and search
- Real-time activity updates
- Event details and contact information
- Website links and directions

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Update API URL in .env.local if needed
# NEXT_PUBLIC_API_URL=http://your-backend-api.com
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Building for Production

```bash
# Build the project
npm run build

# Start production server
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js pages and layouts
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── map/               # Map view page
│   └── list/              # List view page
├── components/            # Reusable React components
│   └── Header.tsx         # Navigation header
├── lib/                   # Utility functions
│   ├── api.ts            # API client configuration
│   └── auth.ts           # Authentication store (Zustand)
├── types/                 # TypeScript type definitions
│   ├── User.ts           # User types
│   └── Concert.ts        # Activity/Concert types
└── styles/               # Global styles
    └── globals.css       # Tailwind CSS and custom styles
```

## Configuration Files

- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS customization
- `postcss.config.js` - PostCSS plugins
- `.eslintrc.json` - ESLint configuration

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Technologies Used

- **Framework**: Next.js 15
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS + PostCSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Maps**: Leaflet + react-leaflet
- **HTTP Client**: Axios
- **Icons**: lucide-react

## API Integration

The app communicates with the Django backend at:
- `POST /api/auth/login/` - Login
- `POST /api/auth/register/` - Register
- `POST /api/auth/logout/` - Logout
- `GET /api/auth/me/` - Get current user
- `GET /api/activities/` - Get all activities

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Page speed optimized with Next.js
- Code splitting and lazy loading
- Image optimization
- CSS-in-JS optimization with Tailwind
- Server-side rendering ready

## Future Enhancements

- [ ] Dark/Light theme toggle
- [ ] User profiles and preferences
- [ ] Event filtering by mood/genre
- [ ] Real-time notifications
- [ ] Event reviews and ratings
- [ ] Share events on social media
- [ ] Offline support with PWA
- [ ] Analytics and tracking

## License

Private Project
