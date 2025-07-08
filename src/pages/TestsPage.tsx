import React, { useState, useEffect } from 'react';
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
import { Test } from '../types';
import { getTestsByClass, getAllTests } from '../services/firestore';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import TestTaker from '../components/Test/TestTaker';

const TestsPage: React.FC = () => {
  const { preferences } = useUserPreferences();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<number | 'all'>(preferences.selectedClass || 'all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTest, setActiveTest] = useState<Test | null>(null);

  const subjects = ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi', 'Sanskrit'];
  const classes = [6, 7, 8];

  useEffect(() => {
    loadTests();
    
    // Set up real-time listener for test updates
    const interval = setInterval(() => {
      loadTests();
    }, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(interval);
  }, [selectedClass]);

  const loadTests = async () => {
    try {
      setLoading(true);
      let testsData: Test[];
      
      if (selectedClass === 'all') {
        testsData = await getAllTests();
      } else {
        testsData = await getTestsByClass(selectedClass);
      }
      
      // Only show active tests to students
      const activeTests = testsData.filter(test => test.isActive);
      setTests(activeTests);
    } catch (error) {
      console.error('Error loading tests:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const getTestDifficulty = (test: Test) => {
    const difficulties = test.questions.map(q => q.difficulty);
    const easyCount = difficulties.filter(d => d === 'easy').length;
    const mediumCount = difficulties.filter(d => d === 'medium').length;
    const hardCount = difficulties.filter(d => d === 'hard').length;
    
    if (hardCount > test.questions.length / 2) return 'Hard';
    if (easyCount > test.questions.length / 2) return 'Easy';
    return 'Medium';
  };

  const handleStartTest = (test: Test) => {
    setActiveTest(test);
  };

  const handleTestSubmit = (answers: Record<string, string | number>, timeSpent: number) => {
    // Calculate score
    let correctAnswers = 0;
    
    if (activeTest) {
      activeTest.questions.forEach(question => {
        const userAnswer = answers[question.id];
        if (userAnswer === question.correctAnswer) {
          correctAnswers++;
        }
      });

      const score = correctAnswers;
      const percentage = Math.round((score / activeTest.questions.length) * 100);
      
      // TODO: Save test attempt to Firestore
      console.log('Test submitted:', {
        testId: activeTest.id,
        answers,
        score,
        percentage,
        timeSpent
      });

      alert(`Test completed! You scored ${score}/${activeTest.questions.length} (${percentage}%)`);
    }
    
    setActiveTest(null);
  };

  const handleCloseTest = () => {
    if (window.confirm('Are you sure you want to exit the test? Your progress will be lost.')) {
      setActiveTest(null);
    }
  };

  if (activeTest) {
    return (
      <TestTaker
        test={activeTest}
        onSubmit={handleTestSubmit}
        onClose={handleCloseTest}
      />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Tests</h1>
        <p className="text-gray-600">Choose from our comprehensive collection of tests to assess your knowledge</p>
        {preferences.selectedClass && (
          <div className="mt-3 flex items-center space-x-2 text-sm">
            <span className="text-gray-600">Showing tests for:</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
              Class {preferences.selectedClass}
            </span>
          </div>
        )}
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
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tests...</p>
        </div>
      ) : filteredTests.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Target className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tests found</h3>
          <p className="text-gray-500">
            {tests.length === 0 
              ? "No tests are currently available for your class. Check back soon!"
              : "Try adjusting your filters or search terms"
            }
          </p>
        </div>
      ) : (
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
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(getTestDifficulty(test))}`}>
                        {getTestDifficulty(test)}
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
                    <div className="text-sm font-medium text-gray-900">{test.questions.length}</div>
                    <div className="text-xs text-gray-500">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Target className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">{test.totalMarks}</div>
                    <div className="text-xs text-gray-500">Marks</div>
                  </div>
                </div>

                {/* Created Date */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs text-gray-500">
                    Created: {new Date(test.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900">New</span>
                  </div>
                </div>
              </div>

              {/* Test Actions */}
              <div className="px-6 pb-6">
                <button 
                  onClick={() => handleStartTest(test)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Start Test</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestsPage;