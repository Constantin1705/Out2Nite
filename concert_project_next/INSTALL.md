# Out2Nite Next.js Frontend - Installation & Configuration

## Prerequisites

- **Node.js**: 18.17 or later
- **npm** or **yarn**
- **Git**
- Backend API running at `http://localhost:8000`

## Step 1: Clone/Navigate to Project

```bash
cd concert_project_next
```

## Step 2: Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

Or using pnpm:
```bash
pnpm install
```

## Step 3: Configure Environment

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set your backend API URL:

```env
# Backend API URL (default for local development)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Note**: 
- For production, update this to your actual backend URL
- The `NEXT_PUBLIC_` prefix makes it available to the browser
- Do NOT commit `.env.local` to version control

## Step 4: Start Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

## Step 5: Verify Setup

1. **Homepage**: Visit http://localhost:3000
2. **Register**: Create a new account at http://localhost:3000/register
3. **Login**: Sign in with your credentials
4. **Map View**: Explore events on the interactive map
5. **List View**: Browse events in list format

---

## Environment Configuration

### Development
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Production (Vercel)
Set via Vercel Dashboard > Project Settings > Environment Variables:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Production (Other Hosts)
Update `.env.local` or set system environment variables:
```bash
export NEXT_PUBLIC_API_URL=https://your-api-url.com
```

---

## Backend Requirements

Ensure your Django backend is running and accessible:

### Local Backend Setup
```bash
# In concert_project directory
python manage.py runserver
```

### Expected Backend Endpoints
- `http://localhost:8000/api/auth/login/`
- `http://localhost:8000/api/auth/register/`
- `http://localhost:8000/api/auth/logout/`
- `http://localhost:8000/api/auth/me/`
- `http://localhost:8000/api/activities/`

### Backend Configuration
Make sure Django settings include:
```python
ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'yourdomain.com']

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://yourdomain.com',
]
```

---

## Available Scripts

### Development
```bash
npm run dev
```
Starts the development server with hot-reload.

### Build
```bash
npm run build
```
Creates an optimized production build.

### Start Production
```bash
npm start
```
Runs the production build (requires `npm run build` first).

### Type Checking
```bash
npm run type-check
```
Validates all TypeScript types.

### Linting
```bash
npm run lint
```
Checks code quality with ESLint.

---

## Project Structure

```
concert_project_next/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Global styles
│   │   ├── providers.tsx       # React providers
│   │   ├── login/page.tsx      # Login page
│   │   ├── register/page.tsx   # Register page
│   │   ├── map/page.tsx        # Map view
│   │   └── list/page.tsx       # List view
│   ├── components/             # Reusable components
│   │   ├── Header.tsx          # Navigation header
│   │   └── ProtectedRoute.tsx  # Route protection
│   ├── lib/                    # Utilities
│   │   ├── api.ts              # Axios client
│   │   ├── auth.ts             # Zustand auth store
│   │   └── styles.ts           # CSS utilities
│   └── types/                  # TypeScript types
│       ├── User.ts
│       └── Concert.ts
├── public/                     # Static assets
├── .env.local.example          # Environment template
├── .eslintrc.json             # ESLint config
├── .prettierrc.json           # Prettier config
├── .gitignore                 # Git ignore rules
├── next.config.js             # Next.js config
├── tailwind.config.ts         # Tailwind config
├── tsconfig.json              # TypeScript config
├── package.json               # Dependencies
├── README.md                  # Project info
├── SETUP.md                   # Quick start guide
└── MIGRATION.md               # Migration details
```

---

## Troubleshooting

### Port 3000 Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

### API Connection Errors
1. **Check Backend Running**: `curl http://localhost:8000/api/activities/`
2. **Check CORS**: Verify Django CORS settings
3. **Check URL**: Ensure `NEXT_PUBLIC_API_URL` is correct
4. **Check Firewall**: Make sure ports are not blocked

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

### TypeScript Errors
```bash
# Type check your code
npm run type-check

# ESLint check
npm run lint
```

---

## Deployment

### Deploy to Vercel (Recommended)

1. **Connect Repository**
   ```bash
   git push origin main
   ```
   Push your code to GitHub/GitLab

2. **Import in Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your repository
   - Select `concert_project_next` as root directory

3. **Configure Environment**
   - In Vercel Dashboard: Settings > Environment Variables
   - Add: `NEXT_PUBLIC_API_URL=https://your-backend-url.com`

4. **Deploy**
   - Click "Deploy"
   - Vercel automatically builds and deploys

### Deploy to Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

ENV NEXT_PUBLIC_API_URL=http://api:8000

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t out2nite-frontend .
docker run -p 3000:3000 out2nite-frontend
```

### Deploy to Traditional Server

1. **Build locally**
   ```bash
   npm run build
   ```

2. **Upload to server**
   ```bash
   scp -r . user@yourserver.com:/var/www/out2nite-frontend
   ```

3. **Install dependencies and start**
   ```bash
   cd /var/www/out2nite-frontend
   npm install --production
   npm start
   ```

4. **Use PM2 for process management**
   ```bash
   npm install -g pm2
   pm2 start npm --name "out2nite-frontend" -- start
   pm2 save
   ```

---

## Browser DevTools

### Vue DevTools for Next.js
Most browser dev tools work out of the box. For debugging:
- **Chrome DevTools**: Built-in
- **Firefox DevTools**: Built-in
- **React DevTools Extension**: https://react-devtools-tutorial.vercel.app/

---

## Further Reading

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [Framer Motion](https://www.framer.com/motion/)
- [Axios](https://axios-http.com)

---

## Support & Troubleshooting

For issues:
1. Check `.env.local` configuration
2. Verify backend is running
3. Review browser console for errors
4. Check terminal output for build errors
5. Clear Next.js cache: `rm -rf .next`

---

**You're all set! Happy developing! 🚀**
