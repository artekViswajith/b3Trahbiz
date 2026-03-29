# Trahbiz CMS - Complete Setup & Run Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Running the Project](#running-the-project)
7. [Admin Panel Access](#admin-panel-access)
8. [Project Structure](#project-structure)
9. [Key Features](#key-features)
10. [Troubleshooting](#troubleshooting)

---

## Project Overview

**Trahbiz CMS** is a modern, full-stack Content Management System built with:
- **Framework**: Next.js 16.2.1 with TypeScript and App Router
- **Database**: MySQL 5.7+ with Prisma 7 ORM
- **Frontend**: React with Tailwind CSS and GSAP animations
- **Authentication**: JWT-based admin authentication
- **Architecture**: RESTful API routes for content delivery and admin operations

The CMS manages content for a luxury travel/real estate business platform with sections for:
- Hero sections and about information
- Features showcase
- Services catalog
- Properties listings
- Package offerings
- Contact information
- Navigation and site settings

---

## Prerequisites

Before starting, ensure you have the following installed:

### Required Software
- **Node.js**: v18.17+ (LTS recommended)
- **npm**: v9+ or **yarn** v3+
- **MySQL**: v5.7+ or MariaDB v10.4+
  - Local installation or remote MySQL server accessible from your machine
  - Database must be running and accessible

### Verification
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Verify MySQL is accessible (if installed locally)
mysql --version
```

---

## Installation

### Step 1: Clone/Navigate to Project Directory
```bash
cd "/Users/viswajith/Desktop/B3 Group/Trahbiz"
```

### Step 2: Install Dependencies
```bash
npm install
```

This installs all required packages including:
- `next` - React framework
- `react` & `react-dom` - UI library
- `prisma` - ORM
- `@prisma/adapter-mariadb` - MySQL driver for Prisma 7
- `bcryptjs` - Password hashing
- `dotenv` - Environment variable management
- `gsap` - Animation library
- `tailwindcss` - Styling framework

### Step 3: Verify Installation
```bash
npm list prisma
npm list @prisma/adapter-mariadb
```

Should show versions installed (Prisma 7.6.0+, adapter available).

---

## Environment Configuration

### Step 1: Create `.env.local` File
Create a file named `.env.local` in the project root directory:

```bash
touch .env.local
```

### Step 2: Configure Environment Variables

Add the following variables to `.env.local`:

```env
# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/trahbiz_cms?schema=public"

# JWT Secret for Admin Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Node Environment
NODE_ENV="development"
```

### Step 3: Customize Database Connection

Replace the values in `DATABASE_URL`:
- `username` - Your MySQL user (default: `root`)
- `password` - Your MySQL password
- `localhost` - MySQL host (use `127.0.0.1` if localhost doesn't work)
- `3306` - MySQL port (default: 3306)
- `trahbiz_cms` - Database name (can be any name)

**Example for Local Setup**:
```env
DATABASE_URL="mysql://root:your_password@localhost:3306/trahbiz_cms?schema=public"
JWT_SECRET="dev-secret-key-12345"
NODE_ENV="development"
```

**Example for Remote MySQL**:
```env
DATABASE_URL="mysql://username:password@your-host.com:3306/trahbiz_cms?schema=public"
JWT_SECRET="production-secret-key-change-me"
NODE_ENV="production"
```

### Step 4: Verify Environment Variables
```bash
# Check if .env.local is created
ls -la .env.local

# Verify the file can be read
cat .env.local
```

---

## Database Setup

### Step 1: Create MySQL Database

Connect to MySQL and create the database:

```bash
# Using MySQL CLI
mysql -u root -p

# In MySQL shell
mysql> CREATE DATABASE trahbiz_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
mysql> EXIT;
```

Or using a GUI tool (MySQL Workbench, DataGrip, etc.):
1. Right-click on Databases
2. Create New Database
3. Name: `trahbiz_cms`
4. Character Set: `utf8mb4`
5. Collation: `utf8mb4_unicode_ci`

### Step 2: Run Prisma Migrations

Generate Prisma client and apply migrations to create database schema:

```bash
# Generate Prisma client (creates node_modules/.prisma/client)
npx prisma generate

# Apply migrations to your database
npx prisma migrate deploy
```

**Expected Output**:
```
✔ Successfully created migrations folder
✔ migrations applied (this should show migration names)
```

If this is your first setup, you can alternatively run:

```bash
# This will create/reset the database with the schema
npx prisma migrate reset --force
```

**Note**: `migrate reset` is useful for development but destructive - it drops all data. Only use in development!

### Step 3: Seed the Database

Populate the database with default content and admin user:

```bash
npx tsx prisma/seed.ts
```

**Expected Output**:
```
✅ Site Settings
✅ Hero Section
✅ About Section
✅ Features (6)
✅ Services (5)
✅ Properties (6)
✅ Packages (6)
✅ Contact Cards (2)
✅ Nav Links (4)
✅ Social Links (3)
✅ Footer Settings
✅ Default admin: admin@trahbiz.com / admin123
🎉 Seed complete!
```

### Step 4: Verify Database Setup

Check that tables were created correctly:

```bash
# Connect to database
mysql -u root -p trahbiz_cms

# List tables
mysql> SHOW TABLES;
```

Should show tables: `AdminUser`, `SiteSettings`, `HeroSection`, `AboutSection`, `Feature`, `Service`, `Property`, `Package`, `ContactCard`, `NavLink`, `SocialLink`, `FooterSettings`

---

## Running the Project

### Option 1: Development Server (Recommended)

Start the Next.js development server with hot-reload:

```bash
npm run dev
```

**Expected Output**:
```
> trahbiz@1.0.0 dev
> next dev --turbopack

▲ Next.js 16.2.1 (Turbopack)

  ▲ Local:        http://localhost:3000
  ▲ Environments: .env.local

✓ Ready in 2.5s
```

**Access Points**:
- Frontend: http://localhost:3000
- Admin Panel: http://localhost:3000/admin/login

### Option 2: Production Build & Run

Create an optimized production build:

```bash
# Build the project
npm run build

# Start the production server
npm start
```

**Expected Output**:
```
> trahbiz@1.0.0 build
> next build

✓ Compiled successfully
○ 8 static routes
ƒ 14 dynamic routes
```

Then:
```
> trahbiz@1.0.0 start
> next start

▲ Next.js 16.2.1

  ▲ Local:        http://localhost:3000
```

### Option 3: Custom Port

Run development server on a different port:

```bash
npm run dev -- -p 3001
# Or
PORT=3001 npm run dev
```

Then access at: http://localhost:3001

---

## Admin Panel Access

### Initial Login

1. Navigate to: http://localhost:3000/admin/login
2. Enter credentials:
   - **Email**: `admin@trahbiz.com`
   - **Password**: `admin123`
3. Click "Login"

### Change Admin Password

⚠️ **Important**: Change the default admin password immediately in production!

1. In admin dashboard, navigate to account settings (if available)
2. Or modify directly via database:

```bash
# Connect to database
mysql -u root -p trahbiz_cms

# Find admin user
mysql> SELECT id, email FROM AdminUser;

# Update password using bcryptjs hash
# You'll need to hash the new password using bcryptjs
```

Or use a tool like bcryptjs to hash a new password:
```bash
# In Node.js
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('newpassword', 10))"
```

### Admin Features

The admin panel includes:
- **Dashboard**: Overview of CMS content
- **Site Settings**: Edit site name, tagline, social links
- **Hero Section**: Manage hero banner content
- **About Section**: Edit about page content
- **Features**: Create/edit/delete feature items
- **Services**: Manage service offerings
- **Properties**: Add/edit/delete properties
- **Packages**: Create travel/real estate packages
- **Contact Cards**: Manage contact information
- **Navigation**: Configure nav links and visibility
- **Logout**: Secure session termination

---

## Project Structure

```
Trahbiz/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── admin/               # Admin authentication & operations
│   │   │   ├── auth/
│   │   │   │   ├── login/       # POST - Admin login
│   │   │   │   └── register/    # POST - Admin registration
│   │   │   └── me/              # GET - Current session, DELETE - Logout
│   │   └── content/             # Content delivery APIs
│   │       ├── hero/
│   │       ├── about/
│   │       ├── features/
│   │       ├── services/
│   │       ├── properties/
│   │       ├── packages/
│   │       ├── contacts/
│   │       └── settings/
│   ├── admin/                   # Admin panel pages
│   │   ├── login/
│   │   ├── register/
│   │   └── dashboard/
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── about/page.tsx
│   ├── our-properties/page.tsx
│   ├── our-packages/page.tsx
│   └── contact-us/page.tsx
├── components/                  # React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Showcase.tsx            # Features showcase
│   ├── HorizontalScroll.tsx    # Services carousel
│   ├── Properties.tsx
│   ├── Packages.tsx
│   └── ...
├── lib/
│   ├── use-content.ts          # Custom hooks for CMS data
│   └── jwt-utils.ts            # JWT token utilities
├── styles/                      # Tailwind CSS
├── public/                      # Static assets
│   ├── images/
│   └── svgs/
├── prisma/
│   ├── schema.prisma           # Database schema definition
│   ├── migrations/             # Database migration files
│   └── seed.ts                 # Seed script for default data
├── .env.local                  # Environment variables (create this)
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.js
└── README.md
```

---

## Key Features

### 1. Content Management System
- Database-driven content with Prisma ORM
- Admin panel for content creation and editing
- RESTful API endpoints for content delivery
- Fallback default content if API unavailable

### 2. Authentication
- JWT-based admin authentication
- Secure password hashing with bcryptjs
- HTTP-only cookie storage for tokens
- Protected admin routes and API endpoints

### 3. Frontend Components
- Server-side rendered pages with Next.js
- Client-side data fetching with custom hooks
- Responsive design with Tailwind CSS
- GSAP animations for scroll effects
- Dynamic content from database

### 4. API Architecture
- Dynamic route generation preventing pre-rendering
- Consistent error handling
- Content fallback system
- Admin authentication middleware
- CORS support for cross-origin requests

### 5. Database Schema
- 12 interconnected models
- Supports multiple content types
- Flexible field structure
- User management system
- Timestamps for tracking changes

---

## Troubleshooting

### Issue 1: "Can't connect to MySQL server"

**Error Message**:
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solutions**:
1. Verify MySQL is running:
   ```bash
   # On macOS
   brew services list | grep mysql
   
   # Start MySQL if not running
   brew services start mysql@8.0
   ```

2. Check DATABASE_URL in `.env.local`:
   ```env
   # Try using 127.0.0.1 instead of localhost
   DATABASE_URL="mysql://root:password@127.0.0.1:3306/trahbiz_cms?schema=public"
   ```

3. Verify database exists:
   ```bash
   mysql -u root -p -e "SHOW DATABASES;"
   ```

4. Check credentials are correct:
   ```bash
   mysql -u root -p -h localhost
   ```

### Issue 2: "BLOB, TEXT, GEOMETRY or JSON column can't have a default value"

**Error Message**:
```
P3018: BLOB, TEXT, GEOMETRY or JSON column 'metaDesc' can't have a default value
```

**Solution** (Already fixed in this project):
This error occurs with MySQL and TEXT columns with @default(). The schema has been corrected to remove these defaults. If you encounter this error:

1. Ensure you're using the latest schema.prisma:
   ```bash
   git pull
   ```

2. Reset the database:
   ```bash
   npx prisma migrate reset --force
   ```

3. Re-seed:
   ```bash
   npx tsx prisma/seed.ts
   ```

### Issue 3: "PrismaClientInitializationError"

**Error Message**:
```
PrismaClientInitializationError: non-empty, valid PrismaClientOptions
```

**Solution**:
This occurs when Prisma 7 can't find the database adapter. Ensure `.env.local` exists and contains `DATABASE_URL`:

```bash
# Check .env.local exists
ls -la .env.local

# Verify DATABASE_URL is set
grep DATABASE_URL .env.local

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: "Port 3000 is already in use"

**Error Message**:
```
Error: listen EADDRINUSE :::3000
```

**Solutions**:
1. Run on a different port:
   ```bash
   npm run dev -- -p 3001
   ```

2. Kill process using port 3000:
   ```bash
   # Find process
   lsof -i :3000
   
   # Kill by PID
   kill -9 <PID>
   ```

### Issue 5: "Admin login fails with invalid credentials"

**Solution**:
1. Verify seed data was loaded:
   ```bash
   mysql -u root -p trahbiz_cms -e "SELECT * FROM AdminUser;"
   ```

2. If no users exist, re-run seed:
   ```bash
   npx prisma migrate reset --force
   npx tsx prisma/seed.ts
   ```

3. Verify JWT_SECRET is set:
   ```bash
   grep JWT_SECRET .env.local
   ```

### Issue 6: "Build fails with type errors"

**Solution**:
1. Generate Prisma types:
   ```bash
   npx prisma generate
   ```

2. Check TypeScript errors:
   ```bash
   npx tsc --noEmit
   ```

3. Clear build cache:
   ```bash
   rm -rf .next
   npm run build
   ```

### Issue 7: "Content not showing on frontend"

**Diagnosis**:
1. Check browser console for errors (F12)
2. Check API response:
   ```bash
   curl http://localhost:3000/api/content/settings
   ```

3. Verify database has seed data:
   ```bash
   mysql -u root -p trahbiz_cms -e "SELECT COUNT(*) FROM Feature;"
   ```

**Solution**:
If API returns empty or error:
1. Check server logs in terminal
2. Verify .env.local is correct
3. Check MySQL connection:
   ```bash
   mysql -u root -p trahbiz_cms -e "SHOW TABLES;"
   ```

---

## Development Workflow

### Making Content Changes

1. **Via Admin Panel** (Recommended):
   - Login to http://localhost:3000/admin
   - Edit content through UI
   - Changes reflected immediately on frontend

2. **Via Direct Database**:
   ```bash
   mysql -u root -p trahbiz_cms
   UPDATE Feature SET name = 'New Name' WHERE id = 1;
   ```

3. **Via Prisma Studio** (Visual DB Editor):
   ```bash
   npx prisma studio
   ```
   Opens http://localhost:5555 with visual database editor

### Adding New Content Types

1. Update `prisma/schema.prisma` with new model
2. Create migration:
   ```bash
   npx prisma migrate dev --name add_new_model
   ```
3. Create API endpoint in `src/app/api/content/[name]/route.ts`
4. Create hook in `src/lib/use-content.ts`
5. Use hook in frontend components

### Testing APIs

Use curl or REST client (REST Client VS Code extension):

```bash
# Get all features
curl http://localhost:3000/api/content/features

# Get site settings
curl http://localhost:3000/api/content/settings

# Login (get JWT token)
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@trahbiz.com","password":"admin123"}'
```

---

## Performance Tips

### Development
- Keep dev server running for hot-reload
- Use React DevTools extension (Firefox/Chrome)
- Monitor network requests in browser DevTools
- Check server logs for database queries

### Production
- Use `npm run build && npm start`
- Set appropriate `JWT_SECRET` (long, random string)
- Use environment-specific `.env` files
- Enable database connection pooling
- Use CDN for static assets
- Monitor API response times

---

## Security Checklist

- [ ] Change default admin password
- [ ] Update JWT_SECRET to strong random value
- [ ] Secure DATABASE_URL (never commit to git)
- [ ] Use HTTPS in production
- [ ] Enable CORS only for trusted domains
- [ ] Implement rate limiting on login endpoint
- [ ] Regular database backups
- [ ] Monitor admin access logs
- [ ] Update dependencies regularly

---

## Deployment

### Environment Variables for Production
Create `.env.production.local` with:
```env
DATABASE_URL="mysql://prod_user:prod_password@prod-host.com:3306/trahbiz_cms?schema=public"
JWT_SECRET="very-long-random-secure-key-change-this"
NODE_ENV="production"
```

### Deployment Platforms

**Vercel** (Recommended for Next.js):
```bash
npm i -g vercel
vercel
```

**Docker**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm", "start"]
```

**Traditional Server**:
```bash
npm run build
npm start
# Keep running with pm2 or similar
npm i -g pm2
pm2 start "npm start" --name "trahbiz"
```

---

## Support & Resources

- **Prisma Documentation**: https://www.prisma.io/docs/
- **Next.js Documentation**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **MySQL Documentation**: https://dev.mysql.com/doc/

---

## Quick Start Checklist

- [ ] Install Node.js v18+
- [ ] Install MySQL 5.7+
- [ ] Clone/navigate to project
- [ ] Run `npm install`
- [ ] Create `.env.local` with DATABASE_URL and JWT_SECRET
- [ ] Create MySQL database: `trahbiz_cms`
- [ ] Run `npx prisma migrate deploy`
- [ ] Run `npx tsx prisma/seed.ts`
- [ ] Start dev server: `npm run dev`
- [ ] Access frontend: http://localhost:3000
- [ ] Access admin: http://localhost:3000/admin/login
- [ ] Login with `admin@trahbiz.com` / `admin123`
- [ ] Change admin password immediately

---

## Conclusion

You now have a fully functional CMS setup! The project is ready for:
- Content management through the admin panel
- Frontend development and customization
- Deployment to production
- Integration with additional services

For questions or issues, refer to the Troubleshooting section above or check the project documentation.

**Happy coding! 🚀**
