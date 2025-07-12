import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Upload, 
  Trash2, 
  Eye, 
  Download,
  Search,
  Filter,
  BookOpen,
  FileText,
  Calendar,
  Users,
  Star,
  MoreVertical,
  X,
  Save,
  File,
  Image,
  AlertCircle
} from 'lucide-react';
import { StudyMaterial } from '../../types';
import { getAllStudyMaterials, deleteStudyMaterial, createStudyMaterial } from '../../services/firestore';
import { uploadStudyMaterial } from '../../services/storage';

const MaterialManager: React.FC = () => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<number | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    class: 6 as 6 | 7 | 8,
    subject: '',
    file: null as File | null
  });

  const subjects = ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi', 'Sanskrit'];
  const classes = [6, 7, 8];

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const materialsData = await getAllStudyMaterials();
      setMaterials(materialsData);
    } catch (error) {
      console.error('Error loading materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (window.confirm('Are you sure you want to delete this study material? This action cannot be undone.')) {
      try {
        await deleteStudyMaterial(materialId);
        setMaterials(materials.filter(material => material.id !== materialId));
        alert('Study material deleted successfully!');
      } catch (error) {
        console.error('Error deleting material:', error);
        alert('Failed to delete study material. Please try again.');
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid file type (PDF, JPG, PNG, GIF, DOC, DOCX, TXT)');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      setUploadForm({ ...uploadForm, file });
    }
  };

  const handleUploadMaterial = async () => {
    if (!uploadForm.title || !uploadForm.subject || !uploadForm.file) {
      alert('Please fill in all required fields and select a file.');
      return;
    }

    try {
      setUploading(true);
      
      // Generate a unique material ID
      const materialId = `material_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Upload file to Firebase Storage
      const fileUrl = await uploadStudyMaterial(uploadForm.file, materialId);
      
      // Create material document in Firestore
      const materialData = {
        title: uploadForm.title,
        description: uploadForm.description,
        class: uploadForm.class,
        subject: uploadForm.subject,
        fileUrl: fileUrl,
        fileName: uploadForm.file.name
      };
      
      await createStudyMaterial(materialData);
      
      // Reset form and reload materials
      setUploadForm({
        title: '',
        description: '',
        class: 6,
        subject: '',
        file: null
      });
      
      setShowUploader(false);
      await loadMaterials();
      alert('Study material uploaded successfully!');
    } catch (error) {
      console.error('Error uploading material:', error);
      alert('Failed to upload study material. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || material.class === selectedClass;
    const matchesSubject = selectedSubject === 'all' || material.subject === selectedSubject;
    return matchesSearch && matchesClass && matchesSubject;
  });

  const getMaterialStats = () => {
    return {
      total: materials.length,
      byClass: {
        6: materials.filter(m => m.class === 6).length,
        7: materials.filter(m => m.class === 7).length,
        8: materials.filter(m => m.class === 8).length
      },
      bySubject: subjects.reduce((acc, subject) => {
        acc[subject] = materials.filter(m => m.subject === subject).length;
        return acc;
      }, {} as Record<string, number>)
    };
  };

  const stats = getMaterialStats();

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <File className="h-6 w-6 text-red-600" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="h-6 w-6 text-green-600" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-6 w-6 text-blue-600" />;
      default:
        return <FileText className="h-6 w-6 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Study Materials Management</h1>
            <p className="text-gray-600">Upload and manage study materials for your students</p>
          </div>
          <button
            onClick={() => setShowUploader(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
          >
            <Upload className="h-5 w-5" />
            <span>Upload Material</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Materials</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Class 6</p>
              <p className="text-2xl font-bold text-gray-900">{stats.byClass[6]}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Class 7</p>
              <p className="text-2xl font-bold text-gray-900">{stats.byClass[7]}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Class 8</p>
              <p className="text-2xl font-bold text-gray-900">{stats.byClass[8]}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
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
                <option key={subject} value={subject}>{subject}</option>
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
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading materials...</p>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
            <p className="text-gray-500 mb-4">
              {materials.length === 0 
                ? "You haven't uploaded any study materials yet. Upload your first material to get started!"
                : "No materials match your current filters. Try adjusting your search criteria."
              }
            </p>
            {materials.length === 0 && (
              <button
                onClick={() => setShowUploader(true)}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Upload Your First Material
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredMaterials.map((material) => (
              <div key={material.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(material.fileName)}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{material.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{material.description}</p>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          Class {material.class}
                        </span>
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                          {material.subject}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(showDropdown === material.id ? null : material.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {showDropdown === material.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setShowDropdown(null)}
                        ></div>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                window.open(material.fileUrl, '_blank');
                                setShowDropdown(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              View Material
                            </button>
                            <button
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = material.fileUrl;
                                link.download = material.fileName;
                                link.click();
                                setShowDropdown(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Download
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteMaterial(material.id);
                                setShowDropdown(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              Delete Material
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Uploaded: {new Date(material.uploadedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                  <span className="font-medium">{material.fileName}</span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => window.open(material.fileUrl, '_blank')}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = material.fileUrl;
                      link.download = material.fileName;
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
        )}
      </div>

      {/* Upload Modal */}
      {showUploader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Upload Study Material</h2>
                <button
                  onClick={() => setShowUploader(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select File * <span className="text-xs text-gray-500">(PDF, JPG, PNG, GIF, DOC, DOCX, TXT - Max 10MB)</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {uploadForm.file ? (
                      <div className="flex items-center justify-center space-x-2">
                        {getFileIcon(uploadForm.file.name)}
                        <div>
                          <p className="text-gray-900 font-medium">{uploadForm.file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(uploadForm.file.size)}</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Click to upload file</p>
                        <p className="text-xs text-gray-500 mt-1">Supported: PDF, Images, Documents</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Material Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Material Title *</label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter material title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class *</label>
                  <select
                    value={uploadForm.class}
                    onChange={(e) => setUploadForm({ ...uploadForm, class: Number(e.target.value) as 6 | 7 | 8 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={6}>Class 6</option>
                    <option value={7}>Class 7</option>
                    <option value={8}>Class 8</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <select
                    value={uploadForm.subject}
                    onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter material description"
                />
              </div>

              {/* Upload Button */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUploader(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadMaterial}
                  disabled={uploading || !uploadForm.title || !uploadForm.subject || !uploadForm.file}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{uploading ? 'Uploading...' : 'Upload Material'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialManager;