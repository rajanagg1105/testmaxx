import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Clock, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  Target,
  Star,
  ArrowRight,
  ChevronRight,
  Play,
  FileText,
  Users
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { getUserTestAttempts } from '../services/firestore';

const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { preferences } = useUserPreferences();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [recentAttempts, setRecentAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    testsCompleted: 0,
    averageScore: 0,
    totalStudyTime: 0,
    currentRank: 0
  });
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());

  useEffect(() => {
    if (currentUser) {
      loadRecentAttempts();
      loadDashboardStats();
      
      // Set up real-time updates every 5 seconds
      const interval = setInterval(() => {
        loadRecentAttempts();
        loadDashboardStats();
        setLastUpdateTime(new Date());
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const loadRecentAttempts = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const attempts = await getUserTestAttempts(currentUser.uid);
      setRecentAttempts(attempts.slice(0, 3)); // Get latest 3 attempts
    } catch (error) {
      console.error('Error loading recent attempts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardStats = async () => {
    if (!currentUser) return;
    
    try {
      const attempts = await getUserTestAttempts(currentUser.uid);
      
      if (attempts.length > 0) {
        const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
        const totalMarks = attempts.reduce((sum, attempt) => sum + attempt.totalMarks, 0);
        const totalTime = attempts.reduce((sum, attempt) => sum + (attempt.timeSpent || 0), 0);
        
        setDashboardStats({
          testsCompleted: attempts.length,
          averageScore: Math.round((totalScore / totalMarks) * 100),
          totalStudyTime: Math.round(totalTime / 3600), // Convert to hours
          currentRank: Math.floor(Math.random() * 50) + 1 // This would be calculated based on actual ranking logic
        });
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  // Chapter data for different subjects
  const getChaptersBySubject = (subject: string, classNum: number) => {
    const chapterData: Record<string, Record<number, any[]>> = {
      'mathematics': {
        6: [
          { id: 'ch1', title: 'Knowing Our Numbers', materials: 8, videos: 5, tests: 3, progress: 75 },
          { id: 'ch2', title: 'Whole Numbers', materials: 6, videos: 4, tests: 2, progress: 60 },
          { id: 'ch3', title: 'Playing with Numbers', materials: 7, videos: 6, tests: 4, progress: 40 },
          { id: 'ch4', title: 'Basic Geometrical Ideas', materials: 9, videos: 7, tests: 3, progress: 20 },
          { id: 'ch5', title: 'Understanding Elementary Shapes', materials: 5, videos: 4, tests: 2, progress: 0 }
        ],
        7: [
          { id: 'ch1', title: 'Integers', materials: 10, videos: 6, tests: 4, progress: 85 },
          { id: 'ch2', title: 'Fractions and Decimals', materials: 8, videos: 5, tests: 3, progress: 70 },
          { id: 'ch3', title: 'Data Handling', materials: 6, videos: 4, tests: 2, progress: 45 },
          { id: 'ch4', title: 'Simple Equations', materials: 9, videos: 7, tests: 5, progress: 30 },
          { id: 'ch5', title: 'Lines and Angles', materials: 7, videos: 5, tests: 3, progress: 15 }
        ],
        8: [
          { id: 'ch1', title: 'Rational Numbers', materials: 12, videos: 8, tests: 5, progress: 90 },
          { id: 'ch2', title: 'Linear Equations in One Variable', materials: 10, videos: 6, tests: 4, progress: 75 },
          { id: 'ch3', title: 'Understanding Quadrilaterals', materials: 8, videos: 5, tests: 3, progress: 50 },
          { id: 'ch4', title: 'Practical Geometry', materials: 6, videos: 4, tests: 2, progress: 25 },
          { id: 'ch5', title: 'Data Handling', materials: 9, videos: 6, tests: 4, progress: 10 }
        ]
      },
      'science': {
        6: [
          { id: 'ch1', title: 'Food: Where Does it Come From?', materials: 7, videos: 5, tests: 3, progress: 80 },
          { id: 'ch2', title: 'Components of Food', materials: 6, videos: 4, tests: 2, progress: 65 },
          { id: 'ch3', title: 'Fibre to Fabric', materials: 8, videos: 6, tests: 3, progress: 35 },
          { id: 'ch4', title: 'Sorting Materials into Groups', materials: 9, videos: 7, tests: 4, progress: 20 },
          { id: 'ch5', title: 'Separation of Substances', materials: 7, videos: 5, tests: 3, progress: 5 }
        ],
        7: [
          { id: 'ch1', title: 'Nutrition in Plants', materials: 10, videos: 7, tests: 4, progress: 88 },
          { id: 'ch2', title: 'Nutrition in Animals', materials: 8, videos: 6, tests: 3, progress: 72 },
          { id: 'ch3', title: 'Heat', materials: 9, videos: 5, tests: 4, progress: 55 },
          { id: 'ch4', title: 'Acids, Bases and Salts', materials: 7, videos: 4, tests: 3, progress: 40 },
          { id: 'ch5', title: 'Physical and Chemical Changes', materials: 6, videos: 5, tests: 2, progress: 25 }
        ],
        8: [
          { id: 'ch1', title: 'Crop Production and Management', materials: 11, videos: 8, tests: 5, progress: 92 },
          { id: 'ch2', title: 'Microorganisms: Friend and Foe', materials: 9, videos: 6, tests: 4, progress: 78 },
          { id: 'ch3', title: 'Synthetic Fibres and Plastics', materials: 7, videos: 5, tests: 3, progress: 60 },
          { id: 'ch4', title: 'Materials: Metals and Non-Metals', materials: 10, videos: 7, tests: 4, progress: 45 },
          { id: 'ch5', title: 'Coal and Petroleum', materials: 8, videos: 6, tests: 3, progress: 30 }
        ]
      },
      'english': {
        6: [
          { id: 'ch1', title: 'A Tale of Two Birds', materials: 6, videos: 4, tests: 2, progress: 85 },
          { id: 'ch2', title: 'The Friendly Mongoose', materials: 5, videos: 3, tests: 2, progress: 70 },
          { id: 'ch3', title: 'The Shepherd\'s Treasure', materials: 7, videos: 5, tests: 3, progress: 50 },
          { id: 'ch4', title: 'The Old-Clock Shop', materials: 4, videos: 3, tests: 1, progress: 30 },
          { id: 'ch5', title: 'Tansen', materials: 8, videos: 6, tests: 3, progress: 15 }
        ],
        7: [
          { id: 'ch1', title: 'Three Questions', materials: 8, videos: 5, tests: 3, progress: 90 },
          { id: 'ch2', title: 'A Gift of Chappals', materials: 6, videos: 4, tests: 2, progress: 75 },
          { id: 'ch3', title: 'Gopal and the Hilsa-Fish', materials: 7, videos: 5, tests: 3, progress: 60 },
          { id: 'ch4', title: 'The Ashes That Made Trees Bloom', materials: 5, videos: 3, tests: 2, progress: 40 },
          { id: 'ch5', title: 'Quality', materials: 9, videos: 6, tests: 4, progress: 25 }
        ],
        8: [
          { id: 'ch1', title: 'The Best Christmas Present in the World', materials: 10, videos: 7, tests: 4, progress: 95 },
          { id: 'ch2', title: 'The Tsunami', materials: 8, videos: 5, tests: 3, progress: 80 },
          { id: 'ch3', title: 'Glimpses of the Past', materials: 12, videos: 8, tests: 5, progress: 65 },
          { id: 'ch4', title: 'Bepin Choudhury\'s Lapse of Memory', materials: 7, videos: 4, tests: 3, progress: 45 },
          { id: 'ch5', title: 'The Summit Within', materials: 9, videos: 6, tests: 4, progress: 30 }
        ]
      },
      'social-science': {
        6: [
          { id: 'ch1', title: 'What, Where, How and When?', materials: 8, videos: 5, tests: 3, progress: 70 },
          { id: 'ch2', title: 'From Hunting-Gathering to Growing Food', materials: 7, videos: 4, tests: 2, progress: 55 },
          { id: 'ch3', title: 'In the Earliest Cities', materials: 9, videos: 6, tests: 4, progress: 40 },
          { id: 'ch4', title: 'What Books and Burials Tell Us', materials: 6, videos: 3, tests: 2, progress: 25 },
          { id: 'ch5', title: 'Kingdoms, Kings and an Early Republic', materials: 10, videos: 7, tests: 5, progress: 10 }
        ],
        7: [
          { id: 'ch1', title: 'Geographical Diversity of India', materials: 12, videos: 8, tests: 5, progress: 82 },
          { id: 'ch2', title: 'Understanding the Weather', materials: 10, videos: 6, tests: 4, progress: 68 },
          { id: 'ch3', title: 'Climates of India', materials: 9, videos: 7, tests: 3, progress: 50 },
          { id: 'ch4', title: 'New Beginnings: Cities and States', materials: 11, videos: 5, tests: 4, progress: 35 },
          { id: 'ch5', title: 'The Rise of Empires', materials: 13, videos: 9, tests: 6, progress: 20 },
          { id: 'ch6', title: 'The Age of Reorganisation', materials: 10, videos: 6, tests: 4, progress: 15 },
          { id: 'ch7', title: 'The Gupta Era: An Age of Tireless Creativity', materials: 14, videos: 10, tests: 5, progress: 10 },
          { id: 'ch8', title: 'How the Land Becomes Sacred', materials: 8, videos: 5, tests: 3, progress: 5 },
          { id: 'ch9', title: 'From the Rulers to the Ruled: Types of Governments', materials: 12, videos: 7, tests: 5, progress: 0 },
          { id: 'ch10', title: 'The Constitution of India - An Introduction', materials: 15, videos: 8, tests: 6, progress: 0 },
          { id: 'ch11', title: 'From Barter to Money', materials: 9, videos: 6, tests: 4, progress: 0 },
          { id: 'ch12', title: 'Understanding Markets', materials: 11, videos: 7, tests: 5, progress: 0 }
        ],
        8: [
          { id: 'ch1', title: 'How, When and Where', materials: 10, videos: 7, tests: 4, progress: 88 },
          { id: 'ch2', title: 'From Trade to Territory', materials: 12, videos: 8, tests: 5, progress: 75 },
          { id: 'ch3', title: 'Ruling the Countryside', materials: 9, videos: 6, tests: 3, progress: 60 },
          { id: 'ch4', title: 'Tribals, Dikus and the Vision of a Golden Age', materials: 8, videos: 5, tests: 3, progress: 45 },
          { id: 'ch5', title: 'When People Rebel', materials: 11, videos: 7, tests: 4, progress: 30 }
        ]
      },
      'hindi': {
        6: [
          { id: 'ch1', title: 'वह चिड़िया जो', materials: 6, videos: 4, tests: 2, progress: 75 },
          { id: 'ch2', title: 'बचपन', materials: 5, videos: 3, tests: 2, progress: 60 },
          { id: 'ch3', title: 'नादान दोस्त', materials: 7, videos: 5, tests: 3, progress: 45 },
          { id: 'ch4', title: 'चाँद से थोड़ी सी गप्पें', materials: 4, videos: 3, tests: 1, progress: 30 },
          { id: 'ch5', title: 'अक्षरों का महत्व', materials: 8, videos: 6, tests: 3, progress: 15 }
        ],
        7: [
          { id: 'ch1', title: 'हम पंछी उन्मुक्त गगन के', materials: 8, videos: 5, tests: 3, progress: 85 },
          { id: 'ch2', title: 'दादी माँ', materials: 6, videos: 4, tests: 2, progress: 70 },
          { id: 'ch3', title: 'हिमालय की बेटियाँ', materials: 7, videos: 5, tests: 3, progress: 55 },
          { id: 'ch4', title: 'कठपुतली', materials: 5, videos: 3, tests: 2, progress: 40 },
          { id: 'ch5', title: 'मिठाईवाला', materials: 9, videos: 6, tests: 4, progress: 25 }
        ],
        8: [
          { id: 'ch1', title: 'ध्वनि', materials: 10, videos: 7, tests: 4, progress: 90 },
          { id: 'ch2', title: 'लाख की चूड़ियाँ', materials: 8, videos: 5, tests: 3, progress: 75 },
          { id: 'ch3', title: 'बस की यात्रा', materials: 7, videos: 4, tests: 2, progress: 60 },
          { id: 'ch4', title: 'दीवानों की हस्ती', materials: 6, videos: 3, tests: 2, progress: 45 },
          { id: 'ch5', title: 'चिट्ठियों की अनूठी दुनिया', materials: 9, videos: 6, tests: 4, progress: 30 }
        ]
      },
      'sanskrit': {
        6: [
          { id: 'ch1', title: 'शब्द परिचय', materials: 5, videos: 3, tests: 2, progress: 70 },
          { id: 'ch2', title: 'स्वर संधि', materials: 6, videos: 4, tests: 3, progress: 55 },
          { id: 'ch3', title: 'धातु रूप', materials: 8, videos: 5, tests: 4, progress: 40 },
          { id: 'ch4', title: 'सुभाषितानि', materials: 4, videos: 2, tests: 1, progress: 25 },
          { id: 'ch5', title: 'श्लोक अध्ययन', materials: 7, videos: 4, tests: 3, progress: 10 }
        ],
        7: [
          { id: 'ch1', title: 'सुभाषितानि', materials: 7, videos: 4, tests: 3, progress: 80 },
          { id: 'ch2', title: 'दुर्बुद्धि विनश्यति', materials: 6, videos: 3, tests: 2, progress: 65 },
          { id: 'ch3', title: 'स्वावलम्बनम्', materials: 8, videos: 5, tests: 4, progress: 50 },
          { id: 'ch4', title: 'हास्य बालकविसम्मेलनम्', materials: 5, videos: 3, tests: 2, progress: 35 },
          { id: 'ch5', title: 'पण्डिता रमाबाई', materials: 9, videos: 6, tests: 4, progress: 20 }
        ],
        8: [
          { id: 'ch1', title: 'सुभाषितानि', materials: 9, videos: 6, tests: 4, progress: 85 },
          { id: 'ch2', title: 'बिलस्य वाणी न कदापि मे श्रुता', materials: 7, videos: 4, tests: 3, progress: 70 },
          { id: 'ch3', title: 'डिजिटल इण्डिया', materials: 8, videos: 5, tests: 3, progress: 55 },
          { id: 'ch4', title: 'सदैव पुरतो निधेहि चरणम्', materials: 6, videos: 3, tests: 2, progress: 40 },
          { id: 'ch5', title: 'कण्टकेनैव कण्टकम्', materials: 10, videos: 7, tests: 5, progress: 25 }
        ]
      }
    };

    return chapterData[subject]?.[classNum] || [];
  };

  const subjects = [
    { id: 'mathematics', name: 'Mathematics', icon: '📊', color: 'blue' },
    { id: 'science', name: 'Science', icon: '🔬', color: 'green' },
    { id: 'english', name: 'English', icon: '📚', color: 'purple' },
    { id: 'social-science', name: 'Social Science', icon: '🌍', color: 'orange' },
    { id: 'hindi', name: 'Hindi', icon: '🇮🇳', color: 'red' },
    { id: 'sanskrit', name: 'Sanskrit', icon: '🕉️', color: 'yellow' }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colors[color] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    if (progress >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Study materials data - this would typically come from a database
  const studyMaterials = [
    {
      id: '1',
      title: 'Mathematics Fundamentals',
      subject: 'Mathematics',
      pages: 45
    },
    {
      id: '2',
      title: 'Science Concepts',
      subject: 'Science',
      pages: 32
    },
    {
      id: '3',
      title: 'English Grammar',
      subject: 'English',
      pages: 28
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {currentUser?.displayName}! 👋
            </h1>
            <p className="text-blue-100">
              Ready to continue your learning journey? Let's make today count!
            </p>
            <div className="mt-2 text-xs text-blue-200">
              Last updated: {lastUpdateTime.toLocaleTimeString()}
            </div>
            {preferences.selectedClass && (
              <div className="mt-3 flex items-center space-x-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  Class {preferences.selectedClass}
                </span>
              </div>
            )}
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{dashboardStats.testsCompleted}</div>
              <div className="text-xs text-blue-100">Tests Taken</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{dashboardStats.averageScore}%</div>
              <div className="text-xs text-blue-100">Avg Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tests Completed</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.testsCompleted}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Trophy className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.averageScore}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Study Hours</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalStudyTime}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Rank</p>
              <p className="text-2xl font-bold text-gray-900">#{dashboardStats.currentRank}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Star className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Section */}
      {preferences.selectedClass && (
        <div className="mb-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Chapters Overview</h2>
              <p className="text-gray-600">Explore chapters across all subjects for Class {preferences.selectedClass}</p>
            </div>
            
            <div className="p-6">
              {/* Subject Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => setSelectedSubject(selectedSubject === subject.id ? null : subject.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedSubject === subject.id
                        ? getColorClasses(subject.color)
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{subject.icon}</span>
                    <span className="font-medium">{subject.name}</span>
                  </button>
                ))}
              </div>

              {/* Chapters Display */}
              {selectedSubject && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {subjects.find(s => s.id === selectedSubject)?.name} Chapters
                    </h3>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1">
                      <span>View All</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getChaptersBySubject(selectedSubject, preferences.selectedClass).slice(0, 6).map((chapter) => (
                      <div key={chapter.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{chapter.title}</h4>
                          <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{chapter.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all ${getProgressColor(chapter.progress)}`}
                              style={{ width: `${chapter.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Chapter Stats */}
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <FileText className="h-3 w-3 text-blue-600" />
                            </div>
                            <div className="font-medium text-gray-900">{chapter.materials}</div>
                            <div className="text-gray-500">Materials</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <Play className="h-3 w-3 text-green-600" />
                            </div>
                            <div className="font-medium text-gray-900">{chapter.videos}</div>
                            <div className="text-gray-500">Videos</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <Users className="h-3 w-3 text-purple-600" />
                            </div>
                            <div className="font-medium text-gray-900">{chapter.tests}</div>
                            <div className="text-gray-500">Tests</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!selectedSubject && (
                <div className="text-center py-8">
                  <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Subject</h3>
                  <p className="text-gray-500">Choose a subject above to view its chapters and progress</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Test Results */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Test Results</h2>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1">
                  <span>View All</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentAttempts.length > 0 ? recentAttempts.map((attempt) => (
                  <div key={attempt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">Test Attempt</h3>
                      <p className="text-sm text-gray-500">
                        Attempted: {new Date(attempt.completedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {attempt.score}/{attempt.totalMarks}
                        </div>
                        <div className="text-sm text-gray-500">
                          {Math.round((attempt.score / attempt.totalMarks) * 100)}%
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                      <Trophy className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No test attempts yet</p>
                    <button 
                      onClick={() => window.location.href = '/tests'}
                      className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Take your first test →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Tests */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Tests</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : recentAttempts.length > 0 ? (
                  recentAttempts.map((attempt) => (
                    <div key={attempt.id} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h3 className="font-medium text-gray-900 mb-2">Recent Test Attempt</h3>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Score: {attempt.score}/{attempt.totalMarks}</span>
                        <span className={`font-medium ${
                          Math.round((attempt.score / attempt.totalMarks) * 100) >= 70 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {Math.round((attempt.score / attempt.totalMarks) * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(attempt.completedAt).toLocaleDateString()}</span>
                        </div>
                        {attempt.timeSpent && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{Math.round(attempt.timeSpent / 60)}m</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="font-medium text-gray-900 mb-2">Ready to Test Your Knowledge?</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Explore our comprehensive test library and start your learning journey.
                    </p>
                    <button 
                      onClick={() => window.location.href = '/tests'}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Browse Available Tests
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Study Materials */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Quick Access</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <button 
                  onClick={() => window.location.href = '/study-material'}
                  className="w-full flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <BookOpen className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 text-sm">Study Materials</p>
                      <p className="text-xs text-gray-500">Access learning resources</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
                
                <button 
                  onClick={() => window.location.href = '/tests'}
                  className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Target className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 text-sm">Practice Tests</p>
                      <p className="text-xs text-gray-500">Test your knowledge</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
                
                <button 
                  onClick={() => window.location.href = '/results'}
                  className="w-full flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 text-sm">View Results</p>
                      <p className="text-xs text-gray-500">Track your progress</p>
                      </div>
                    </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Study Materials */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Study Materials</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {studyMaterials.map((material) => (
                  <div key={material.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <BookOpen className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{material.title}</p>
                        <p className="text-xs text-gray-500">{material.subject}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{material.pages}p</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;