import React, { useState } from 'react';
import { BookOpen, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserPreferences } from '../../contexts/UserPreferencesContext';
import { useNavigate } from 'react-router-dom';
import UserProfile from '../Profile/UserProfile';
import ConfirmationDialog from '../Common/ConfirmationDialog';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { preferences, updatePreferences } = useUserPreferences();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showClassChangeDialog, setShowClassChangeDialog] = useState(false);
  const [changingClass, setChangingClass] = useState(false);

  const handleResetPreferences = async () => {
    setShowClassChangeDialog(true);
  };

  const confirmClassChange = async () => {
    try {
      setChangingClass(true);
      await updatePreferences({
        selectedClass: null,
        hasCompletedOnboarding: false
      });
      setShowClassChangeDialog(false);
      // Navigate to root which will trigger the onboarding flow
      navigate('/');
    } catch (error) {
      console.error('Error resetting preferences:', error);
      alert('Failed to reset preferences. Please try again.');
    } finally {
      setChangingClass(false);
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TestMaxx
                </h1>
                <p className="text-xs text-gray-500">A StudyMaxx Platform</p>
              </div>
            </div>

            {/* User Class Display */}
            {currentUser?.role === 'student' && preferences.selectedClass && (
              <div className="hidden md:flex items-center space-x-4 bg-gray-50 px-4 py-2 rounded-lg">
                <div className="text-sm">
                  <span className="text-gray-600">Class:</span>
                  <span className="font-medium text-blue-600 ml-1">{preferences.selectedClass}</span>
                </div>
              </div>
            )}

            {currentUser && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowProfile(true)}
                    className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-2 transition-colors"
                  >
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt={currentUser.displayName}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-gray-900">{currentUser.displayName}</p>
                      <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
                    </div>
                  </button>
                </div>

                {/* Settings Dropdown */}
                {currentUser.role === 'student' && (
                  <div className="relative">
                    <button 
                      onClick={() => setShowSettings(!showSettings)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Settings className="h-5 w-5" />
                    </button>
                    {showSettings && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setShowSettings(false)}
                        ></div>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                handleResetPreferences();
                                setShowSettings(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Change Class
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* User Profile Modal */}
      {showProfile && (
        <UserProfile 
          isOpen={showProfile} 
          onClose={() => setShowProfile(false)} 
        />
      )}

      {/* Class Change Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showClassChangeDialog}
        onClose={() => setShowClassChangeDialog(false)}
        onConfirm={confirmClassChange}
        title="Change Class"
        message={`You are about to change your class selection.

✓ All your progress will be preserved
✓ Your test attempts will remain saved  
✓ Your study materials will still be available
✓ You can access content for your new class

This will redirect you to the class selection page.`}
        confirmText="Change Class"
        cancelText="Keep Current Class"
        type="info"
        loading={changingClass}
      />
    </>
  );
};

export default Header;