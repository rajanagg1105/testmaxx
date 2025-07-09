import React, { useState } from 'react';
import { 
  Save, 
  X, 
  Edit3, 
  BookOpen,
  Clock,
  Target,
  ChevronDown,
  ChevronUp,
  Trash2,
  Copy,
  Plus,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Test, Question } from '../../types';
import { updateTest } from '../../services/firestore';

interface TestEditorProps {
  test: Test;
  onTestUpdated: () => void;
  onCancel: () => void;
}

const TestEditor: React.FC<TestEditorProps> = ({ test, onTestUpdated, onCancel }) => {
  const [testData, setTestData] = useState({
    title: test.title,
    description: test.description,
    class: test.class,
    subject: test.subject,
    duration: test.duration,
    totalMarks: test.totalMarks
  });
  const [questions, setQuestions] = useState<Question[]>(test.questions);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
      template: {
        type: 'mcq' as const,
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        topic: '',
        difficulty: 'medium' as const,
        hasImage: false,
        imageUrl: ''
      }
    },
    {
      id: 'true-false',
      name: 'True/False',
      template: {
        type: 'true-false' as const,
        question: '',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: '',
        topic: '',
        difficulty: 'easy' as const,
        hasImage: false,
        imageUrl: ''
      }
    },
    {
      id: 'fill-blank',
      name: 'Fill in the Blank',
      template: {
        type: 'fill-blank' as const,
        question: '',
        correctAnswer: '',
        explanation: '',
        topic: '',
        difficulty: 'medium' as const,
        hasImage: false,
        imageUrl: ''
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
      alert('Please fix the following errors:\n• ' + errors.join('\n• '));
      return;
    }

    try {
      setSaving(true);
      
      const updatedTest = {
        ...testData,
        questions,
        totalMarks: calculateTotalMarks()
      };

      await updateTest(test.id, updatedTest);
      
      onTestUpdated();
      alert(`✅ Test "${updatedTest.title}" updated successfully!`);
    } catch (error) {
      console.error('Error updating test:', error);
      alert('❌ Failed to update test. Please try again.');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Edit Test</h2>
            <p className="text-gray-600">Update your test content and settings</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onCancel}
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

          {/* Add Questions */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                        {(question.type === 'mcq' || question.type === 'true-false') && (
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
                                    readOnly={question.type === 'true-false'}
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
            disabled={saving}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
              saving 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : validateTest().length > 0
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            <Save className="h-5 w-5" />
            <span>
              {saving 
                ? 'Updating Test...' 
                : validateTest().length > 0 
                ? `Fix ${validateTest().length} Error${validateTest().length > 1 ? 's' : ''} First`
                : 'Update Test'
              }
            </span>
          </button>
          
          {/* Validation Summary */}
          {validateTest().length > 0 && !saving && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="text-sm font-semibold text-red-800 mb-2">Please fix these issues:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {validateTest().map((error, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestEditor;