import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  BookOpen, 
  Zap, 
  Brain,
  Search,
  Filter,
  Clock,
  Star,
  List,
  Grid,
  Award
} from 'lucide-react';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import ChapterNavigation from '../components/Chapters/ChapterNavigation';

const StudyMaterialPage: React.FC = () => {
  const { preferences } = useUserPreferences();
  const [viewMode, setViewMode] = useState<'chapters' | 'materials'>('chapters');
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<number | 'all'>(preferences.selectedClass || 'all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Enhanced materials with Social Science Class 7 content
  const materials = [
    // Social Science Class 7 Materials
    {
      id: 1,
      title: 'Geographical Diversity of India - Complete Guide',
      subject: 'Social Science',
      class: 7,
      chapter: 'ch1',
      chapterName: 'Geographical Diversity of India',
      description: 'Comprehensive study material covering India\'s physical features, climate zones, rivers, mountains, and natural resources.',
      pages: 52,
      fileSize: '4.2 MB',
      uploadDate: '2024-01-15',
      downloads: 1834,
      rating: 4.9,
      hasSummary: true,
      hasFlashcards: true
    },
    {
      id: 2,
      title: 'Understanding Weather Patterns',
      subject: 'Social Science',
      class: 7,
      chapter: 'ch2',
      chapterName: 'Understanding the Weather',
      description: 'Detailed explanation of weather phenomena, monsoons, and climate factors affecting India.',
      pages: 38,
      fileSize: '3.1 MB',
      uploadDate: '2024-01-12',
      downloads: 1567,
      rating: 4.8,
      hasSummary: true,
      hasFlashcards: true
    },
    {
      id: 3,
      title: 'Climates of India - Regional Study',
      subject: 'Social Science',
      class: 7,
      chapter: 'ch3',
      chapterName: 'Climates of India',
      description: 'Explore different climate types across Indian regions with maps and detailed analysis.',
      pages: 45,
      fileSize: '3.8 MB',
      uploadDate: '2024-01-10',
      downloads: 1423,
      rating: 4.7,
      hasSummary: true,
      hasFlashcards: false
    },
    {
      id: 4,
      title: 'Rise of Empires - Ancient India',
      subject: 'Social Science',
      class: 7,
      chapter: 'ch5',
      chapterName: 'The Rise of Empires',
      description: 'Comprehensive coverage of ancient Indian empires, their administration, and cultural achievements.',
      pages: 67,
      fileSize: '5.2 MB',
      uploadDate: '2024-01-08',
      downloads: 1756,
      rating: 4.9,
      hasSummary: true,
      hasFlashcards: true
    },
    {
      id: 5,
      title: 'The Gupta Era - Golden Age of India',
      subject: 'Social Science',
      class: 7,
      chapter: 'ch7',
      chapterName: 'The Gupta Era: An Age of Tireless Creativity',
      description: 'Detailed study of Gupta period achievements in art, science, literature, and administration.',
      pages: 58,
      fileSize: '4.5 MB',
      uploadDate: '2024-01-05',
      downloads: 1634,
      rating: 4.8,
      hasSummary: true,
      hasFlashcards: true
    },
    {
      id: 6,
      title: 'Constitution of India - Introduction',
      subject: 'Social Science',
      class: 7,
      chapter: 'ch10',
      chapterName: 'The Constitution of India - An Introduction',
      description: 'Basic understanding of Indian Constitution, fundamental rights, and democratic principles.',
      pages: 41,
      fileSize: '2.9 MB',
      uploadDate: '2024-01-03',
      downloads: 1892,
      rating: 4.9,
      hasSummary: true,
      hasFlashcards: true
    },
    {
      id: 7,
      title: 'From Barter to Money - Economic History',
      subject: 'Social Science',
      class: 7,
      chapter: 'ch11',
      chapterName: 'From Barter to Money',
      description: 'Evolution of trade systems, currency development, and economic activities in ancient India.',
      pages: 35,
      fileSize: '2.7 MB',
      uploadDate: '2024-01-01',
      downloads: 1345,
      rating: 4.6,
      hasSummary: false,
      hasFlashcards: true
    },
    {
      id: 8,
      title: 'Understanding Markets - Economic Systems',
      subject: 'Social Science',
      class: 7,
      chapter: 'ch12',
      chapterName: 'Understanding Markets',
      description: 'Learn about market systems, trade networks, and economic activities in medieval India.',
      pages: 43,
      fileSize: '3.3 MB',
      uploadDate: '2023-12-28',
      downloads: 1234,
      rating: 4.7,
      hasSummary: true,
      hasFlashcards: false
    },
    // Other subjects materials
    {
      id: 9,
      title: 'Algebra Fundamentals',
      subject: 'Mathematics',
      class: 7,
      chapter: 'ch4',
      chapterName: 'Simple Equations',
      description: 'Comprehensive guide covering basic algebraic concepts, equations, and problem-solving techniques.',
      pages: 45,
      fileSize: '2.3 MB',
      uploadDate: '2024-01-15',
      downloads: 1234,
      rating: 4.8,
      hasSummary: true,
      hasFlashcards: true
    },
    {
      id: 10,
      title: 'Forces and Motion',
      subject: 'Science',
      class: 8,
      chapter: 'ch4',
      chapterName: 'Force and Laws of Motion',
      description: 'Detailed explanation of Newton\'s laws, friction, momentum, and energy concepts.',
      pages: 38,
      fileSize: '3.1 MB',
      uploadDate: '2024-01-12',
      downloads: 987,
      rating: 4.7,
      hasSummary: true,
      hasFlashcards: false
    }
  ];

  const subjects = [
    { id: 'mathematics', name: 'Mathematics', icon: '📊', color: 'blue' },
    { id: 'science', name: 'Science', icon: '🔬', color: 'green' },
    { id: 'english', name: 'English', icon: '📚', color: 'purple' },
    { id: 'social-science', name: 'Social Science', icon: '🌍', color: 'orange' },
    { id: 'hindi', name: 'Hindi', icon: '🇮🇳', color: 'red' },
    { id: 'sanskrit', name: 'Sanskrit', icon: '🕉️', color: 'yellow' }
  ];
  
  const classes = [6, 7, 8];

  const filteredMaterials = materials.filter(material => {
    const matchesClass = selectedClass === 'all' || material.class === selectedClass;
    const matchesSubject = selectedSubject === 'all' || material.subject.toLowerCase().replace(' ', '-') === selectedSubject;
    const matchesChapter = !selectedChapter || material.chapter === selectedChapter;
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.chapterName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSubject && matchesChapter && matchesSearch;
  });

  const handleGenerateSummary = (materialId: number) => {
    console.log('Generating summary for material:', materialId);
  };

  const handleGenerateFlashcards = (materialId: number) => {
    console.log('Generating flashcards for material:', materialId);
  };

  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapter(chapterId);
    setViewMode('materials');
  };

  const handleSubjectSelect = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setViewMode('chapters');
  };

  // Get featured materials for current class and subject
  const getFeaturedMaterials = () => {
    if (selectedClass !== 'all' && selectedSubject !== 'all') {
      return materials.filter(m => 
        m.class === selectedClass && 
        m.subject.toLowerCase().replace(' ', '-') === selectedSubject
      ).slice(0, 3);
    }
    return [];
  };

  const getSubjectDisplayName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : subjectId.replace('-', ' ');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Materials</h1>
        <p className="text-gray-600">Access comprehensive study resources with AI-powered features</p>
      </div>

      {/* Subject Selection */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Subject</h2>
            <p className="text-gray-600">Select a subject to explore its chapters and study materials</p>
          </div>
          {preferences.selectedClass && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Current Class:</span>
              <span className="font-medium text-blue-600">Class {preferences.selectedClass}</span>
            </div>
          )}
        </div>

        {/* Subject Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => handleSubjectSelect(subject.id)}
              className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                selectedSubject === subject.id
                  ? `border-${subject.color}-500 bg-${subject.color}-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{subject.icon}</div>
                <div className="font-medium text-gray-900 text-sm">{subject.name}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Materials Banner */}
      {getFeaturedMaterials().length > 0 && (
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                🌍 {getSubjectDisplayName(selectedSubject)} - Class {selectedClass}
              </h2>
              <p className="text-orange-100">
                Explore comprehensive study materials for {getSubjectDisplayName(selectedSubject)}
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">{getFeaturedMaterials().length}</div>
                <div className="text-sm text-orange-100">Materials</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getFeaturedMaterials().map((material) => (
              <div key={material.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-sm">{material.title}</h3>
                <div className="flex items-center justify-between text-xs text-orange-100">
                  <span>{material.pages} pages</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-current" />
                    <span>{material.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View Mode Toggle */}
      {selectedSubject !== 'all' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('chapters')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'chapters'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="h-4 w-4" />
                  <span>By Chapters</span>
                </button>
                <button
                  onClick={() => setViewMode('materials')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'materials'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                  <span>All Materials</span>
                </button>
              </div>

              {selectedChapter && viewMode === 'materials' && (
                <button
                  onClick={() => {
                    setSelectedChapter(null);
                    setViewMode('chapters');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  ← Back to Chapters
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Subject:</span>
              <span className="font-medium text-blue-600">{getSubjectDisplayName(selectedSubject)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Chapter Navigation View */}
      {viewMode === 'chapters' && selectedSubject !== 'all' && preferences.selectedClass && (
        <ChapterNavigation
          selectedClass={preferences.selectedClass}
          selectedSubject={selectedSubject}
          onChapterSelect={handleChapterSelect}
        />
      )}

      {/* Materials View */}
      {viewMode === 'materials' && (
        <>
          {/* Filters and Search */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search materials..."
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
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Filter className="h-4 w-4" />
                <span>{filteredMaterials.length} materials found</span>
              </div>
            </div>
          </div>

          {/* Materials Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMaterials.map((material) => (
              <div key={material.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{material.title}</h3>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          material.subject === 'Social Science' 
                            ? 'bg-orange-100 text-orange-800' 
                            : material.subject === 'Mathematics'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {material.subject}
                        </span>
                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                          Class {material.class}
                        </span>
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                          {material.chapterName}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      material.subject === 'Social Science' 
                        ? 'bg-orange-100' 
                        : material.subject === 'Mathematics'
                        ? 'bg-blue-100'
                        : 'bg-green-100'
                    }`}>
                      <FileText className={`h-6 w-6 ${
                        material.subject === 'Social Science' 
                          ? 'text-orange-600' 
                          : material.subject === 'Mathematics'
                          ? 'text-blue-600'
                          : 'text-green-600'
                      }`} />
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{material.description}</p>

                  {/* Material Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">{material.pages}</div>
                      <div className="text-xs text-gray-500">Pages</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">{material.fileSize}</div>
                      <div className="text-xs text-gray-500">Size</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900">{material.downloads}</div>
                      <div className="text-xs text-gray-500">Downloads</div>
                    </div>
                  </div>

                  {/* Rating and Upload Date */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{material.rating}</span>
                      {material.rating >= 4.8 && (
                        <Award className="h-4 w-4 text-yellow-500 ml-1" title="Highly Rated" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{material.uploadDate}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {/* Primary Actions */}
                    <div className="flex space-x-3">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                        <Eye className="h-4 w-4" />
                        <span>View PDF</span>
                      </button>
                      <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                    </div>

                    {/* AI Features */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleGenerateSummary(material.id)}
                        disabled={material.hasSummary}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                          material.hasSummary
                            ? 'bg-green-100 text-green-800'
                            : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                        }`}
                      >
                        <Zap className="h-4 w-4" />
                        <span>{material.hasSummary ? 'Summary Ready' : 'Generate Summary'}</span>
                      </button>
                      <button
                        onClick={() => handleGenerateFlashcards(material.id)}
                        disabled={material.hasFlashcards}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                          material.hasFlashcards
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                        }`}
                      >
                        <Brain className="h-4 w-4" />
                        <span>{material.hasFlashcards ? 'Cards Ready' : 'Make Flashcards'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMaterials.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          )}
        </>
      )}

      {/* Default state when no subject is selected */}
      {selectedSubject === 'all' && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Subject</h3>
          <p className="text-gray-500">Choose a subject above to explore its chapters and study materials</p>
        </div>
      )}
    </div>
  );
};

export default StudyMaterialPage;