# TestMaxx - Educational Platform

TestMaxx is a comprehensive educational platform designed for students in Classes 6, 7, and 8. It's a sub-platform of StudyMaxx that provides interactive tests, study materials, and AI-powered learning features.

## Features

### 🔐 Authentication
- Google OAuth integration using Firebase Auth
- Automatic user role assignment (student/admin)
- Secure user management with unique IDs

### 🧪 Test Module
- Interactive tests with multiple question types (MCQ, Fill-in-the-blanks, True/False, Assertion-Reason)
- Timer-based test taking with auto-submit
- Instant results and detailed analysis
- Topic-wise performance tracking
- Personalized improvement suggestions

### 📚 Study Material Section
- PDF viewer with built-in reader
- AI-powered document summarization
- Automatic flashcard generation
- Download capabilities for offline study
- Subject and class-wise organization

### 👨‍💼 Admin Dashboard
- Test creation and management interface
- Study material upload system
- Student progress monitoring
- Analytics and reporting tools

### 🎨 UI/UX Features
- Modern, responsive design optimized for 11-14 age group
- Clean branding: "TestMaxx — A StudyMaxx Platform"
- Interactive animations and micro-interactions
- Mobile-first responsive design
- Accessible color system with proper contrast ratios

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **React PDF** for PDF viewing

### Backend
- **Firebase Authentication** (Google OAuth)
- **Firestore** for database
- **Firebase Storage** for file uploads
- **Firebase Hosting** for deployment

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Auth/            # Authentication components
│   └── Layout/          # Layout components (Header, Sidebar)
├── contexts/            # React contexts (Auth, etc.)
├── pages/               # Main application pages
├── services/            # Firebase service functions
├── types/               # TypeScript type definitions
├── config/              # Firebase configuration
└── utils/               # Utility functions
```

## Firebase Setup Instructions

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable Google Analytics (optional)

### Step 2: Enable Authentication
1. In your Firebase project, go to "Authentication" > "Sign-in method"
2. Enable "Google" as a sign-in provider
3. Add your domain to authorized domains

### Step 3: Create Firestore Database
1. Go to "Firestore Database" and click "Create database"
2. Choose "Start in test mode" for development
3. Select a location for your database

### Step 4: Set up Firebase Storage
1. Go to "Storage" and click "Get started"
2. Choose "Start in test mode" for development
3. Select a location for your storage

### Step 5: Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" and click "Web app"
3. Register your app and copy the configuration
4. Replace the config in `src/config/firebase.ts`

### Step 6: Environment Setup
1. Create a `.env` file in the project root:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

2. Update `src/config/firebase.ts` to use environment variables:
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

## Installation and Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Firebase**
   - Follow the Firebase setup instructions above
   - Update `src/config/firebase.ts` with your Firebase configuration

3. **Start Development Server**
```bash
npm run dev
```

4. **Build for Production**
```bash
npm run build
```

## Key Components

### Authentication Flow
- Users sign in with Google OAuth
- New users are automatically created in Firestore
- Role-based routing (student vs admin)
- Persistent authentication state

### Student Features
- Dashboard with progress overview
- Test taking interface with timer
- Study material viewer with AI features
- Results and analytics

### Admin Features
- Dashboard with platform statistics
- Test creation and management
- Study material upload
- Student progress monitoring

## Database Structure

### Users Collection
```typescript
{
  uid: string,
  email: string,
  displayName: string,
  photoURL?: string,
  role: 'student' | 'admin',
  class?: 6 | 7 | 8,
  createdAt: Date
}
```

### Tests Collection
```typescript
{
  id: string,
  title: string,
  description: string,
  class: 6 | 7 | 8,
  subject: string,
  duration: number,
  questions: Question[],
  totalMarks: number,
  createdAt: Date,
  isActive: boolean
}
```

### Study Materials Collection
```typescript
{
  id: string,
  title: string,
  description: string,
  class: 6 | 7 | 8,
  subject: string,
  fileUrl: string,
  fileName: string,
  uploadedAt: Date,
  summary?: string,
  flashcards?: Flashcard[]
}
```

## Future Enhancements

- AI-powered question generation
- Real-time collaborative features
- Mobile app development
- Advanced analytics and reporting
- Integration with more educational content
- Multi-language support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.