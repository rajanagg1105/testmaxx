import React, { useState } from 'react';
import { BookOpen, ArrowRight, Users, Target, Star, CheckCircle } from 'lucide-react';

interface ClassSelectionProps {
  onClassSelect: (selectedClass: 6 | 7 | 8) => void;
}

const ClassSelection: React.FC<ClassSelectionProps> = ({ onClassSelect }) => {
  const [selectedClass, setSelectedClass] = useState<6 | 7 | 8 | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const classes = [
    {
      number: 6 as const,
      title: 'Class 6',
      description: 'Foundation building with core concepts',
      subjects: 6,
      students: '2.5K+',
      difficulty: 'Beginner Friendly',
      highlights: ['Basic Mathematics', 'Science Fundamentals', 'Language Skills'],
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      number: 7 as const,
      title: 'Class 7',
      description: 'Intermediate concepts and skill development',
      subjects: 6,
      students: '3.2K+',
      difficulty: 'Intermediate Level',
      highlights: ['Advanced Mathematics', 'Applied Sciences', 'Critical Thinking'],
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      number: 8 as const,
      title: 'Class 8',
      description: 'Advanced preparation for higher studies',
      subjects: 6,
      students: '2.8K+',
      difficulty: 'Advanced Level',
      highlights: ['Complex Problem Solving', 'Analytical Skills', 'Exam Preparation'],
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  const handleContinue = async () => {
    if (selectedClass && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onClassSelect(selectedClass);
      } catch (error) {
        console.error('Error selecting class:', error);
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Class
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select your current class to get personalized study materials, tests, and learning content tailored just for you.
          </p>
        </div>

        {/* Class Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {classes.map((classInfo) => (
            <div
              key={classInfo.number}
              onClick={() => setSelectedClass(classInfo.number)}
              className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedClass === classInfo.number
                  ? 'ring-4 ring-blue-500 ring-opacity-50 shadow-2xl'
                  : 'hover:shadow-xl'
              }`}
            >
              <div className={`bg-white rounded-2xl border-2 p-8 h-full ${
                selectedClass === classInfo.number ? classInfo.borderColor : 'border-gray-200'
              }`}>
                {/* Class Header */}
                <div className="text-center mb-6">
                  <div className={`bg-gradient-to-r ${classInfo.color} text-white text-2xl font-bold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    {classInfo.number}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{classInfo.title}</h3>
                  <p className="text-gray-600">{classInfo.description}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className={`${classInfo.bgColor} rounded-lg p-3 text-center`}>
                    <div className="text-lg font-bold text-gray-900">{classInfo.subjects}</div>
                    <div className="text-sm text-gray-600">Subjects</div>
                  </div>
                  <div className={`${classInfo.bgColor} rounded-lg p-3 text-center`}>
                    <div className="text-lg font-bold text-gray-900">{classInfo.students}</div>
                    <div className="text-sm text-gray-600">Students</div>
                  </div>
                </div>

                {/* Difficulty Level */}
                <div className="flex items-center justify-center mb-6">
                  <div className={`bg-gradient-to-r ${classInfo.color} text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2`}>
                    <Target className="h-4 w-4" />
                    <span>{classInfo.difficulty}</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-2">
                  {classInfo.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* Selection Indicator */}
                {selectedClass === classInfo.number && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-blue-500 text-white rounded-full p-2">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={!selectedClass || isSubmitting}
            className={`inline-flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
              selectedClass && !isSubmitting
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Setting up your account...</span>
              </>
            ) : (
              <>
                <span>Start Learning Journey</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
          
          {selectedClass && !isSubmitting && (
            <p className="text-sm text-gray-600 mt-4">
              You selected <span className="font-semibold text-blue-600">Class {selectedClass}</span>
            </p>
          )}
        </div>

        {/* Info Banner */}
        <div className="mt-12 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span>8,500+ Active Students</span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-green-500" />
              <span>500+ Study Materials</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-purple-500" />
              <span>95% Success Rate</span>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">What's Next?</h3>
            <p className="text-blue-100 mb-4">
              After selecting your class, you'll have access to:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-medium mb-1">📚 Study Materials</div>
                <div className="text-blue-100">Chapter-wise content for all subjects</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-medium mb-1">📝 Interactive Tests</div>
                <div className="text-blue-100">Practice tests with instant feedback</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="font-medium mb-1">🎯 Progress Tracking</div>
                <div className="text-blue-100">Monitor your learning journey</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassSelection;