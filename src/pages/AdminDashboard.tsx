import React from 'react';
import { 
  Users, 
  FileText, 
  BookOpen, 
  TrendingUp, 
  Plus,
  BarChart3,
  Calendar,
  Target
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Students', value: '1,234', icon: Users, color: 'blue' },
    { label: 'Total Tests', value: '48', icon: FileText, color: 'green' },
    { label: 'Study Materials', value: '156', icon: BookOpen, color: 'purple' },
    { label: 'Test Attempts', value: '8,567', icon: TrendingUp, color: 'orange' },
  ];

  const recentActivity = [
    { id: 1, action: 'New student registered', user: 'Arjun Sharma', time: '2 minutes ago' },
    { id: 2, action: 'Test completed', user: 'Priya Patel', time: '5 minutes ago' },
    { id: 3, action: 'Study material downloaded', user: 'Rahul Kumar', time: '8 minutes ago' },
    { id: 4, action: 'New test created', user: 'Admin', time: '15 minutes ago' },
  ];

  const topPerformers = [
    { id: 1, name: 'Arjun Sharma', class: 8, score: 95, tests: 12 },
    { id: 2, name: 'Priya Patel', class: 7, score: 92, tests: 10 },
    { id: 3, name: 'Rahul Kumar', class: 8, score: 89, tests: 15 },
    { id: 4, name: 'Sneha Singh', class: 6, score: 87, tests: 8 },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'green': return 'bg-green-100 text-green-600';
      case 'purple': return 'bg-purple-100 text-purple-600';
      case 'orange': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your TestMaxx platform and monitor student progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-5 w-5" />
            <span>Create New Test</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors">
            <BookOpen className="h-5 w-5" />
            <span>Upload Study Material</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
            <BarChart3 className="h-5 w-5" />
            <span>View Analytics</span>
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
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full mt-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Top Performers</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topPerformers.map((student, index) => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">Class {student.class} • {student.tests} tests</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{student.score}%</div>
                    <div className="text-sm text-gray-500">Avg Score</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Platform Overview */}
      <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Platform Overview</h2>
            <p className="text-blue-100">TestMaxx is helping students excel across Classes 6, 7, and 8</p>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold">87%</div>
              <div className="text-xs text-blue-100">Avg Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">92%</div>
              <div className="text-xs text-blue-100">Completion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">4.8</div>
              <div className="text-xs text-blue-100">Student Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;