# Fanvue App Starter

A powerful Next.js application integrated with Fanvue OAuth authentication, featuring a modern UI with glassmorphism effects and comprehensive creator management tools.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ installed
- pnpm package manager
- Fanvue OAuth credentials (Client ID, Client Secret)

### Installation

1. **Clone the repository**
   ```bash
   cd fanvue-app-starter
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Fanvue OAuth Configuration
   OAUTH_CLIENT_ID=your_client_id
   OAUTH_CLIENT_SECRET=your_client_secret
   OAUTH_REDIRECT_URI=http://localhost:3000/api/oauth/callback
   OAUTH_ISSUER_BASE_URL=https://auth.fanvue.com
   
   # API Configuration
   API_BASE_URL=https://api.fanvue.com
   
   # Session Secret (generate a random string)
   SESSION_SECRET=your_random_secret_here
   SESSION_COOKIE_NAME=fanvue_session
   ```

4. **Run the development server**
   ```bash
   pnpm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## ☁️ Deployment to Vercel

### Prerequisites for Deployment

1. **Create a Vercel account** at [vercel.com](https://vercel.com)
2. **Install Vercel CLI** (optional but recommended):
   ```bash
   npm install -g vercel
   ```

### Steps to Deploy

#### Method 1: Using Vercel Dashboard (Recommended for beginners)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/fanvue-app-starter.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in and click "New Project"
   - Import your GitHub repository
   - Configure project settings:
     - Framework Preset: Next.js
     - Root Directory: Leave empty (root of repo)
     - Build Command: `pnpm build`
     - Output Directory: `.next`

3. **Configure Environment Variables**
   In the Vercel project settings, add these environment variables:
   ```
   OAUTH_CLIENT_ID=your_production_client_id
   OAUTH_CLIENT_SECRET=your_production_client_secret
   OAUTH_REDIRECT_URI=https://your-app.vercel.app/api/oauth/callback
   OAUTH_ISSUER_BASE_URL=https://auth.fanvue.com
   API_BASE_URL=https://api.fanvue.com
   SESSION_SECRET=your_secure_production_secret
   SESSION_COOKIE_NAME=fanvue_session
   BASE_URL=https://your-app.vercel.app
   ```

4. **Deploy**
   - Click "Deploy" and wait for the build to complete
   - Your app will be available at `https://your-app.vercel.app`

#### Method 2: Using Vercel CLI

1. **Login to Vercel CLI**
   ```bash
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? Yes
   - Which scope? Your personal account
   - Link to existing project? No
   - What's your project's name? fanvue-app
   - In which directory is your code located? ./
   - Want to override the settings? No

3. **Configure Environment Variables**
   After deployment, set environment variables:
   ```bash
   vercel env add OAUTH_CLIENT_ID
   vercel env add OAUTH_CLIENT_SECRET
   vercel env add OAUTH_REDIRECT_URI
   vercel env add SESSION_SECRET
   vercel env add BASE_URL
   ```

4. **Redeploy**
   ```bash
   vercel --prod
   ```

### Important Notes for Production

1. **Update Fanvue OAuth Settings**
   - Go to your Fanvue Developer Dashboard
   - Add your production redirect URI: `https://your-app.vercel.app/api/oauth/callback`
   - Update any other OAuth settings as needed

2. **Security Considerations**
   - Generate a new, secure `SESSION_SECRET` for production
   - Never commit secrets to version control
   - Use Vercel's environment variables for sensitive data

3. **Domain Configuration**
   - You can add a custom domain in Vercel project settings
   - Update `OAUTH_REDIRECT_URI` and `BASE_URL` accordingly

## 📁 Project Structure

