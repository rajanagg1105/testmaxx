import React from 'react';
import { 
  X, 
  Clock, 
  Target, 
  BookOpen, 
  Star,
  CheckCircle,
  Calendar,
  Users
} from 'lucide-react';
import { Test } from '../../types';

interface TestPreviewProps {
  test: Test;
  onClose: () => void;
}

const TestPreview: React.FC<TestPreviewProps> = ({ test, onClose }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTestDifficulty = () => {
    const difficulties = test.questions.map(q => q.difficulty);
    const easyCount = difficulties.filter(d => d === 'easy').length;
    const mediumCount = difficulties.filter(d => d === 'medium').length;
    const hardCount = difficulties.filter(d => d === 'hard').length;
    
    if (hardCount > test.questions.length / 2) return 'Hard';
    if (easyCount > test.questions.length / 2) return 'Easy';
    return 'Medium';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Preview</h2>
              <p className="text-gray-600">Preview how this test will appear to students</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Test Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{test.title}</h1>
                <p className="text-blue-100 mb-4">{test.description}</p>
                
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{test.subject}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Class {test.class}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(test.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                  test.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {test.isActive ? 'Active' : 'Inactive'}
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(getTestDifficulty().toLowerCase())}`}>
                  {getTestDifficulty()}
                </div>
              </div>
            </div>
          </div>

          {/* Test Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">{test.questions.length}</div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">{test.totalMarks}</div>
              <div className="text-sm text-gray-600">Total Marks</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">{test.duration}</div>
              <div className="text-sm text-gray-600">Minutes</div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">New</div>
              <div className="text-sm text-gray-600">Status</div>
            </div>
          </div>

          {/* Questions Preview */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Questions Preview</h3>
            
            {test.questions.map((question, index) => (
              <div key={question.id} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        {question.type.replace('-', ' ').toUpperCase()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                      {question.topic && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          {question.topic}
                        </span>
                      )}
                    </div>
                    
                    <h4 className="text-lg font-medium text-gray-900 mb-3">
                      {question.question}
                    </h4>
                    
                    {question.hasImage && question.imageUrl && (
                      <img
                        src={question.imageUrl}
                        alt="Question"
                        className="max-w-xs h-auto rounded border mb-3"
                      />
                    )}
                    
                    {(question.type === 'mcq' || question.type === 'true-false' || question.type === 'assertion-reason') && (
                      <div className="space-y-2">
                        {question.options?.map((option, optionIndex) => (
                          <div key={optionIndex} className={`p-3 rounded border ${
                            question.correctAnswer === optionIndex 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-white border-gray-200'
                          }`}>
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded-full border-2 ${
                                question.correctAnswer === optionIndex
                                  ? 'bg-green-500 border-green-500'
                                  : 'border-gray-300'
                              }`}>
                                {question.correctAnswer === optionIndex && (
                                  <CheckCircle className="w-4 h-4 text-white" />
                                )}
                              </div>
                              <span className="text-sm">
                                {String.fromCharCode(65 + optionIndex)}. {option}
                              </span>
                              {question.correctAnswer === optionIndex && (
                                <span className="text-green-600 text-xs font-medium ml-auto">
                                  Correct Answer
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {question.type === 'fill-blank' && (
                      <div className="bg-green-50 border border-green-200 rounded p-3">
                        <span className="text-sm font-medium text-green-800">
                          Correct Answer: {question.correctAnswer}
                        </span>
                      </div>
                    )}
                    
                    {question.explanation && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-sm text-blue-800">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                This is how the test will appear to students when they take it.
              </div>
              <button
                onClick={onClose}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPreview;