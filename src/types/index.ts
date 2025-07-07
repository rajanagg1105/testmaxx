export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'student' | 'admin';
  class?: 6 | 7 | 8;
  createdAt: Date;
}

export interface Question {
  id: string;
  type: 'mcq' | 'fill-blank' | 'true-false' | 'assertion-reason';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Test {
  id: string;
  title: string;
  description: string;
  class: 6 | 7 | 8;
  subject: string;
  duration: number; // in minutes
  questions: Question[];
  totalMarks: number;
  createdAt: Date;
  isActive: boolean;
}

export interface TestAttempt {
  id: string;
  testId: string;
  userId: string;
  answers: Record<string, string | number>;
  score: number;
  totalMarks: number;
  timeSpent: number; // in seconds
  completedAt: Date;
  analysis: {
    topicPerformance: Record<string, { correct: number; total: number }>;
    suggestions: string[];
  };
}

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  class: 6 | 7 | 8;
  subject: string;
  fileUrl: string;
  fileName: string;
  uploadedAt: Date;
  summary?: string;
  flashcards?: Flashcard[];
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  topic: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'student' | 'admin';
  createdAt: Date;
  // Extended profile fields
  school?: string;
  grade?: string;
  city?: string;
  state?: string;
  phoneNumber?: string;
  parentName?: string;
  parentPhone?: string;
  dateOfBirth?: string;
  interests?: string[];
  bio?: string;
  achievements?: string[];
}