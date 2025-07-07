import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search,
  Filter,
  MoreVertical,
  Mail,
  Calendar,
  Award,
  TrendingUp,
  BookOpen,
  Target,
  Clock
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  class: number;
  joinedDate: string;
  testsCompleted: number;
  averageScore: number;
  totalStudyTime: number;
  lastActive: string;
  status: 'active' | 'inactive';
}

const StudentManager: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const classes = [6, 7, 8];

  useEffect(() => {
    // Simulate loading students data
    // In real implementation, this would fetch from Firestore users collection
    setTimeout(() => {
      const mockStudents: Student[] = [
        {
          id: '1',
          name: 'Arjun Sharma',
          email: 'arjun.sharma@email.com',
          class: 8,
          joinedDate: '2024-01-15',
          testsCompleted: 12,
          averageScore: 95,
          totalStudyTime: 240,
          lastActive: '2024-01-20',
          status: 'active'
        },
        {
          id: '2',
          name: 'Priya Patel',
          email: 'priya.patel@email.com',
          class: 7,
          joinedDate: '2024-01-10',
          testsCompleted: 10,
          averageScore: 92,
          totalStudyTime: 180,
          lastActive: '2024-01-19',
          status: 'active'
        },
        {
          id: '3',
          name: 'Rahul Kumar',
          email: 'rahul.kumar@email.com',
          class: 8,
          joinedDate: '2024-01-08',
          testsCompleted: 15,
          averageScore: 89,
          totalStudyTime: 320,
          lastActive: '2024-01-18',
          status: 'active'
        },
        {
          id: '4',
          name: 'Sneha Singh',
          email: 'sneha.singh@email.com',
          class: 6,
          joinedDate: '2024-01-12',
          testsCompleted: 8,
          averageScore: 87,
          totalStudyTime: 150,
          lastActive: '2024-01-17',
          status: 'active'
        },
        {
          id: '5',
          name: 'Vikram Joshi',
          email: 'vikram.joshi@email.com',
          class: 7,
          joinedDate: '2024-01-05',
          testsCompleted: 6,
          averageScore: 78,
          totalStudyTime: 90,
          lastActive: '2024-01-10',
          status: 'inactive'
        }
      ];
      setStudents(mockStudents);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const getStudentStats = () => {
    return {
      total: students.length,
      active: students.filter(s => s.status === 'active').length,
      inactive: students.filter(s => s.status === 'inactive').length,
      byClass: {
        6: students.filter(s => s.class === 6).length,
        7: students.filter(s => s.class === 7).length,
        8: students.filter(s => s.class === 8).length
      },
      averageScore: Math.round(students.reduce((sum, s) => sum + s.averageScore, 0) / students.length),
      totalTests: students.reduce((sum, s) => sum + s.testsCompleted, 0)
    };
  };

  const stats = getStudentStats();

  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Student Management</h1>
            <p className="text-gray-600">Monitor and manage student progress and activities</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTests}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Class Distribution</p>
              <div className="text-xs text-gray-600">
                <div>6: {stats.byClass[6]} | 7: {stats.byClass[7]} | 8: {stats.byClass[8]}</div>
              </div>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <Target className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Class Filter */}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Classes</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>Class {cls}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            <span>{filteredStudents.length} students found</span>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading students...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-500">
              {students.length === 0 
                ? "No students have registered yet."
                : "No students match your current filters. Try adjusting your search criteria."
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Student</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Class</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Tests Completed</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Average Score</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Study Time</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Last Active</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                  <th className="text-right py-3 px-6 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-medium">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{student.name}</h3>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Mail className="h-3 w-3" />
                            <span>{student.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                        Class {student.class}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">{student.testsCompleted}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-gray-400" />
                        <span className={`text-sm font-medium ${
                          student.averageScore >= 90 ? 'text-green-600' :
                          student.averageScore >= 80 ? 'text-blue-600' :
                          student.averageScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {student.averageScore}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{formatStudyTime(student.totalStudyTime)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(student.lastActive).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        student.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end">
                        <div className="relative">
                          <button
                            onClick={() => setShowDropdown(showDropdown === student.id ? null : student.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          {showDropdown === student.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setShowDropdown(null)}
                              ></div>
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      // TODO: Implement view profile
                                      setShowDropdown(null);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    View Profile
                                  </button>
                                  <button
                                    onClick={() => {
                                      // TODO: Implement view progress
                                      setShowDropdown(null);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    View Progress
                                  </button>
                                  <button
                                    onClick={() => {
                                      // TODO: Implement send message
                                      setShowDropdown(null);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Send Message
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentManager;