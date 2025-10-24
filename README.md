# JD Marc Construction - Modern Construction Management Platform

A comprehensive, modern web application built for JD Marc Construction, featuring advanced dashboard management, real-time communication, and streamlined project workflows.

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Backend**: Supabase (Database + Authentication + Real-time)
- **UI Components**: Radix UI + Custom Components
- **State Management**: Zustand + React Context
- **Deployment**: Hostinger (Frontend) + Supabase (Backend)

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/           # Dashboard components for different departments
│   ├── auth/            # Authentication components
│   ├── calls/           # Video call and communication features
│   ├── features/        # Feature-specific components
│   ├── layout/          # Layout and navigation components
│   ├── sections/        # Page sections and content blocks
│   ├── team/            # Team collaboration components
│   └── ui/              # Reusable UI components
├── contexts/            # React contexts for global state
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries and configurations
├── pages/               # Main application pages
├── services/            # API services and external integrations
├── stores/              # Zustand state stores
├── styles/              # Global styles and themes
└── utils/               # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
   cd jd-marc-construction
   ```

2. **Install dependencies**
   ```bash
npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Start development server**
   ```bash
npm run dev
```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🎯 Features

### Department Dashboards
- **Admin Dashboard**: System administration and user management
- **Accounts Dashboard**: Financial management and accounting
- **Business Administration**: Business development and operations
- **Executive Assistant**: Executive support and coordination
- **Digital Marketing**: Marketing campaigns and analytics
- **HR Dashboard**: Human resources and employee management
- **Project Dashboard**: Project management and tracking
- **Secretariat Dashboard**: Administrative support and documentation

### Core Functionality
- **Authentication**: Secure login with department-based access
- **Real-time Communication**: Video calls and team collaboration
- **Responsive Design**: Mobile-first approach with modern UI
- **Theme Support**: Light/dark mode with custom themes
- **Analytics**: Business intelligence and performance tracking
- **File Management**: Document upload and management via Supabase

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run format` - Format code with Prettier
- `npm run lint` - Run ESLint

### Code Standards

- **TypeScript**: Strict type checking enabled
- **Prettier**: Consistent code formatting
- **ESLint**: Code quality and best practices
- **Import Aliases**: Use `@/` for src directory imports

## 🌐 Deployment

### Frontend (Hostinger)
1. Build the project: `npm run build`
2. Upload the `dist/` folder to your Hostinger hosting
3. Configure domain and SSL settings

### Backend (Supabase)
1. Set up Supabase project
2. Configure database schema
3. Set up authentication policies
4. Deploy edge functions if needed

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the schema migration from `supabase/schema.sql`
3. Configure authentication settings
4. Set up storage buckets for file uploads

### Environment Variables
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is proprietary software developed for JD Marc Construction.

## 👥 Team

**JD Marc Construction Team**
- Development: Modern React/TypeScript stack
- Design: Custom UI components with Tailwind CSS
- Backend: Supabase integration for scalability

## 📞 Support

For technical support or questions, please contact the development team.

---

**Built with ❤️ for JD Marc Construction**