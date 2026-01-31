# Out2Nite Next.js - Quick Reference Cheat Sheet

## 🚀 Quick Commands

### Installation & Setup
```bash
# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Edit .env.local with your backend URL
```

### Development
```bash
# Start dev server
npm run dev

# Start on different port
npm run dev -- -p 3001

# Type checking
npm run type-check

# Linting
npm run lint
```

### Build & Deploy
```bash
# Build for production
npm run build

# Start production server
npm start

# Check build size
npm run build -- --analyze
```

---

## 📁 File Structure Quick Reference

```
src/
├── app/                    # Pages
│   ├── page.tsx           # / (home)
│   ├── login/page.tsx     # /login
│   ├── register/page.tsx  # /register
│   ├── map/page.tsx       # /map
│   └── list/page.tsx      # /list
├── components/            # Components
├── lib/                   # Utilities
└── types/                 # Type definitions
```

---

## 🔑 Authentication

### Login Store Usage
```typescript
import { useAuthStore } from '@/lib/auth'

export function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthStore()
  
  // Use auth state
}
```

### Protect Routes
```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute'

export function MyPage() {
  return (
    <ProtectedRoute>
      <YourContent />
    </ProtectedRoute>
  )
}
```

---

## 🎨 Styling Quick Reference

### Tailwind Classes
```typescript
// Colors
text-primary          // Indigo
text-secondary        // Violet
text-accent          // Pink
bg-dark-800          // Dark background

// Common patterns
px-4 py-2            // Padding
rounded-lg           // Border radius
border border-dark-700  // Border
hover:bg-dark-700    // Hover state
transition-colors    // Smooth transition
```

### Style Utilities
```typescript
import { buttonStyles, cardStyles, inputStyles } from '@/lib/styles'

<button className={buttonStyles.primary}>Click me</button>
<div className={cardStyles.hover}>Card</div>
```

---

## 🔗 API Requests

### Using API Client
```typescript
import { apiClient } from '@/lib/api'

// GET request
const response = await apiClient.get('/api/activities/')
const activities = response.data

// POST request
await apiClient.post('/api/auth/login/', { username, password })

// Error handling
try {
  const data = await apiClient.get('/api/endpoint')
} catch (error) {
  console.error(error.response?.data?.message)
}
```

---

## ⚙️ Environment Variables

```env
# .env.local (do not commit)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Access in code:
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL
```

---

## 🎬 Animations with Framer Motion

```typescript
import { motion } from 'framer-motion'

// Simple animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>

// Container with stagger
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map(item => (
    <motion.div key={item} variants={itemVariants}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

---

## 📱 Icons with Lucide React

```typescript
import { MapPin, Music, Star, Loader } from 'lucide-react'

<MapPin size={16} className="text-primary" />
<Music size={20} />
<Star size={18} />
<Loader className="animate-spin" />
```

Common sizes: `16`, `18`, `20`, `24`, `32`

---

## 🗺️ Maps with Leaflet

```typescript
import { useEffect, useRef } from 'react'
import L from 'leaflet'

const mapContainer = useRef<HTMLDivElement>(null)

useEffect(() => {
  if (!mapContainer.current) return
  
  const map = L.map(mapContainer.current)
    .setView([53.2194, 6.5669], 13)
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    .addTo(map)
  
  // Add markers
  L.marker([lat, lng]).addTo(map)
}, [])

return <div ref={mapContainer} style={{ height: '100vh' }} />
```

---

## 🔍 TypeScript Tips

### Type Definitions
```typescript
import type { User } from '@/types/User'
import type { Activity } from '@/types/Concert'

// Use as type
const user: User = {...}
const activity: Activity = {...}
```

### Type Safety
```typescript
// Always type functions
function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
  // ...
}

// Type props
interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
}
```

---

## 📊 Component Patterns

### Functional Component
```typescript
'use client'

import { useState } from 'react'

export default function MyComponent() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  )
}
```

### With Props
```typescript
interface Props {
  title: string
  children: React.ReactNode
}

export function Card({ title, children }: Props) {
  return (
    <div className="bg-dark-800 rounded-lg p-6">
      <h2>{title}</h2>
      {children}
    </div>
  )
}
```

---

## 🐛 Debugging

### Browser Console
```javascript
// Check auth state
localStorage.getItem('auth-storage')

// Check environment
console.log(process.env.NEXT_PUBLIC_API_URL)
```

### React DevTools
1. Install React DevTools browser extension
2. Inspect components
3. Check props and state

### Next.js
```bash
# Debug build
DEBUG=next:* npm run build

# Build analysis
npm run build -- --analyze
```

---

## 🚀 Deployment Checklist

- [ ] Update `.env.local` with production URL
- [ ] Run `npm run build` successfully
- [ ] Test production build: `npm start`
- [ ] Check all pages load
- [ ] Test authentication flow
- [ ] Verify API calls work
- [ ] Check responsive design
- [ ] Test on mobile
- [ ] Set up environment variables in deployment platform
- [ ] Deploy!

---

## 🌐 Useful URLs

- Local Dev: `http://localhost:3000`
- API (Local): `http://localhost:8000`
- Next.js Docs: `https://nextjs.org/docs`
- React Docs: `https://react.dev`
- Tailwind: `https://tailwindcss.com`
- Framer Motion: `https://www.framer.com/motion`

---

## 💡 Pro Tips

1. **Use `use client`** - At the top of files using hooks/state
2. **Keep components small** - Easier to test and maintain
3. **Use TypeScript** - Catch errors before runtime
4. **Optimize images** - Use Next.js Image component
5. **Lazy load** - Use `dynamic()` for heavy components
6. **Cache API calls** - Use React Query or SWR
7. **Monitor bundle** - Check size regularly
8. **Optimize CSS** - Tailwind purges unused styles

---

## 🆘 Common Issues

### "Cannot find module"
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
```

### Port already in use
```bash
# Kill process on port 3000
npx kill-port 3000
npm run dev
```

### Auth not persisting
```typescript
// Check localStorage
localStorage.getItem('auth-storage')
// Should contain user data
```

### API connection error
```typescript
// Check environment
console.log(process.env.NEXT_PUBLIC_API_URL)
// Make sure backend is running
// Verify CORS settings
```

---

## 📚 Documentation Files

- **README.md** - Project overview
- **SETUP.md** - Quick start
- **INSTALL.md** - Installation guide
- **MIGRATION.md** - Comparison with Quasar
- **SUMMARY.md** - Project summary

---

**Last Updated**: January 31, 2026  
**Version**: 1.0.0
