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
import { getTestsByClass, getAllTests, getActiveTestsForStudents, createTestAttempt } from '../services/firestore';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { getUserTestAttempts } from '../services/firestore';
import TestTaker from '../components/Test/TestTaker';
import TestResults from '../components/Test/TestResults';
import { useAuth } from '../contexts/AuthContext';

const TestsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { preferences } = useUserPreferences();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<number | 'all'>(preferences.selectedClass || 'all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [testResults, setTestResults] = useState<any>(null);
  const [userAttempts, setUserAttempts] = useState<any[]>([]);
  const [animatingTests, setAnimatingTests] = useState<Set<string>>(new Set());

  const subjects = ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi', 'Sanskrit'];
  const classes = [6, 7, 8];

  useEffect(() => {
    loadTests();
    if (currentUser) {
      loadUserAttempts();
    }
    
    // Set up real-time listener for test updates
    const interval = setInterval(() => {
      loadTests();
      if (currentUser) {
        loadUserAttempts();
      }
    }, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(interval);
  }, [selectedClass, currentUser]);

  const loadTests = async () => {
    try {
      setLoading(true);
      let testsData: Test[];
      
      // Always get active tests for students
      testsData = await getActiveTestsForStudents();
      
      // Filter by class if specific class is selected
      if (selectedClass !== 'all') {
        testsData = testsData.filter(test => test.class === selectedClass);
      }
      
      setTests(testsData);
    } catch (error) {
      console.error('Error loading tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserAttempts = async () => {
    if (!currentUser) return;
    
    try {
      const attempts = await getUserTestAttempts(currentUser.uid);
      setUserAttempts(attempts);
    } catch (error) {
      console.error('Error loading user attempts:', error);
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

  const getTestAttemptInfo = (testId: string) => {
    const attempts = userAttempts.filter(attempt => attempt.testId === testId);
    if (attempts.length === 0) return null;
    
    const latestAttempt = attempts[0]; // Already sorted by completedAt desc
    const bestScore = Math.max(...attempts.map(a => a.score));
    const bestPercentage = Math.round((bestScore / latestAttempt.totalMarks) * 100);
    
    return {
      attempts: attempts.length,
      latestScore: latestAttempt.score,
      latestPercentage: Math.round((latestAttempt.score / latestAttempt.totalMarks) * 100),
      bestScore,
      bestPercentage,
      lastAttempted: latestAttempt.completedAt
    };
  };

  const handleStartTest = (test: Test) => {
    // Add animation effect
    setAnimatingTests(prev => new Set(prev).add(test.id));
    setTimeout(() => {
      setAnimatingTests(prev => {
        const newSet = new Set(prev);
        newSet.delete(test.id);
        return newSet;
      });
    }, 1000);
    
    setActiveTest(test);
  };

  const handleTestSubmit = async (answers: Record<string, string | number>, timeSpent: number) => {
    if (!activeTest || !currentUser) return;

    // Calculate score and analyze answers
    let correctAnswers = 0;
    const questionResults: any[] = [];
    const topicPerformance: Record<string, { correct: number; total: number }> = {};
    
    activeTest.questions.forEach(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctAnswers++;
      }
      
      // Track topic performance
      if (!topicPerformance[question.topic]) {
        topicPerformance[question.topic] = { correct: 0, total: 0 };
      }
      topicPerformance[question.topic].total++;
      if (isCorrect) {
        topicPerformance[question.topic].correct++;
      }
      
      // Store question result for detailed view
      questionResults.push({
        question: question.question,
        userAnswer: question.type === 'fill-blank' ? userAnswer : 
                   question.options ? question.options[userAnswer as number] : userAnswer,
        correctAnswer: question.type === 'fill-blank' ? question.correctAnswer :
                      question.options ? question.options[question.correctAnswer as number] : question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
        topic: question.topic,
        difficulty: question.difficulty,
        type: question.type,
        options: question.options
      });
    });

    const score = correctAnswers;
    const percentage = Math.round((score / activeTest.questions.length) * 100);
    
    // Generate suggestions based on performance
    const suggestions: string[] = [];
    Object.entries(topicPerformance).forEach(([topic, perf]) => {
      const topicPercentage = (perf.correct / perf.total) * 100;
      if (topicPercentage < 60) {
        suggestions.push(`Focus more on ${topic} - you got ${perf.correct}/${perf.total} questions correct`);
      } else if (topicPercentage === 100) {
        suggestions.push(`Excellent work on ${topic}! You got all questions correct`);
      }
    });
    
    if (percentage >= 90) {
      suggestions.push("Outstanding performance! Keep up the excellent work!");
    } else if (percentage >= 70) {
      suggestions.push("Good job! Review the topics you missed to improve further.");
    } else if (percentage >= 50) {
      suggestions.push("You're on the right track. Focus on understanding the concepts better.");
    } else {
      suggestions.push("Don't worry! Review the study materials and practice more questions.");
    }

    try {
      // Save test attempt to Firestore
      await createTestAttempt({
        testId: activeTest.id,
        userId: currentUser.uid,
        answers,
        score,
        totalMarks: activeTest.questions.length,
        timeSpent,
        analysis: {
          topicPerformance,
          suggestions
        }
      });
    } catch (error) {
      console.error('Error saving test attempt:', error);
    }

    // Prepare results data
    const resultsData = {
      test: activeTest,
      score,
      totalQuestions: activeTest.questions.length,
      percentage,
      timeSpent,
      questionResults,
      topicPerformance,
      suggestions
    };
    
    setTestResults(resultsData);
    setActiveTest(null);
    
    // Reload user attempts to update the UI
    setTimeout(() => {
      loadUserAttempts();
    }, 1000);
  };

  const handleCloseTest = () => {
    if (window.confirm('Are you sure you want to exit the test? Your progress will be lost.')) {
      setActiveTest(null);
    }
  };

  const handleCloseResults = () => {
    setTestResults(null);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
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

  if (testResults) {
    return (
      <TestResults
        results={testResults}
        onClose={handleCloseResults}
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
          {filteredTests.map((test) => {
            const attemptInfo = getTestAttemptInfo(test.id);
            const isAnimating = animatingTests.has(test.id);
            
            return (
              <div key={test.id} className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
              isAnimating ? 'animate-pulse scale-105 shadow-lg' : ''
            } ${attemptInfo ? 'ring-2 ring-blue-200' : ''}`}>
              {/* Test Header */}
              <div className="p-6 pb-4">
                {/* Attempt Badge */}
                {attemptInfo && (
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                        ✓ Attempted {attemptInfo.attempts} time{attemptInfo.attempts > 1 ? 's' : ''}
                      </span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        attemptInfo.bestPercentage >= 90 ? 'bg-green-100 text-green-800' :
                        attemptInfo.bestPercentage >= 70 ? 'bg-blue-100 text-blue-800' :
                        attemptInfo.bestPercentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        Best: {attemptInfo.bestPercentage}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Last: {new Date(attemptInfo.lastAttempted).toLocaleDateString()}
                    </div>
                  </div>
                )}
                
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
                  {attemptInfo ? (
                    <div className="flex items-center space-x-1">
                      <Trophy className="h-4 w-4 text-blue-500" />
                      <span className={`text-sm font-medium ${getScoreColor(attemptInfo.latestPercentage)}`}>
                        {attemptInfo.latestPercentage}%
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">New</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Test Actions */}
              <div className="px-6 pb-6">
                {attemptInfo ? (
                  <div className="space-y-2">
                    <button 
                      onClick={() => handleStartTest(test)}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Play className="h-4 w-4" />
                      <span>Reattempt Test</span>
                    </button>
                    <div className="text-center text-xs text-gray-500">
                      Improve your score of {attemptInfo.latestScore}/{test.questions.length}
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleStartTest(test)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Play className="h-4 w-4" />
                    <span>Start Test</span>
                  </button>
                )}
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TestsPage;