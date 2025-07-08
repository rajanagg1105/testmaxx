import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  BookOpen, 
  TrendingUp, 
  Plus,
  BarChart3,
  Calendar,
  Target,
  Settings,
  Award,
  Clock
} from 'lucide-react';
import { getAllTests, getAllStudyMaterials } from '../services/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Test, StudyMaterial } from '../types';
import TestManager from '../components/Admin/TestManager';
import MaterialManager from '../components/Admin/MaterialManager';
import StudentManager from '../components/Admin/StudentManager';
import VideoManager from '../components/Admin/VideoManager';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tests' | 'materials' | 'students' | 'videos'>('dashboard');
  const [tests, setTests] = useState<Test[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [studentCount, setStudentCount] = useState(0);
  const [testAttempts, setTestAttempts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    
    // Set up auto-refresh for real-time updates
    const interval = setInterval(() => {
      loadDashboardData();
    }, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load tests and materials
      const [testsData, materialsData] = await Promise.all([
        getAllTests(),
        getAllStudyMaterials()
      ]);
      
      setTests(testsData);
      setMaterials(materialsData);

      // Load student count
      const studentsQuery = query(collection(db, 'users'), where('role', '==', 'student'));
      const studentsSnapshot = await getDocs(studentsQuery);
      setStudentCount(studentsSnapshot.size);

      // Load test attempts count
      const attemptsSnapshot = await getDocs(collection(db, 'testAttempts'));
      setTestAttempts(attemptsSnapshot.size);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Real stats based on actual data
  const stats = {
    totalStudents: studentCount,
    totalTests: tests.length,
    activeTests: tests.filter(t => t.isActive).length,
    totalMaterials: materials.length,
    totalQuestions: tests.reduce((sum, test) => sum + test.questions.length, 0),
    testAttempts: testAttempts
  };

  const recentActivity = [
    { id: 1, action: 'New test created', user: 'Admin', time: '2 minutes ago', type: 'admin' },
    { id: 2, action: 'Study material uploaded', user: 'Admin', time: '15 minutes ago', type: 'admin' },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'green': return 'bg-green-100 text-green-600';
      case 'purple': return 'bg-purple-100 text-purple-600';
      case 'orange': return 'bg-orange-100 text-orange-600';
      case 'red': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="h-4 w-4 text-blue-600" />;
      case 'test': return <FileText className="h-4 w-4 text-green-600" />;
      case 'material': return <BookOpen className="h-4 w-4 text-purple-600" />;
      case 'admin': return <Settings className="h-4 w-4 text-orange-600" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  // Render different tabs
  if (activeTab === 'tests') {
    return <TestManager />;
  }

  if (activeTab === 'materials') {
    return <MaterialManager />;
  }

  if (activeTab === 'students') {
    return <StudentManager />;
  }

  if (activeTab === 'videos') {
    return <VideoManager />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your TestMaxx platform and monitor student progress</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'tests'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Manage Tests
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'materials'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Study Materials
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'videos'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Manage Videos
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'students'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Students
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                </div>
                <div className={`p-3 rounded-lg ${getColorClasses('blue')}`}>
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Tests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTests}</p>
                  <p className="text-xs text-green-600">{stats.activeTests} active</p>
                </div>
                <div className={`p-3 rounded-lg ${getColorClasses('green')}`}>
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Study Materials</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalMaterials}</p>
                </div>
                <div className={`p-3 rounded-lg ${getColorClasses('purple')}`}>
                  <BookOpen className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Test Attempts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.testAttempts}</p>
                </div>
                <div className={`p-3 rounded-lg ${getColorClasses('orange')}`}>
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button 
                onClick={() => setActiveTab('tests')}
                className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Create New Test</span>
              </button>
              <button 
                onClick={() => setActiveTab('materials')}
                className="flex items-center justify-center space-x-2 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <BookOpen className="h-5 w-5" />
                <span>Upload Study Material</span>
              </button>
              <button 
                onClick={() => setActiveTab('videos')}
                className="flex items-center justify-center space-x-2 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Upload Video</span>
              </button>
              <button 
                onClick={() => setActiveTab('students')}
                className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                <BarChart3 className="h-5 w-5" />
                <span>View Students</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="bg-gray-100 p-2 rounded-full mt-1">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{activity.time}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>
            </div>

            {/* Platform Statistics */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Platform Statistics</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Total Questions</p>
                        <p className="text-sm text-gray-500">Across all tests</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Target className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Active Tests</p>
                        <p className="text-sm text-gray-500">Currently available</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{stats.activeTests}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Study Materials</p>
                        <p className="text-sm text-gray-500">Available resources</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{stats.totalMaterials}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Tests */}
          {tests.length > 0 && (
            <div className="mt-8 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Tests</h2>
                  <button 
                    onClick={() => setActiveTab('tests')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View All Tests →
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tests.slice(0, 6).map((test) => (
                    <div key={test.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{test.title}</h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                              Class {test.class}
                            </span>
                            <span className="text-xs text-gray-600">{test.subject}</span>
                          </div>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          test.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {test.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                        <div className="text-center">
                          <div className="font-medium text-gray-900">{test.questions.length}</div>
                          <div>Questions</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-gray-900">{test.duration}m</div>
                          <div>Duration</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-gray-900">{test.totalMarks}</div>
                          <div>Marks</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Platform Overview */}
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Platform Overview</h2>
                <p className="text-blue-100">TestMaxx is helping students excel across Classes 6, 7, and 8</p>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.totalTests}</div>
                  <div className="text-xs text-blue-100">Total Tests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.totalQuestions}</div>
                  <div className="text-xs text-blue-100">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.totalMaterials}</div>
                  <div className="text-xs text-blue-100">Materials</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;