import React, { useState } from 'react';
import { 
  Play, 
  Clock, 
  Eye, 
  Star, 
  Search,
  Filter,
  BookOpen,
  Users,
  Calendar,
  Zap
} from 'lucide-react';

const VideosPage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<number | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const comingSoonVideos = [
    {
      id: 1,
      title: 'Algebra Fundamentals - Linear Equations',
      subject: 'Mathematics',
      class: 7,
      duration: '15:30',
      views: 0,
      rating: 0,
      thumbnail: 'https://images.pexels.com/photos/6238050/pexels-photo-6238050.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Master the basics of linear equations with step-by-step explanations and practice problems.',
      instructor: 'Dr. Priya Sharma',
      level: 'Beginner'
    },
    {
      id: 2,
      title: 'Forces and Motion - Newton\'s Laws',
      subject: 'Physics',
      class: 8,
      duration: '22:45',
      views: 0,
      rating: 0,
      thumbnail: 'https://images.pexels.com/photos/8471888/pexels-photo-8471888.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Explore Newton\'s three laws of motion with real-world examples and interactive demonstrations.',
      instructor: 'Prof. Rajesh Kumar',
      level: 'Intermediate'
    },
    {
      id: 3,
      title: 'English Grammar - Tenses Made Easy',
      subject: 'English',
      class: 6,
      duration: '18:20',
      views: 0,
      rating: 0,
      thumbnail: 'https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Understand all English tenses with simple explanations and practical examples.',
      instructor: 'Ms. Anjali Verma',
      level: 'Beginner'
    },
    {
      id: 4,
      title: 'Chemical Reactions - Types and Examples',
      subject: 'Chemistry',
      class: 8,
      duration: '25:10',
      views: 0,
      rating: 0,
      thumbnail: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Learn about different types of chemical reactions with laboratory demonstrations.',
      instructor: 'Dr. Suresh Patel',
      level: 'Intermediate'
    },
    {
      id: 5,
      title: 'Medieval Indian History - Delhi Sultanate',
      subject: 'History',
      class: 7,
      duration: '20:15',
      views: 0,
      rating: 0,
      thumbnail: 'https://images.pexels.com/photos/1583582/pexels-photo-1583582.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Journey through the Delhi Sultanate period with maps, timelines, and key events.',
      instructor: 'Prof. Meera Singh',
      level: 'Intermediate'
    },
    {
      id: 6,
      title: 'Geography - Climate and Weather Patterns',
      subject: 'Geography',
      class: 6,
      duration: '16:40',
      views: 0,
      rating: 0,
      thumbnail: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Understand climate zones and weather patterns around the world.',
      instructor: 'Dr. Vikram Joshi',
      level: 'Beginner'
    }
  ];

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'English', 'History', 'Geography'];
  const classes = [6, 7, 8];

  const filteredVideos = comingSoonVideos.filter(video => {
    const matchesClass = selectedClass === 'all' || video.class === selectedClass;
    const matchesSubject = selectedSubject === 'all' || video.subject === selectedSubject;
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSubject && matchesSearch;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Educational Videos</h1>
        <p className="text-gray-600">Learn with engaging video content from expert instructors</p>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="h-6 w-6" />
              <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Coming Soon</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Video Library is Under Development</h2>
            <p className="text-purple-100 mb-4">
              We're creating high-quality educational videos with expert instructors. 
              Get ready for an immersive learning experience!
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Play className="h-4 w-4" />
                <span>HD Quality Videos</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Expert Instructors</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Interactive Content</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm text-purple-100">Videos Planned</div>
            </div>
          </div>
        </div>
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
                placeholder="Search videos..."
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
            <span>{filteredVideos.length} videos planned</span>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div key={video.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden opacity-75">
            {/* Video Thumbnail */}
            <div className="relative">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-4">
                  <Play className="h-8 w-8 text-gray-600" />
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{video.duration}</span>
              </div>
              <div className="absolute top-4 left-4 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                Coming Soon
              </div>
            </div>

            {/* Video Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      {video.subject}
                    </span>
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                      Class {video.class}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getLevelColor(video.level)}`}>
                      {video.level}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{video.description}</p>

              {/* Instructor */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{video.instructor}</p>
                  <p className="text-xs text-gray-500">Instructor</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>Preview Soon</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>New</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button 
                disabled
                className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg font-medium cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Calendar className="h-4 w-4" />
                <span>Available Soon</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Play className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
          <p className="text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      )}

      {/* Newsletter Signup */}
      <div className="mt-12 bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Get Notified When Videos Launch</h3>
        <p className="text-gray-600 mb-6">Be the first to know when our video library goes live!</p>
        <div className="max-w-md mx-auto flex space-x-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Notify Me
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideosPage;