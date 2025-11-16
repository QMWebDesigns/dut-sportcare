# DUT SportCare 🏥⚡

A comprehensive injury management platform for DUT student athletes, connecting injured athletes with healthcare practitioners for faster recovery and better outcomes.

## 🚀 Features

- **Role-based Access Control** (Students, Practitioners, Admins)
- **Injury Reporting & Tracking** with severity levels and progress monitoring
- **Practitioner Assignments** by administrators
- **Recovery Progress Logging** with pain and mobility tracking
- **Appointment Scheduling** with multiple status states
- **Secure Messaging System** between users
- **File Uploads** for medical documents and images
- **Real-time Dashboard** for each user role

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Backend & Database
- **Supabase** (PostgreSQL, Authentication, Storage)
- **Row Level Security** with comprehensive policies
- **Real-time subscriptions**

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Router.tsx      # Custom client-side router
│   ├── ProtectedRoute.tsx  # Route guarding
│   ├── Landing.tsx     # Public landing page
│   └── Link.tsx        # Navigation component
├── contexts/
│   └── AuthContext.tsx # Authentication state management
├── pages/
│   ├── Login.tsx       # Authentication pages
│   ├── Register.tsx
│   └── [role]/
│       ├── StudentDashboard.tsx
│       ├── PractitionerDashboard.tsx
│       └── AdminDashboard.tsx
├── lib/
│   └── supabase.ts     # Supabase client configuration
└── ...
```

## 🗄 Database Schema

The database includes 7 main tables with comprehensive RLS policies:

- **users** - User profiles with role-based access
- **injuries** - Injury reports with status tracking
- **practitioner_assignments** - Practitioner-student relationships
- **recovery_logs** - Progress notes and exercise prescriptions
- **appointments** - Scheduling with multiple status states
- **messages** - Secure communication between users
- **files** - Document and image storage

See `20251001032114_create_initial_schema.sql` for complete schema and security policies.

## 🔐 Authentication & Authorization

- **Supabase Authentication** with email/password
- **Role-based permissions** (student, practitioner, admin)
- **Protected routes** with automatic redirects
- **Session persistence** and token refresh

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/QMWebDesigns/dut-sportcare.git
   cd dut-sportcare
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Deployment

The project is configured for deployment on **Vercel**:

1. **Add environment variables** in Vercel dashboard
2. **Connect your GitHub repository**
3. **Automatic deployments** on push to main

Live demo: [https://dut-sportcare.vercel.app](https://dut-sportcare.vercel.app)

## 🔧 Configuration Files

- `vite.config.ts` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS setup
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - Code linting rules

## 👥 User Roles & Permissions

### Student
- Report new injuries
- View assigned practitioners
- Access recovery plans
- Schedule appointments
- Message practitioners

### Practitioner
- View assigned students
- Create recovery logs
- Update injury status
- Manage appointments
- Communicate with students

### Administrator
- User management
- Practitioner assignments
- System oversight
- Full data access

## 📞 Support

For support or questions about DUT SportCare, please contact the development team or create an issue in the GitHub repository.

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

**Built with ❤️ for DUT Student Athletes**

- Professional formatting

You can save this as `README.md` in your project root and push it to GitHub!