```
fanvue-app-starter/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (authenticated)/          # Protected routes
│   │   │   ├── dashboard/           # Analytics dashboard
│   │   │   ├── chat/                # Live chat console
│   │   │   ├── scripts/             # Scripts manager
│   │   │   ├── settings/            # Settings page
│   │   │   └── layout.tsx           # Authenticated layout
│   │   ├── api/
│   │   │   ├── oauth/               # OAuth endpoints
│   │   │   │   ├── login/
│   │   │   │   ├── callback/
│   │   │   │   └── logout/
│   │   │   └── fanvue/              # Fanvue API routes
│   │   │       └── user/
│   │   ├── globals.css
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Home page
│   ├── components/
│   │   ├── ui/                      # UI components
│   │   │   ├── GlassCard.tsx
│   │   │   ├── NeonButton.tsx
│   │   │   ├── NeonInput.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── analytics/               # Analytics components
│   │   │   ├── KPICard.tsx
│   │   │   └── RevenueChart.tsx
│   │   ├── chat/                    # Chat components
│   │   │   ├── ConversationList.tsx
│   │   │   └── MessageBubble.tsx
│   │   ├── scripts/                 # Scripts components
│   │   │   ├── ScriptCard.tsx
│   │   │   └── ScriptEditor.tsx
│   │   └── settings/
│   │       └── SettingsForm.tsx
│   ├── lib/                         # Utility libraries
│   │   ├── fanvue.ts               # Fanvue user API
│   │   ├── fanvue-api.ts           # Server-side API helpers
│   │   ├── fanvue-client.ts        # Client-side API helpers
│   │   ├── oauth.ts                # OAuth utilities
│   │   └── session.ts              # Session management
│   └── env.ts                       # Environment validation
├── .env.local                       # Environment variables
├── next.config.ts                   # Next.js configuration
├── tailwind.config.js               # Tailwind CSS config
├── tsconfig.json                    # TypeScript config
└── package.json                     # Dependencies
```

## ✨ Features

### 🎨 Modern UI/UX
- **Glassmorphism Design** - Beautiful backdrop-blur effects
- **Neon Glow Effects** - Eye-catching buttons and inputs with glowing shadows
- **Dark Theme** - Fully dark-themed interface
- **Responsive Layout** - Works on all screen sizes
- **Smooth Animations** - Transitions and hover effects

### 🔐 Authentication
- **Fanvue OAuth 2.0** - Secure authentication flow
- **Auto Token Refresh** - Automatic token renewal before expiry
- **Session Management** - Encrypted session cookies
- **Route Protection** - Automatic redirect for unauthenticated users
- **Real User Data** - Display name, avatar, creator status

### 📊 Dashboard Analytics
- **Real-time KPIs** - Followers, subscribers, content counts
- **Engagement Metrics** - Calculated engagement rates
- **Revenue Charts** - Interactive charts with Recharts
- **Content Breakdown** - Images, videos, posts statistics
- **Account Information** - Profile details at a glance

### 💬 Live Chat Console
- **Conversation List** - Manage multiple conversations
- **Message Bubbles** - Beautiful chat interface
- **Read Receipts** - Message status indicators
- **AI Assistant Status** - Toggle AI automation
- **Real-time Ready** - Structure prepared for WebSocket integration

### 📝 Scripts Manager
- **Script Cards** - Visual script management
- **CRUD Operations** - Create, edit, delete, duplicate scripts
- **Script Categories** - Welcome, follow-up, promotional
- **Status Toggle** - Enable/disable scripts
- **Success Metrics** - Track script performance

### ⚙️ Settings
- **OAuth Status** - View Fanvue connection details
- **Token Management** - See expiration and refresh status
- **AI Configuration** - Configure AI provider and settings
- **General Preferences** - Notifications and auto-response

## 🔄 Authentication Flow

1. **User visits home page** (`/`)
2. **Click "Login with Fanvue"** → Redirects to `/api/oauth/login`
3. **OAuth authorization** → User authorizes on Fanvue
4. **Callback handling** → `/api/oauth/callback` exchanges code for tokens
5. **Session creation** → Encrypted session stored in cookie
6. **Redirect to dashboard** → User lands on `/dashboard`
7. **Protected routes** → All routes check session validity
8. **Auto token refresh** → Tokens refreshed 30s before expiry

## 🛠️ Available Scripts

```bash
# Development
pnpm run dev          # Start dev server with Turbopack

# Production
pnpm run build        # Build for production
pnpm run start        # Start production server

# Code Quality
pnpm run lint         # Run ESLint
```

## 🔌 API Integration

### Server Components (Async)

```typescript
import { getCurrentUser } from '@/lib/fanvue';
import { fanvueApiRequest } from '@/lib/fanvue-api';

export default async function MyPage() {
  const user = await getCurrentUser();
  const data = await fanvueApiRequest('/endpoint');
  
  return <div>{user?.handle}</div>;
}
```

### Client Components

```typescript
'use client';
import { clientApiRequest } from '@/lib/fanvue-client';

export default function MyComponent() {
  const fetchData = async () => {
    const { data, error } = await clientApiRequest('/api/fanvue/user');
  };
  
  return <button onClick={fetchData}>Fetch</button>;
}
```