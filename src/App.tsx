import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserPreferencesProvider, useUserPreferences } from './contexts/UserPreferencesContext';
import LoginPage from './components/Auth/LoginPage';
import ClassSelection from './components/Onboarding/ClassSelection';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import StudentDashboard from './pages/StudentDashboard';
import TestsPage from './pages/TestsPage';
import StudyMaterialPage from './pages/StudyMaterialPage';
import VideosPage from './pages/VideosPage';
import AdminDashboard from './pages/AdminDashboard';
import TestManager from './components/Admin/TestManager';
import MaterialManager from './components/Admin/MaterialManager';
import StudentManager from './components/Admin/StudentManager';
import VideoManager from './components/Admin/VideoManager';

const OnboardingFlow: React.FC = () => {
  const { updatePreferences } = useUserPreferences();

  const handleClassSelect = async (classNumber: 6 | 7 | 8) => {
    try {
      await updatePreferences({
        selectedClass: classNumber,
        hasCompletedOnboarding: true
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return <ClassSelection onClassSelect={handleClassSelect} />;
};

const AppContent: React.FC = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const { preferences, loading: preferencesLoading } = useUserPreferences();

  if (authLoading || preferencesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading TestMaxx...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage />;
  }

  // Show onboarding for students who haven't completed it
  if (currentUser.role === 'student' && !preferences.hasCompletedOnboarding) {
    return <OnboardingFlow />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <Routes>
            {currentUser.role === 'admin' ? (
              <>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/tests" element={<TestManager />} />
                <Route path="/admin/materials" element={<MaterialManager />} />
                <Route path="/admin/videos" element={<VideoManager />} />
                <Route path="/admin/students" element={<StudentManager />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </>
            ) : (
              <>
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/tests" element={<TestsPage />} />
                <Route path="/study-material" element={<StudyMaterialPage />} />
                <Route path="/videos" element={<VideosPage />} />
                <Route path="/results" element={<div className="p-6"><h1 className="text-2xl font-bold">My Results</h1><p className="text-gray-600 mt-2">Results page coming soon...</p></div>} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <UserPreferencesProvider>
        <Router>
          <AppContent />
        </Router>
      </UserPreferencesProvider>
    </AuthProvider>
  );
}

export default App;