import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Clock, 
  Target, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Star,
  TrendingUp,
  BookOpen,
  AlertCircle,
  Award,
  BarChart3
} from 'lucide-react';

interface TestResultsProps {
  results: {
    test: any;
    score: number;
    totalQuestions: number;
    percentage: number;
    timeSpent: number;
    questionResults: any[];
    topicPerformance: Record<string, { correct: number; total: number }>;
    suggestions: string[];
  };
  onClose: () => void;
}

const TestResults: React.FC<TestResultsProps> = ({ results, onClose }) => {
  const navigate = useNavigate();
  const {
    test,
    score,
    totalQuestions,
    percentage,
    timeSpent,
    questionResults,
    topicPerformance,
    suggestions
  } = results;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 90) return { text: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (percentage >= 70) return { text: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (percentage >= 50) return { text: 'Average', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
  };

  const badge = getPerformanceBadge(percentage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onClose}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Tests</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900">Test Results</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              {percentage >= 70 ? (
                <Trophy className="h-16 w-16 text-yellow-300" />
              ) : (
                <Target className="h-16 w-16 text-white" />
              )}
            </div>
            <h2 className="text-3xl font-bold mb-2">{test.title}</h2>
            <p className="text-blue-100 mb-6">{test.subject} • Class {test.class}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{score}/{totalQuestions}</div>
                <div className="text-sm text-blue-100">Questions Correct</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className={`text-2xl font-bold ${getPerformanceColor(percentage)}`}>{percentage}%</div>
                <div className="text-sm text-blue-100">Score</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{formatTime(timeSpent)}</div>
                <div className="text-sm text-blue-100">Time Taken</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className={`text-sm font-medium px-3 py-1 rounded-full ${badge.color}`}>
                  {badge.text}
                </div>
                <div className="text-sm text-blue-100 mt-1">Performance</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Question-by-Question Results */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">Question Analysis</h3>
                <p className="text-gray-600">Review your answers and learn from explanations</p>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {questionResults.map((result, index) => (
                    <div key={index} className={`border rounded-lg p-4 ${
                      result.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex items-start space-x-3 mb-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          result.isCorrect ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {result.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-white" />
                          ) : (
                            <XCircle className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-gray-900">Question {index + 1}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              result.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                              result.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {result.difficulty}
                            </span>
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                              {result.topic}
                            </span>
                          </div>
                          <p className="text-gray-900 font-medium mb-3">{result.question}</p>
                          
                          {/* Show options for MCQ type questions */}
                          {result.options && (
                            <div className="space-y-2 mb-3">
                              {result.options.map((option: string, optIndex: number) => (
                                <div key={optIndex} className={`p-2 rounded border text-sm ${
                                  option === result.correctAnswer ? 'bg-green-100 border-green-300' :
                                  option === result.userAnswer && !result.isCorrect ? 'bg-red-100 border-red-300' :
                                  'bg-gray-50 border-gray-200'
                                }`}>
                                  <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span> {option}
                                  {option === result.correctAnswer && (
                                    <span className="text-green-600 text-xs ml-2 font-medium">(Correct)</span>
                                  )}
                                  {option === result.userAnswer && !result.isCorrect && (
                                    <span className="text-red-600 text-xs ml-2 font-medium">(Your Answer)</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* For fill-in-the-blank questions */}
                          {!result.options && (
                            <div className="space-y-2 mb-3">
                              <div className={`p-2 rounded border text-sm ${
                                result.isCorrect ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'
                              }`}>
                                <span className="font-medium">Your Answer:</span> {result.userAnswer || 'No answer provided'}
                              </div>
                              {!result.isCorrect && (
                                <div className="p-2 rounded border bg-green-100 border-green-300 text-sm">
                                  <span className="font-medium">Correct Answer:</span> {result.correctAnswer}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {result.explanation && (
                            <div className="bg-blue-50 border border-blue-200 rounded p-3">
                              <div className="flex items-start space-x-2">
                                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-blue-900 mb-1">Explanation:</p>
                                  <p className="text-sm text-blue-800">{result.explanation}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar with Performance Analysis */}
          <div className="space-y-6">
            {/* Topic Performance */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Topic Performance</span>
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {Object.entries(topicPerformance).map(([topic, perf]) => {
                    const topicPercentage = Math.round((perf.correct / perf.total) * 100);
                    return (
                      <div key={topic}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">{topic}</span>
                          <span className="text-sm text-gray-600">{perf.correct}/{perf.total}</span>
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
                        <div className="text-xs text-gray-500 mt-1">{topicPercentage}% correct</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Improvement Suggestions</span>
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Star className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-800">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Achievement Badge */}
            {percentage >= 90 && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white text-center">
                <Award className="h-12 w-12 mx-auto mb-3" />
                <h3 className="text-lg font-bold mb-2">Outstanding Performance!</h3>
                <p className="text-sm text-yellow-100">You've mastered this topic. Keep up the excellent work!</p>
              </div>
            )}

            {/* Study Materials Suggestion */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="p-6">
                <div className="text-center">
                  <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Continue Learning</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Review study materials to strengthen your understanding
                  </p>
                  <button 
                    onClick={() => navigate('/study-material')}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    View Study Materials
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResults;