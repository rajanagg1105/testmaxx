import React, { useState } from 'react';
import { 
  Plus, 
  Save, 
  Trash2, 
  Copy, 
  Eye, 
  Clock, 
  Users, 
  BookOpen,
  Target,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { Question, Test } from '../../types';
import { createTest } from '../../services/firestore';
import { useAuth } from '../../contexts/AuthContext';

interface TestCreatorProps {
  onTestCreated: () => void;
}

const TestCreator: React.FC<TestCreatorProps> = ({ onTestCreated }) => {
  const { currentUser } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testData, setTestData] = useState({
    title: '',
    description: '',
    class: 6 as 6 | 7 | 8,
    subject: '',
    duration: 30,
    totalMarks: 0
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const subjects = [
    'Mathematics',
    'Science',
    'English',
    'Social Science',
    'Hindi',
    'Sanskrit'
  ];

  const questionTemplates = [
    {
      id: 'basic-mcq',
      name: 'Basic MCQ',
      description: 'Standard multiple choice question with 4 options',
      template: {
        type: 'mcq' as const,
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        topic: '',
        difficulty: 'medium' as const
      }
    },
    {
      id: 'true-false',
      name: 'True/False',
      description: 'Simple true or false question',
      template: {
        type: 'true-false' as const,
        question: '',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: '',
        topic: '',
        difficulty: 'easy' as const
      }
    },
    {
      id: 'fill-blank',
      name: 'Fill in the Blank',
      description: 'Question with missing word or phrase',
      template: {
        type: 'fill-blank' as const,
        question: '',
        correctAnswer: '',
        explanation: '',
        topic: '',
        difficulty: 'medium' as const
      }
    },
    {
      id: 'assertion-reason',
      name: 'Assertion-Reason',
      description: 'Question with assertion and reason statements',
      template: {
        type: 'assertion-reason' as const,
        question: '',
        options: [
          'Both assertion and reason are true, and reason is the correct explanation',
          'Both assertion and reason are true, but reason is not the correct explanation',
          'Assertion is true, but reason is false',
          'Assertion is false, but reason is true',
          'Both assertion and reason are false'
        ],
        correctAnswer: 0,
        explanation: '',
        topic: '',
        difficulty: 'hard' as const
      }
    }
  ];

  const addQuestion = (templateId: string) => {
    const template = questionTemplates.find(t => t.id === templateId);
    if (!template) return;

    const newQuestion: Question = {
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...template.template
    };

    setQuestions([...questions, newQuestion]);
    setExpandedQuestion(newQuestion.id);
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    ));
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
    if (expandedQuestion === questionId) {
      setExpandedQuestion(null);
    }
  };

  const duplicateQuestion = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    const duplicatedQuestion: Question = {
      ...question,
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question: `${question.question} (Copy)`
    };

    const questionIndex = questions.findIndex(q => q.id === questionId);
    const newQuestions = [...questions];
    newQuestions.splice(questionIndex + 1, 0, duplicatedQuestion);
    setQuestions(newQuestions);
  };

  const calculateTotalMarks = () => {
    return questions.length; // 1 mark per question
  };

  const validateTest = () => {
    const errors = [];
    
    if (!testData.title.trim()) errors.push('Test title is required');
    if (!testData.description.trim()) errors.push('Test description is required');
    if (!testData.subject) errors.push('Subject is required');
    if (testData.duration < 5) errors.push('Duration must be at least 5 minutes');
    if (questions.length === 0) errors.push('At least one question is required');
    
    questions.forEach((q, index) => {
      if (!q.question.trim()) errors.push(`Question ${index + 1}: Question text is required`);
      if (!q.topic.trim()) errors.push(`Question ${index + 1}: Topic is required`);
      
      if (q.type === 'mcq' || q.type === 'true-false' || q.type === 'assertion-reason') {
        if (!q.options || q.options.some(opt => !opt.trim())) {
          errors.push(`Question ${index + 1}: All options must be filled`);
        }
      }
      
      if (q.type === 'fill-blank' && !q.correctAnswer) {
        errors.push(`Question ${index + 1}: Correct answer is required`);
      }
    });

    return errors;
  };

  const handleSaveTest = async () => {
    const errors = validateTest();
    if (errors.length > 0) {
      alert('Please fix the following errors:\n' + errors.join('\n'));
      return;
    }

    try {
      setSaving(true);
      
      const test: Omit<Test, 'id' | 'createdAt'> = {
        ...testData,
        questions,
        totalMarks: calculateTotalMarks(),
        isActive: true
      };

      await createTest(test);
      
      // Reset form
      setTestData({
        title: '',
        description: '',
        class: 6,
        subject: '',
        duration: 30,
        totalMarks: 0
      });
      setQuestions([]);
      setIsCreating(false);
      setShowPreview(false);
      
      onTestCreated();
      alert('Test created successfully!');
    } catch (error) {
      console.error('Error creating test:', error);
      alert('Failed to create test. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isCreating) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Plus className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Create New Test</h3>
        <p className="text-gray-600 mb-6">Design comprehensive tests with multiple question types and templates</p>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 mx-auto"
        >
          <Plus className="h-5 w-5" />
          <span>Start Creating Test</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Test</h2>
            <p className="text-gray-600">Design a comprehensive test for your students</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>{showPreview ? 'Hide Preview' : 'Preview'}</span>
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Test Title</label>
                <input
                  type="text"
                  value={testData.title}
                  onChange={(e) => setTestData({ ...testData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter test title"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={testData.description}
                  onChange={(e) => setTestData({ ...testData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter test description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                <select
                  value={testData.class}
                  onChange={(e) => setTestData({ ...testData, class: Number(e.target.value) as 6 | 7 | 8 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={6}>Class 6</option>
                  <option value={7}>Class 7</option>
                  <option value={8}>Class 8</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={testData.subject}
                  onChange={(e) => setTestData({ ...testData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={testData.duration}
                  onChange={(e) => setTestData({ ...testData, duration: Number(e.target.value) })}
                  min="5"
                  max="180"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Marks</label>
                <input
                  type="number"
                  value={calculateTotalMarks()}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">Automatically calculated (1 mark per question)</p>
              </div>
            </div>
          </div>

          {/* Question Templates */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questionTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => addQuestion(template.id)}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Plus className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Questions List */}
          {questions.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Questions ({questions.length})</h3>
                <div className="text-sm text-gray-600">
                  Total Marks: {calculateTotalMarks()}
                </div>
              </div>
              
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg">
                    {/* Question Header */}
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {question.question || `Question ${index + 1}`}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
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
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => duplicateQuestion(question.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Duplicate Question"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setExpandedQuestion(
                              expandedQuestion === question.id ? null : question.id
                            )}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            {expandedQuestion === question.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteQuestion(question.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete Question"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Question Editor */}
                    {expandedQuestion === question.id && (
                      <div className="p-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                          <textarea
                            value={question.question}
                            onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your question here..."
                          />
                        </div>

                        {(question.type === 'mcq' || question.type === 'true-false' || question.type === 'assertion-reason') && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                            <div className="space-y-2">
                              {question.options?.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center space-x-3">
                                  <input
                                    type="radio"
                                    name={`correct-${question.id}`}
                                    checked={question.correctAnswer === optionIndex}
                                    onChange={() => updateQuestion(question.id, { correctAnswer: optionIndex })}
                                    className="text-blue-600"
                                  />
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...(question.options || [])];
                                      newOptions[optionIndex] = e.target.value;
                                      updateQuestion(question.id, { options: newOptions });
                                    }}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={`Option ${optionIndex + 1}`}
                                    readOnly={question.type === 'true-false' || question.type === 'assertion-reason'}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {question.type === 'fill-blank' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                            <input
                              type="text"
                              value={question.correctAnswer as string}
                              onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter the correct answer"
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                            <input
                              type="text"
                              value={question.topic}
                              onChange={(e) => updateQuestion(question.id, { topic: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter topic"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                            <select
                              value={question.difficulty}
                              onChange={(e) => updateQuestion(question.id, { difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="easy">Easy</option>
                              <option value="medium">Medium</option>
                              <option value="hard">Hard</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Explanation (Optional)</label>
                          <textarea
                            value={question.explanation || ''}
                            onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Explain the correct answer..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Test Summary */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Questions</span>
                </div>
                <span className="font-medium">{questions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Total Marks</span>
                </div>
                <span className="font-medium">{calculateTotalMarks()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Duration</span>
                </div>
                <span className="font-medium">{testData.duration}m</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Target</span>
                </div>
                <span className="font-medium">Class {testData.class}</span>
              </div>
            </div>
          </div>

          {/* Validation Status */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Validation</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {testData.title ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm text-gray-600">Test title</span>
              </div>
              <div className="flex items-center space-x-2">
                {testData.subject ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm text-gray-600">Subject selected</span>
              </div>
              <div className="flex items-center space-x-2">
                {questions.length > 0 ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm text-gray-600">Questions added</span>
              </div>
              <div className="flex items-center space-x-2">
                {testData.duration >= 5 ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm text-gray-600">Valid duration</span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveTest}
            disabled={saving || validateTest().length > 0}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Save className="h-5 w-5" />
            <span>{saving ? 'Creating Test...' : 'Create Test'}</span>
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Test Preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{testData.title || 'Untitled Test'}</h3>
                <p className="text-gray-600 mb-4">{testData.description || 'No description'}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Class {testData.class}</span>
                  <span>•</span>
                  <span>{testData.subject || 'No subject'}</span>
                  <span>•</span>
                  <span>{testData.duration} minutes</span>
                  <span>•</span>
                  <span>{calculateTotalMarks()} marks</span>
                </div>
              </div>
              
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3 mb-3">
                      <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium mb-2">{question.question || 'No question text'}</p>
                        
                        {(question.type === 'mcq' || question.type === 'true-false' || question.type === 'assertion-reason') && (
                          <div className="space-y-2">
                            {question.options?.map((option, optionIndex) => (
                              <div key={optionIndex} className={`p-2 rounded border ${
                                question.correctAnswer === optionIndex 
                                  ? 'bg-green-50 border-green-200' 
                                  : 'bg-gray-50 border-gray-200'
                              }`}>
                                <span className="text-sm">{String.fromCharCode(65 + optionIndex)}. {option}</span>
                                {question.correctAnswer === optionIndex && (
                                  <span className="text-green-600 text-xs ml-2">(Correct)</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {question.type === 'fill-blank' && (
                          <div className="bg-green-50 border border-green-200 rounded p-2">
                            <span className="text-sm">Answer: {question.correctAnswer}</span>
                          </div>
                        )}
                        
                        {question.explanation && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCreator;