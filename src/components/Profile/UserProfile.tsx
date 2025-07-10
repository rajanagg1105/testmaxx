import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  School, 
  MapPin, 
  Calendar,
  Camera,
  Save,
  Edit3,
  Phone,
  Users,
  Award,
  BookOpen,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserPreferences } from '../../contexts/UserPreferencesContext';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../config/firebase';

interface UserProfileData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'student' | 'admin';
  createdAt: Date;
  // Extended profile fields
  school?: string;
  grade?: string;
  city?: string;
  state?: string;
  phoneNumber?: string;
  parentName?: string;
  parentPhone?: string;
  dateOfBirth?: string;
  interests?: string[];
  bio?: string;
  achievements?: string[];
}

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { preferences, updatePreferences } = useUserPreferences();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [changingClass, setChangingClass] = useState(false);

  useEffect(() => {
    if (isOpen && currentUser) {
      loadProfileData();
    }
  }, [isOpen, currentUser]);

  const loadProfileData = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const profileDoc = await getDoc(doc(db, 'userProfiles', currentUser.uid));
      
      if (profileDoc.exists()) {
        setProfileData(profileDoc.data() as UserProfileData);
      } else {
        // Create initial profile data from current user
        const initialProfile: UserProfileData = {
          uid: currentUser.uid,
          email: currentUser.email!,
          displayName: currentUser.displayName!,
          photoURL: currentUser.photoURL || undefined,
          role: currentUser.role,
          createdAt: currentUser.createdAt,
          interests: [],
          achievements: []
        };
        setProfileData(initialProfile);
        // Save initial profile to Firestore
        await setDoc(doc(db, 'userProfiles', currentUser.uid), initialProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserProfileData, value: any) => {
    if (!profileData) return;
    setProfileData({ ...profileData, [field]: value });
  };

  const handleArrayInputChange = (field: 'interests' | 'achievements', value: string) => {
    if (!profileData) return;
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setProfileData({ ...profileData, [field]: items });
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;

    try {
      setUploadingPhoto(true);
      const photoRef = ref(storage, `profile-photos/${currentUser.uid}/${file.name}`);
      const snapshot = await uploadBytes(photoRef, file);
      const photoURL = await getDownloadURL(snapshot.ref);
      
      setProfileData(prev => prev ? { ...prev, photoURL } : null);
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    if (!profileData || !currentUser) return;

    try {
      setSaving(true);
      await updateDoc(doc(db, 'userProfiles', currentUser.uid), profileData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangeClass = async () => {
    if (!currentUser) return;

    const confirmChange = window.confirm(`
      This will reset your class selection and redirect you to choose your class again. 
      
      ✓ All your progress will be preserved
      ✓ Your test attempts will remain saved
      ✓ Your study materials will still be available
      
      Are you sure you want to continue?
    `.trim());

    if (!confirmChange) return;

    try {
      setChangingClass(true);
      
      // Reset user preferences to trigger class selection
      await updatePreferences({
        selectedClass: undefined,
        hasCompletedOnboarding: false
      });

      // Close profile modal
      onClose();
      
      // Navigate to root which will trigger the onboarding flow
      navigate('/');
    } catch (error) {
      console.error('Error changing class:', error);
      alert('Failed to change class. Please try again.');
    } finally {
      setChangingClass(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : profileData ? (
          <div className="p-6">
            {/* Profile Photo and Basic Info */}
            <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8 mb-8">
              <div className="flex flex-col items-center">
                <div className="relative">
                  {profileData.photoURL ? (
                    <img
                      src={profileData.photoURL}
                      alt={profileData.displayName}
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center border-4 border-gray-200">
                      <User className="h-16 w-16 text-white" />
                    </div>
                  )}
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        disabled={uploadingPhoto}
                      />
                    </label>
                  )}
                  {uploadingPhoto && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                <div className="text-center mt-4">
                  <h3 className="text-xl font-bold text-gray-900">{profileData.displayName}</h3>
                  <p className="text-gray-600 capitalize">{profileData.role}</p>
                  <div className="flex items-center justify-center space-x-1 mt-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(profileData.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  {/* Current Class Display */}
                  {currentUser?.role === 'student' && preferences.selectedClass && (
                    <div className="mt-3 flex flex-col items-center space-y-2">
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        Class {preferences.selectedClass}
                      </div>
                      <button
                        onClick={handleChangeClass}
                        disabled={changingClass}
                        className="flex items-center space-x-1 text-sm text-orange-600 hover:text-orange-800 font-medium transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`h-4 w-4 ${changingClass ? 'animate-spin' : ''}`} />
                        <span>{changingClass ? 'Changing...' : 'Change Class'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Basic Information
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.displayName}
                        onChange={(e) => handleInputChange('displayName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{profileData.displayName}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{profileData.email}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={profileData.dateOfBirth || ''}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{profileData.dateOfBirth || 'Not specified'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phoneNumber || ''}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{profileData.phoneNumber || 'Not specified'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Education & Location */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Education & Location
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.school || ''}
                        onChange={(e) => handleInputChange('school', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter school name"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <School className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{profileData.school || 'Not specified'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade/Class</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.grade || ''}
                        onChange={(e) => handleInputChange('grade', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter current grade"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{profileData.grade || 'Not specified'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.city || ''}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter city"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{profileData.city || 'Not specified'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.state || ''}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter state"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{profileData.state || 'Not specified'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Parent/Guardian Information */}
            {profileData.role === 'student' && (
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                  Parent/Guardian Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.parentName || ''}
                        onChange={(e) => handleInputChange('parentName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter parent/guardian name"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{profileData.parentName || 'Not specified'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.parentPhone || ''}
                        onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter parent/guardian phone"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{profileData.parentPhone || 'Not specified'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                  About Me
                </h4>
                {isEditing ? (
                  <textarea
                    value={profileData.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-900">{profileData.bio || 'No bio added yet.'}</p>
                )}
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                  Interests
                </h4>
                {isEditing ? (
                  <textarea
                    value={profileData.interests?.join(', ') || ''}
                    onChange={(e) => handleArrayInputChange('interests', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter interests separated by commas (e.g., Mathematics, Science, Reading)"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profileData.interests && profileData.interests.length > 0 ? (
                      profileData.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">No interests added yet.</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Achievements */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                Achievements
              </h4>
              {isEditing ? (
                <textarea
                  value={profileData.achievements?.join(', ') || ''}
                  onChange={(e) => handleArrayInputChange('achievements', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter achievements separated by commas"
                />
              ) : (
                <div className="space-y-2">
                  {profileData.achievements && profileData.achievements.length > 0 ? (
                    profileData.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="text-gray-900">{achievement}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-500">No achievements added yet.</span>
                  )}
                </div>
              )}
            </div>

            {/* Class Change Information */}
            {currentUser?.role === 'student' && (
              <div className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-orange-800 mb-2">📚 Class Management</h4>
                <p className="text-sm text-orange-700 mb-3">
                  Need to change your class? You can update your class selection at any time. 
                  Your progress and achievements will be preserved.
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-orange-600">
                    Current Class: <span className="font-medium">Class {preferences.selectedClass || 'Not Selected'}</span>
                  </div>
                  {preferences.selectedClass && (
                    <button
                      onClick={handleChangeClass}
                      disabled={changingClass}
                      className="flex items-center space-x-1 px-3 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm disabled:opacity-50"
                    >
                      <RefreshCw className={`h-3 w-3 ${changingClass ? 'animate-spin' : ''}`} />
                      <span>{changingClass ? 'Changing...' : 'Change Class'}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">Failed to load profile data.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;