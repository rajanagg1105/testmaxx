import React, { useState } from 'react';
import { 
  Clock, 
  Users, 
  Star, 
  Play, 
  Filter,
  Search,
  BookOpen,
  Trophy,
  Target
} from 'lucide-react';

const TestsPage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<number | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const tests = [
    {
      id: 1,
      title: 'Algebra Fundamentals',
      subject: 'Mathematics',
      class: 7,
      duration: 45,
      questions: 25,
      difficulty: 'Medium',
      rating: 4.5,
      attempts: 342,
      description: 'Test your understanding of basic algebraic concepts and problem-solving techniques.'
    },
    {
      id: 2,
      title: 'Forces and Motion',
      subject: 'Physics',
      class: 8,
      duration: 60,
      questions: 30,
      difficulty: 'Hard',
      rating: 4.7,
      attempts: 287,
      description: 'Comprehensive test covering Newton\'s laws, friction, and motion equations.'
    },
    {
      id: 3,
      title: 'Grammar Essentials',
      subject: 'English',
      class: 6,
      duration: 30,
      questions: 20,
      difficulty: 'Easy',
      rating: 4.3,
      attempts: 456,
      description: 'Master the basics of English grammar with this comprehensive assessment.'
    },
    {
      id: 4,
      title: 'Chemical Reactions',
      subject: 'Chemistry',
      class: 8,
      duration: 50,
      questions: 28,
      difficulty: 'Medium',
      rating: 4.6,
      attempts: 198,
      description: 'Explore different types of chemical reactions and their properties.'
    },
    {
      id: 5,
      title: 'Indian History - Medieval Period',
      subject: 'History',
      class: 7,
      duration: 40,
      questions: 22,
      difficulty: 'Medium',
      rating: 4.4,
      attempts: 234,
      description: 'Learn about the major events and dynasties of medieval Indian history.'
    },
  ];

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'English', 'History', 'Geography'];
  const classes = [6, 7, 8];

  const filteredTests = tests.filter(test => {
    const matchesClass = selectedClass === 'all' || test.class === selectedClass;
    const matchesSubject = selectedSubject === 'all' || test.subject === selectedSubject;
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSubject && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Tests</h1>
        <p className="text-gray-600">Choose from our comprehensive collection of tests to assess your knowledge</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tests..."
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

            {/* Subject Filter */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            <span>{filteredTests.length} tests found</span>
          </div>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map((test) => (
          <div key={test.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
            {/* Test Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{test.title}</h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      {test.subject}
                    </span>
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                      Class {test.class}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(test.difficulty)}`}>
                      {test.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{test.description}</p>

              {/* Test Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="text-sm font-medium text-gray-900">{test.duration}m</div>
                  <div className="text-xs text-gray-500">Duration</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <BookOpen className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="text-sm font-medium text-gray-900">{test.questions}</div>
                  <div className="text-xs text-gray-500">Questions</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="text-sm font-medium text-gray-900">{test.attempts}</div>
                  <div className="text-xs text-gray-500">Attempts</div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-900">{test.rating}</span>
                  <span className="text-sm text-gray-500">rating</span>
                </div>
              </div>
            </div>

            {/* Test Actions */}
            <div className="px-6 pb-6">
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2">
                <Play className="h-4 w-4" />
                <span>Start Test</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTests.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Target className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tests found</h3>
          <p className="text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
};

export default TestsPage;