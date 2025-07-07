import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronRight, FileText, Play, Users, Download, Eye } from 'lucide-react';

interface Chapter {
  id: string;
  title: string;
  description: string;
  materials: number;
  videos: number;
  tests: number;
  isCompleted?: boolean;
}

interface SamplePaper {
  id: string;
  title: string;
  type: 'Mock Test' | 'Previous Year' | 'Practice Paper';
  duration: number;
  marks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  downloadUrl: string;
}

interface ChapterNavigationProps {
  selectedClass: 6 | 7 | 8;
  selectedSubject: string;
  onChapterSelect: (chapterId: string) => void;
}

const ChapterNavigation: React.FC<ChapterNavigationProps> = ({
  selectedClass,
  selectedSubject,
  onChapterSelect
}) => {
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chapters' | 'sample-papers'>('chapters');

  // Enhanced Social Science Class 7 chapters
  const getChaptersBySubject = (subject: string, classNum: number): Chapter[] => {
    const chapterData: Record<string, Record<number, Chapter[]>> = {
      'social-science': {
        7: [
          { 
            id: 'ch1', 
            title: 'Geographical Diversity of India', 
            description: 'Explore India\'s diverse physical features, climate zones, and natural resources', 
            materials: 12, 
            videos: 8, 
            tests: 5 
          },
          { 
            id: 'ch2', 
            title: 'Understanding the Weather', 
            description: 'Learn about weather patterns, monsoons, and climate factors', 
            materials: 10, 
            videos: 6, 
            tests: 4 
          },
          { 
            id: 'ch3', 
            title: 'Climates of India', 
            description: 'Study different climate types across Indian regions', 
            materials: 9, 
            videos: 7, 
            tests: 3 
          },
          { 
            id: 'ch4', 
            title: 'New Beginnings: Cities and States', 
            description: 'Understand the formation of early cities and state systems', 
            materials: 11, 
            videos: 5, 
            tests: 4 
          },
          { 
            id: 'ch5', 
            title: 'The Rise of Empires', 
            description: 'Learn about the emergence and expansion of ancient empires', 
            materials: 13, 
            videos: 9, 
            tests: 6 
          },
          { 
            id: 'ch6', 
            title: 'The Age of Reorganisation', 
            description: 'Study political and social changes in medieval India', 
            materials: 10, 
            videos: 6, 
            tests: 4 
          },
          { 
            id: 'ch7', 
            title: 'The Gupta Era: An Age of Tireless Creativity', 
            description: 'Explore the golden age of Indian culture and achievements', 
            materials: 14, 
            videos: 10, 
            tests: 5 
          },
          { 
            id: 'ch8', 
            title: 'How the Land Becomes Sacred', 
            description: 'Understand the relationship between geography and culture', 
            materials: 8, 
            videos: 5, 
            tests: 3 
          },
          { 
            id: 'ch9', 
            title: 'From the Rulers to the Ruled: Types of Governments', 
            description: 'Learn about different forms of government and governance', 
            materials: 12, 
            videos: 7, 
            tests: 5 
          },
          { 
            id: 'ch10', 
            title: 'The Constitution of India - An Introduction', 
            description: 'Basic understanding of Indian Constitution and democracy', 
            materials: 15, 
            videos: 8, 
            tests: 6 
          },
          { 
            id: 'ch11', 
            title: 'From Barter to Money', 
            description: 'Evolution of trade and monetary systems', 
            materials: 9, 
            videos: 6, 
            tests: 4 
          },
          { 
            id: 'ch12', 
            title: 'Understanding Markets', 
            description: 'Learn about market systems and economic activities', 
            materials: 11, 
            videos: 7, 
            tests: 5 
          }
        ],
        6: [
          { id: 'ch1', title: 'What, Where, How and When?', description: 'Introduction to history and historical sources', materials: 8, videos: 5, tests: 3 },
          { id: 'ch2', title: 'From Hunting-Gathering to Growing Food', description: 'Neolithic revolution and early agriculture', materials: 7, videos: 4, tests: 2 },
          { id: 'ch3', title: 'In the Earliest Cities', description: 'Harappan civilization and urban planning', materials: 9, videos: 6, tests: 4 },
          { id: 'ch4', title: 'What Books and Burials Tell Us', description: 'Vedic period and archaeological evidence', materials: 6, videos: 3, tests: 2 },
          { id: 'ch5', title: 'Kingdoms, Kings and an Early Republic', description: 'Early political systems in India', materials: 10, videos: 7, tests: 5 }
        ],
        8: [
          { id: 'ch1', title: 'How, When and Where', description: 'Introduction to modern Indian history', materials: 10, videos: 7, tests: 4 },
          { id: 'ch2', title: 'From Trade to Territory', description: 'British expansion in India', materials: 12, videos: 8, tests: 5 },
          { id: 'ch3', title: 'Ruling the Countryside', description: 'Colonial agricultural policies', materials: 9, videos: 6, tests: 3 },
          { id: 'ch4', title: 'Tribals, Dikus and the Vision of a Golden Age', description: 'Tribal societies and colonial impact', materials: 8, videos: 5, tests: 3 },
          { id: 'ch5', title: 'When People Rebel', description: 'The revolt of 1857', materials: 11, videos: 7, tests: 4 }
        ]
      },
      'mathematics': {
        6: [
          { id: 'ch1', title: 'Knowing Our Numbers', description: 'Place value, comparison, and estimation', materials: 8, videos: 5, tests: 3 },
          { id: 'ch2', title: 'Whole Numbers', description: 'Properties and operations', materials: 6, videos: 4, tests: 2 },
          { id: 'ch3', title: 'Playing with Numbers', description: 'Factors, multiples, and divisibility', materials: 7, videos: 6, tests: 4 },
          { id: 'ch4', title: 'Basic Geometrical Ideas', description: 'Points, lines, and shapes', materials: 9, videos: 7, tests: 3 },
          { id: 'ch5', title: 'Understanding Elementary Shapes', description: '2D and 3D shapes', materials: 5, videos: 4, tests: 2 }
        ],
        7: [
          { id: 'ch1', title: 'Integers', description: 'Positive and negative numbers', materials: 10, videos: 6, tests: 4 },
          { id: 'ch2', title: 'Fractions and Decimals', description: 'Operations with fractions', materials: 8, videos: 5, tests: 3 },
          { id: 'ch3', title: 'Data Handling', description: 'Collection and representation', materials: 6, videos: 4, tests: 2 },
          { id: 'ch4', title: 'Simple Equations', description: 'Solving linear equations', materials: 9, videos: 7, tests: 5 },
          { id: 'ch5', title: 'Lines and Angles', description: 'Properties of lines and angles', materials: 7, videos: 5, tests: 3 }
        ],
        8: [
          { id: 'ch1', title: 'Rational Numbers', description: 'Properties and operations', materials: 12, videos: 8, tests: 5 },
          { id: 'ch2', title: 'Linear Equations in One Variable', description: 'Solving complex equations', materials: 10, videos: 6, tests: 4 },
          { id: 'ch3', title: 'Understanding Quadrilaterals', description: 'Properties of quadrilaterals', materials: 8, videos: 5, tests: 3 },
          { id: 'ch4', title: 'Practical Geometry', description: 'Construction of quadrilaterals', materials: 6, videos: 4, tests: 2 },
          { id: 'ch5', title: 'Data Handling', description: 'Graphs and probability', materials: 9, videos: 6, tests: 4 }
        ]
      },
      'science': {
        6: [
          { id: 'ch1', title: 'Food: Where Does it Come From?', description: 'Sources of food and nutrition', materials: 7, videos: 5, tests: 3 },
          { id: 'ch2', title: 'Components of Food', description: 'Nutrients and balanced diet', materials: 6, videos: 4, tests: 2 },
          { id: 'ch3', title: 'Fibre to Fabric', description: 'Natural and synthetic fibres', materials: 8, videos: 6, tests: 3 },
          { id: 'ch4', title: 'Sorting Materials into Groups', description: 'Properties of materials', materials: 9, videos: 7, tests: 4 },
          { id: 'ch5', title: 'Separation of Substances', description: 'Methods of separation', materials: 7, videos: 5, tests: 3 }
        ],
        7: [
          { id: 'ch1', title: 'Nutrition in Plants', description: 'Photosynthesis and plant nutrition', materials: 10, videos: 7, tests: 4 },
          { id: 'ch2', title: 'Nutrition in Animals', description: 'Digestive system and nutrition', materials: 8, videos: 6, tests: 3 },
          { id: 'ch3', title: 'Heat', description: 'Temperature and heat transfer', materials: 9, videos: 5, tests: 4 },
          { id: 'ch4', title: 'Acids, Bases and Salts', description: 'Properties and reactions', materials: 7, videos: 4, tests: 3 },
          { id: 'ch5', title: 'Physical and Chemical Changes', description: 'Types of changes in matter', materials: 6, videos: 5, tests: 2 }
        ],
        8: [
          { id: 'ch1', title: 'Crop Production and Management', description: 'Agricultural practices', materials: 11, videos: 8, tests: 5 },
          { id: 'ch2', title: 'Microorganisms: Friend and Foe', description: 'Beneficial and harmful microbes', materials: 9, videos: 6, tests: 4 },
          { id: 'ch3', title: 'Synthetic Fibres and Plastics', description: 'Man-made materials', materials: 7, videos: 5, tests: 3 },
          { id: 'ch4', title: 'Materials: Metals and Non-Metals', description: 'Properties and uses', materials: 10, videos: 7, tests: 4 },
          { id: 'ch5', title: 'Coal and Petroleum', description: 'Natural resources and conservation', materials: 8, videos: 6, tests: 3 }
        ]
      },
      'english': {
        6: [
          { id: 'ch1', title: 'A Tale of Two Birds', description: 'Story comprehension and vocabulary', materials: 6, videos: 4, tests: 2 },
          { id: 'ch2', title: 'The Friendly Mongoose', description: 'Reading and understanding', materials: 5, videos: 3, tests: 2 },
          { id: 'ch3', title: 'The Shepherd\'s Treasure', description: 'Moral values and language', materials: 7, videos: 5, tests: 3 },
          { id: 'ch4', title: 'The Old-Clock Shop', description: 'Poetry and rhythm', materials: 4, videos: 3, tests: 1 },
          { id: 'ch5', title: 'Tansen', description: 'Biography and historical context', materials: 8, videos: 6, tests: 3 }
        ],
        7: [
          { id: 'ch1', title: 'Three Questions', description: 'Philosophical story by Tolstoy', materials: 8, videos: 5, tests: 3 },
          { id: 'ch2', title: 'A Gift of Chappals', description: 'Contemporary Indian story', materials: 6, videos: 4, tests: 2 },
          { id: 'ch3', title: 'Gopal and the Hilsa-Fish', description: 'Folk tale and humor', materials: 7, videos: 5, tests: 3 },
          { id: 'ch4', title: 'The Ashes That Made Trees Bloom', description: 'Japanese folk tale', materials: 5, videos: 3, tests: 2 },
          { id: 'ch5', title: 'Quality', description: 'Story about craftsmanship', materials: 9, videos: 6, tests: 4 }
        ],
        8: [
          { id: 'ch1', title: 'The Best Christmas Present in the World', description: 'War story and human values', materials: 10, videos: 7, tests: 4 },
          { id: 'ch2', title: 'The Tsunami', description: 'Natural disaster and survival', materials: 8, videos: 5, tests: 3 },
          { id: 'ch3', title: 'Glimpses of the Past', description: 'Indian freedom struggle', materials: 12, videos: 8, tests: 5 },
          { id: 'ch4', title: 'Bepin Choudhury\'s Lapse of Memory', description: 'Mystery and psychology', materials: 7, videos: 4, tests: 3 },
          { id: 'ch5', title: 'The Summit Within', description: 'Adventure and self-discovery', materials: 9, videos: 6, tests: 4 }
        ]
      },
      'hindi': {
        6: [
          { id: 'ch1', title: 'वह चिड़िया जो', description: 'कविता की समझ और भावना', materials: 6, videos: 4, tests: 2 },
          { id: 'ch2', title: 'बचपन', description: 'संस्मरण और भाषा कौशल', materials: 5, videos: 3, tests: 2 },
          { id: 'ch3', title: 'नादान दोस्त', description: 'कहानी और चरित्र चित्रण', materials: 7, videos: 5, tests: 3 },
          { id: 'ch4', title: 'चाँद से थोड़ी सी गप्पें', description: 'कल्पना और रचनात्मकता', materials: 4, videos: 3, tests: 1 },
          { id: 'ch5', title: 'अक्षरों का महत्व', description: 'शिक्षा का महत्व', materials: 8, videos: 6, tests: 3 }
        ],
        7: [
          { id: 'ch1', title: 'हम पंछी उन्मुक्त गगन के', description: 'स्वतंत्रता की भावना', materials: 8, videos: 5, tests: 3 },
          { id: 'ch2', title: 'दादी माँ', description: 'पारिवारिक रिश्ते और प्रेम', materials: 6, videos: 4, tests: 2 },
          { id: 'ch3', title: 'हिमालय की बेटियाँ', description: 'प्रकृति वर्णन और भूगोल', materials: 7, videos: 5, tests: 3 },
          { id: 'ch4', title: 'कठपुतली', description: 'लोक कला और संस्कृति', materials: 5, videos: 3, tests: 2 },
          { id: 'ch5', title: 'मिठाईवाला', description: 'सामाजिक संदेश और मानवीयता', materials: 9, videos: 6, tests: 4 }
        ],
        8: [
          { id: 'ch1', title: 'ध्वनि', description: 'कविता की लय और छंद', materials: 10, videos: 7, tests: 4 },
          { id: 'ch2', title: 'लाख की चूड़ियाँ', description: 'पारंपरिक कला और शिल्प', materials: 8, videos: 5, tests: 3 },
          { id: 'ch3', title: 'बस की यात्रा', description: 'यात्रा वृत्तांत और अनुभव', materials: 7, videos: 4, tests: 2 },
          { id: 'ch4', title: 'दीवानों की हस्ती', description: 'जोश और उत्साह की कविता', materials: 6, videos: 3, tests: 2 },
          { id: 'ch5', title: 'चिट्ठियों की अनूठी दुनिया', description: 'संचार का विकास', materials: 9, videos: 6, tests: 4 }
        ]
      },
      'sanskrit': {
        6: [
          { id: 'ch1', title: 'शब्द परिचय', description: 'संस्कृत शब्दों का परिचय', materials: 5, videos: 3, tests: 2 },
          { id: 'ch2', title: 'स्वर संधि', description: 'स्वर संधि के नियम', materials: 6, videos: 4, tests: 3 },
          { id: 'ch3', title: 'धातु रूप', description: 'क्रिया के रूप', materials: 8, videos: 5, tests: 4 },
          { id: 'ch4', title: 'सुभाषितानि', description: 'नीतिपरक श्लोक', materials: 4, videos: 2, tests: 1 },
          { id: 'ch5', title: 'श्लोक अध्ययन', description: 'श्लोकों का अध्ययन', materials: 7, videos: 4, tests: 3 }
        ],
        7: [
          { id: 'ch1', title: 'सुभाषितानि', description: 'नीति और आचार के श्लोक', materials: 7, videos: 4, tests: 3 },
          { id: 'ch2', title: 'दुर्बुद्धि विनश्यति', description: 'बुद्धि का महत्व', materials: 6, videos: 3, tests: 2 },
          { id: 'ch3', title: 'स्वावलम्बनम्', description: 'आत्मनिर्भरता का संदेश', materials: 8, videos: 5, tests: 4 },
          { id: 'ch4', title: 'हास्य बालकविसम्मेलनम्', description: 'हास्य कविता', materials: 5, videos: 3, tests: 2 },
          { id: 'ch5', title: 'पण्डिता रमाबाई', description: 'महान व्यक्तित्व', materials: 9, videos: 6, tests: 4 }
        ],
        8: [
          { id: 'ch1', title: 'सुभाषितानि', description: 'जीवन मूल्यों के श्लोक', materials: 9, videos: 6, tests: 4 },
          { id: 'ch2', title: 'बिलस्य वाणी न कदापि मे श्रुता', description: 'पशु-पक्षियों की कहानी', materials: 7, videos: 4, tests: 3 },
          { id: 'ch3', title: 'डिजिटल इण्डिया', description: 'आधुनिक भारत', materials: 8, videos: 5, tests: 3 },
          { id: 'ch4', title: 'सदैव पुरतो निधेहि चरणम्', description: 'प्रगति का संदेश', materials: 6, videos: 3, tests: 2 },
          { id: 'ch5', title: 'कण्टकेनैव कण्टकम्', description: 'समस्या और समाधान', materials: 10, videos: 7, tests: 5 }
        ]
      }
    };

    return chapterData[subject]?.[classNum] || [];
  };

  // Sample papers for Social Science Class 7
  const getSamplePapers = (subject: string, classNum: number): SamplePaper[] => {
    if (subject === 'social-science' && classNum === 7) {
      return [
        {
          id: 'sp1',
          title: 'Social Science Mock Test 1 - Geography Focus',
          type: 'Mock Test',
          duration: 90,
          marks: 80,
          difficulty: 'Medium',
          downloadUrl: 'https://www.learncbse.in/wp-content/uploads/2019/05/CBSE-Sample-Papers-Class-7-Social-Science.pdf'
        },
        {
          id: 'sp2',
          title: 'History and Civics Practice Paper',
          type: 'Practice Paper',
          duration: 120,
          marks: 100,
          difficulty: 'Hard',
          downloadUrl: 'https://www.studiestoday.com/sites/default/files/CBSE%20Class%207%20Social%20Science%20Sample%20Paper%20Set%20A.pdf'
        },
        {
          id: 'sp3',
          title: 'Mid-Term Assessment Paper',
          type: 'Previous Year',
          duration: 60,
          marks: 50,
          difficulty: 'Easy',
          downloadUrl: 'https://www.cbsesamplepapers.info/sites/default/files/CBSE-Sample-Papers-for-Class-7-Social-Science-SA1.pdf'
        },
        {
          id: 'sp4',
          title: 'Comprehensive Social Science Test',
          type: 'Mock Test',
          duration: 150,
          marks: 100,
          difficulty: 'Hard',
          downloadUrl: 'https://www.vedantu.com/cbse-sample-question-papers/cbse-class-7-social-science-sample-papers'
        },
        {
          id: 'sp5',
          title: 'Geography and Economics Focus Paper',
          type: 'Practice Paper',
          duration: 90,
          marks: 80,
          difficulty: 'Medium',
          downloadUrl: 'https://www.topperlearning.com/cbse-class-vii/social-science/sample-papers'
        },
        {
          id: 'sp6',
          title: 'Final Exam Preparation Test',
          type: 'Mock Test',
          duration: 180,
          marks: 100,
          difficulty: 'Hard',
          downloadUrl: 'https://www.meritnation.com/cbse-class-7/social-science/sample-papers'
        }
      ];
    }
    return [];
  };

  const chapters = getChaptersBySubject(selectedSubject, selectedClass);
  const samplePapers = getSamplePapers(selectedSubject, selectedClass);

  const handleChapterClick = (chapterId: string) => {
    if (expandedChapter === chapterId) {
      setExpandedChapter(null);
    } else {
      setExpandedChapter(chapterId);
      setSelectedChapter(chapterId);
      onChapterSelect(chapterId);
    }
  };

  const getSubjectDisplayName = (subject: string) => {
    const names: Record<string, string> = {
      'mathematics': 'Mathematics',
      'science': 'Science',
      'english': 'English',
      'social-science': 'Social Science',
      'hindi': 'Hindi',
      'sanskrit': 'Sanskrit'
    };
    return names[subject] || subject;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Mock Test': return 'bg-blue-100 text-blue-800';
      case 'Previous Year': return 'bg-purple-100 text-purple-800';
      case 'Practice Paper': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {getSubjectDisplayName(selectedSubject)} - Class {selectedClass}
              </h2>
              <p className="text-sm text-gray-600">Choose a chapter to start learning or access sample papers</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('chapters')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === 'chapters'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Chapters ({chapters.length})
          </button>
          {samplePapers.length > 0 && (
            <button
              onClick={() => setActiveTab('sample-papers')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'sample-papers'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sample Papers ({samplePapers.length})
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'chapters' && (
          <div className="space-y-3">
            {chapters.map((chapter, index) => (
              <div key={chapter.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Chapter Header */}
                <button
                  onClick={() => handleChapterClick(chapter.id)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedChapter === chapter.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        chapter.isCompleted 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{chapter.title}</h3>
                        <p className="text-sm text-gray-600">{chapter.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {expandedChapter === chapter.id ? (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Chapter Details */}
                {expandedChapter === chapter.id && (
                  <div className="px-4 pb-4 bg-gray-50">
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{chapter.materials}</div>
                        <div className="text-xs text-gray-500">Materials</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                          <Play className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{chapter.videos}</div>
                        <div className="text-xs text-gray-500">Videos</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                          <Users className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{chapter.tests}</div>
                        <div className="text-xs text-gray-500">Tests</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-3">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Start Learning
                      </button>
                      <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                        Take Test
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {chapters.length === 0 && (
              <div className="text-center py-8">
                <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chapters Coming Soon</h3>
                <p className="text-gray-500">We're preparing comprehensive chapters for this subject.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sample-papers' && (
          <div className="space-y-4">
            {samplePapers.length > 0 ? (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Sample Papers & Mock Tests</h3>
                  <p className="text-sm text-gray-600">Practice with these comprehensive test papers to prepare for your exams</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {samplePapers.map((paper) => (
                    <div key={paper.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">{paper.title}</h4>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getTypeColor(paper.type)}`}>
                              {paper.type}
                            </span>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(paper.difficulty)}`}>
                              {paper.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-600">Duration: {paper.duration} min</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-600">Marks: {paper.marks}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button 
                          onClick={() => window.open(paper.downloadUrl, '_blank')}
                          className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </button>
                        <button 
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = paper.downloadUrl;
                            link.download = `${paper.title}.pdf`;
                            link.click();
                          }}
                          className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Resources */}
                <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                  <h4 className="text-lg font-bold mb-2">📚 Exam Preparation Tips</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-semibold mb-2">Before the Test:</h5>
                      <ul className="space-y-1 text-blue-100">
                        <li>• Review all chapter summaries</li>
                        <li>• Practice previous year questions</li>
                        <li>• Create mind maps for key concepts</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">During the Test:</h5>
                      <ul className="space-y-1 text-blue-100">
                        <li>• Read questions carefully</li>
                        <li>• Manage your time effectively</li>
                        <li>• Start with easier questions first</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sample Papers Coming Soon</h3>
                <p className="text-gray-500">We're preparing comprehensive sample papers for this subject.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterNavigation;