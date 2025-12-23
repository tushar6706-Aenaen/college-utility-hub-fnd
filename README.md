# College Utility Hub - Frontend

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the frontend folder:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Features

### Student Portal
- **Dashboard**: Overview with quick stats and recent updates
- **Notices**: View and search college announcements
- **Events**: Browse upcoming events with filters
- **Lost & Found**: Report and search for lost/found items
- **Feedback**: Submit feedback to administration

### Admin Portal
- **Dashboard**: Statistics and recent activity overview
- **Manage Notices**: Create, edit, and delete notices
- **Manage Events**: Create, edit, and delete events
- **Moderate Lost & Found**: Approve or reject student submissions
- **View Feedback**: Review and resolve student feedback

## Tech Stack
- React 18 with Vite
- Tailwind CSS for styling
- shadcn/ui components
- React Router DOM for navigation
- React Hook Form for forms
- Axios for API calls
- Sonner for toast notifications

## Project Structure
```
src/
├── components/
│   ├── common/       # Shared components
│   ├── layout/       # Layout components
│   └── ui/           # shadcn/ui components
├── context/          # React contexts
├── lib/              # Utilities and axios config
└── pages/            # Page components
    ├── admin/        # Admin pages
    └── student/      # Student pages
```

## Default Credentials
- **Admin**: admin@college.com / admin123
- **Student**: Register through the app

