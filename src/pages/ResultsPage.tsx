import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  BookOpen,
  Star,
  Award,
  BarChart3,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserTestAttempts, getAllTests } from '../services/firestore';

const ResultsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [attempts, setAttempts] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'subject'>('date');
  const [expandedAttempt, setExpandedAttempt] = useState<string | null>(null);

  const subjects = ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi', 'Sanskrit'];

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const loadData = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const [attemptsData, testsData] = await Promise.all([
        getUserTestAttempts(currentUser.uid),
        getAllTests()
      ]);
      
      // Enrich attempts with test information
      const enrichedAttempts = attemptsData.map(attempt => {
        const test = testsData.find(t => t.id === attempt.testId);
        return {
          ...attempt,
          testTitle: test?.title || 'Unknown Test',
          testSubject: test?.subject || 'Unknown Subject',
          testClass: test?.class || 0,
          testDuration: test?.duration || 0
        };
      });
      
      setAttempts(enrichedAttempts);
      setTests(testsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedAttempts = attempts
    .filter(attempt => {
      const matchesSearch = attempt.testTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           attempt.testSubject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = selectedSubject === 'all' || attempt.testSubject === selectedSubject;
      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          const aPercentage = (a.score / a.totalMarks) * 100;
          const bPercentage = (b.score / b.totalMarks) * 100;
          return bPercentage - aPercentage;
        case 'subject':
          return a.testSubject.localeCompare(b.testSubject);
        default:
          return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      }
    });

  const getOverallStats = () => {
    if (attempts.length === 0) return null;
    
    const totalAttempts = attempts.length;
    const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
    const totalMarks = attempts.reduce((sum, attempt) => sum + attempt.totalMarks, 0);
    const averagePercentage = Math.round((totalScore / totalMarks) * 100);
    const totalTimeSpent = attempts.reduce((sum, attempt) => sum + (attempt.timeSpent || 0), 0);
    
    // Subject-wise performance
    const subjectStats: Record<string, { attempts: number; totalScore: number; totalMarks: number }> = {};
    attempts.forEach(attempt => {
      if (!subjectStats[attempt.testSubject]) {
        subjectStats[attempt.testSubject] = { attempts: 0, totalScore: 0, totalMarks: 0 };
      }
      subjectStats[attempt.testSubject].attempts++;
      subjectStats[attempt.testSubject].totalScore += attempt.score;
      subjectStats[attempt.testSubject].totalMarks += attempt.totalMarks;
    });
    
    const bestSubject = Object.entries(subjectStats).reduce((best, [subject, stats]) => {
      const percentage = (stats.totalScore / stats.totalMarks) * 100;
      return percentage > best.percentage ? { subject, percentage } : best;
    }, { subject: '', percentage: 0 });
    
    return {
      totalAttempts,
      averagePercentage,
      totalTimeSpent: Math.round(totalTimeSpent / 60), // Convert to minutes
      bestSubject,
      subjectStats
    };
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (percentage: number) => {
    if (percentage >= 90) return { text: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (percentage >= 70) return { text: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (percentage >= 50) return { text: 'Average', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const stats = getOverallStats();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Test Results</h1>
        <p className="text-gray-600">Track your progress and analyze your performance across all tests</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      ) : attempts.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No test results yet</h3>
          <p className="text-gray-500 mb-4">Take your first test to see your results here!</p>
          <button 
            onClick={() => window.location.href = '/tests'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Tests
          </button>
        </div>
      ) : (
        <>
          {/* Overall Statistics */}
          {stats && (
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Overall Performance</h2>
                  <p className="text-blue-100">Your learning journey at a glance</p>
                </div>
                <div className="hidden md:block">
                  <Trophy className="h-12 w-12 text-yellow-300" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">{stats.totalAttempts}</div>
                  <div className="text-sm text-blue-100">Tests Taken</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(stats.averagePercentage)}`}>
                    {stats.averagePercentage}%
                  </div>
                  <div className="text-sm text-blue-100">Average Score</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">{stats.totalTimeSpent}m</div>
                  <div className="text-sm text-blue-100">Study Time</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-lg font-bold">{stats.bestSubject.subject}</div>
                  <div className="text-sm text-blue-100">Best Subject</div>
                  <div className="text-xs text-blue-200">{Math.round(stats.bestSubject.percentage)}%</div>
                </div>
              </div>
            </div>
          )}

          {/* Filters and Controls */}
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

                {/* Sort By */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'score' | 'subject')}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date">Sort by Date</option>
                  <option value="score">Sort by Score</option>
                  <option value="subject">Sort by Subject</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={loadData}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
                <div className="text-sm text-gray-600">
                  <Filter className="h-4 w-4 inline mr-1" />
                  {filteredAndSortedAttempts.length} results
                </div>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-4">
            {filteredAndSortedAttempts.map((attempt) => {
              const percentage = Math.round((attempt.score / attempt.totalMarks) * 100);
              const badge = getScoreBadge(percentage);
              const isExpanded = expandedAttempt === attempt.id;
              
              return (
                <div key={attempt.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{attempt.testTitle}</h3>
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                            {attempt.testSubject}
                          </span>
                          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                            Class {attempt.testClass}
                          </span>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${badge.color}`}>
                            {badge.text}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <div className="text-gray-500">Score</div>
                            <div className={`font-semibold ${getScoreColor(percentage)}`}>
                              {attempt.score}/{attempt.totalMarks} ({percentage}%)
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500">Date Attempted</div>
                            <div className="font-medium text-gray-900">
                              {new Date(attempt.completedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500">Time Spent</div>
                            <div className="font-medium text-gray-900">
                              {attempt.timeSpent ? formatTime(attempt.timeSpent) : 'N/A'}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500">Duration</div>
                            <div className="font-medium text-gray-900">{attempt.testDuration}m</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Efficiency</div>
                            <div className="font-medium text-gray-900">
                              {attempt.timeSpent && attempt.testDuration ? 
                                `${Math.round((attempt.timeSpent / 60) / attempt.testDuration * 100)}%` : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => setExpandedAttempt(isExpanded ? null : attempt.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && attempt.analysis && (
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Topic Performance */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                              <BarChart3 className="h-4 w-4" />
                              <span>Topic Performance</span>
                            </h4>
                            <div className="space-y-3">
                              {Object.entries(attempt.analysis.topicPerformance).map(([topic, perf]: [string, any]) => {
                                const topicPercentage = Math.round((perf.correct / perf.total) * 100);
                                return (
                                  <div key={topic}>
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-sm text-gray-700">{topic}</span>
                                      <span className="text-sm font-medium">{perf.correct}/{perf.total}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div 
                                        className={`h-2 rounded-full ${
                                          topicPercentage >= 80 ? 'bg-green-500' :
                                          topicPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                        style={{ width: `${topicPercentage}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Improvement Suggestions */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                              <TrendingUp className="h-4 w-4" />
                              <span>Improvement Areas</span>
                            </h4>
                            <div className="space-y-2">
                              {attempt.analysis.suggestions.slice(0, 3).map((suggestion: string, index: number) => (
                                <div key={index} className="flex items-start space-x-2 text-sm">
                                  <Star className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                                  <span className="text-gray-700">{suggestion}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredAndSortedAttempts.length === 0 && (
            <div className="text-center py-8">
              <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ResultsPage;