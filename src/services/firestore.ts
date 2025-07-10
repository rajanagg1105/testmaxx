import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Test, TestAttempt, StudyMaterial, User } from '../types';

// User services
export const createUser = async (userData: Omit<User, 'createdAt'>) => {
  const user = {
    ...userData,
    createdAt: Timestamp.now()
  };
  await addDoc(collection(db, 'users'), user);
};

export const getUserById = async (userId: string) => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.exists() ? userDoc.data() as User : null;
};

// Test services
export const createTest = async (testData: Omit<Test, 'id' | 'createdAt'>) => {
  console.log('Creating test with data:', testData);
  
  const test = {
    ...testData,
    createdAt: new Date()
  };
  
  try {
    const docRef = await addDoc(collection(db, 'tests'), test);
    console.log('Test created successfully with ID:', docRef.id);
    return docRef;
  } catch (error) {
    console.error('Error creating test in Firestore:', error);
    throw error;
  }
};

export const getTestsByClass = async (classNumber: number) => {
  const q = query(
    collection(db, 'tests'),
    where('class', '==', classNumber),
    where('isActive', '==', true),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Test));
};

export const getAllTests = async () => {
  const q = query(collection(db, 'tests'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Test));
};

export const getActiveTestsForStudents = async () => {
  const q = query(
    collection(db, 'tests'),
    where('isActive', '==', true),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Test));
};

// Test attempt services
export const createTestAttempt = async (attemptData: Omit<TestAttempt, 'id' | 'completedAt'>) => {
  const attempt = {
    ...attemptData,
    completedAt: Timestamp.now()
  };
  return await addDoc(collection(db, 'testAttempts'), attempt);
};

export const getTestAttemptsByUser = async (userId: string) => {
  const q = query(
    collection(db, 'testAttempts'),
    where('userId', '==', userId),
    orderBy('completedAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TestAttempt));
};

// Study material services
export const createStudyMaterial = async (materialData: Omit<StudyMaterial, 'id' | 'uploadedAt'>) => {
  const material = {
    ...materialData,
    uploadedAt: new Date()
  };
  return await addDoc(collection(db, 'studyMaterials'), material);
};

export const getStudyMaterialsByClass = async (classNumber: number) => {
  const q = query(
    collection(db, 'studyMaterials'),
    where('class', '==', classNumber),
    orderBy('uploadedAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudyMaterial));
};

export const getAllStudyMaterials = async () => {
  const q = query(collection(db, 'studyMaterials'), orderBy('uploadedAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudyMaterial));
};

// Update and delete functions
export const updateTest = async (testId: string, updates: Partial<Test>) => {
  await updateDoc(doc(db, 'tests', testId), updates);
};

export const deleteTest = async (testId: string) => {
  try {
    // First get the test to log what's being deleted
    const testDoc = await getDoc(doc(db, 'tests', testId));
    if (testDoc.exists()) {
      const testData = testDoc.data();
      console.log(`Deleting test: ${testData.title} (${testData.subject} - Class ${testData.class})`);
    }
    
    // Delete the test document
    await deleteDoc(doc(db, 'tests', testId));
    console.log(`Test ${testId} deleted successfully`);
    
    // Also delete any related test attempts to maintain data consistency
    const attemptsQuery = query(collection(db, 'testAttempts'), where('testId', '==', testId));
    const attemptsSnapshot = await getDocs(attemptsQuery);
    
    if (!attemptsSnapshot.empty) {
      const deletePromises = attemptsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      console.log(`Deleted ${attemptsSnapshot.size} test attempts for test ${testId}`);
    }
  } catch (error) {
    console.error('Error deleting test:', error);
    throw error;
  }
};

// Get all students (users with role 'student')
export const getAllStudents = async () => {
  const q = query(
    collection(db, 'users'),
    where('role', '==', 'student'),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
};

// Get student statistics
export const getStudentStats = async (studentId: string) => {
  try {
    // Get test attempts for this student
    const attemptsQuery = query(
      collection(db, 'testAttempts'),
      where('userId', '==', studentId),
      orderBy('completedAt', 'desc')
    );
    const attemptsSnapshot = await getDocs(attemptsQuery);
    const attempts = attemptsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TestAttempt));
    
    // Calculate statistics
    const testsCompleted = attempts.length;
    const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
    const totalMarks = attempts.reduce((sum, attempt) => sum + attempt.totalMarks, 0);
    const averageScore = totalMarks > 0 ? Math.round((totalScore / totalMarks) * 100) : 0;
    const totalStudyTime = attempts.reduce((sum, attempt) => sum + (attempt.timeSpent || 0), 0);
    
    // Get last active date
    const lastActive = attempts.length > 0 ? attempts[0].completedAt : null;
    
    return {
      testsCompleted,
      averageScore,
      totalStudyTime: Math.round(totalStudyTime / 60), // Convert to minutes
      lastActive: lastActive ? new Date(lastActive).toISOString().split('T')[0] : null,
      status: lastActive && new Date(lastActive) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) ? 'active' : 'inactive'
    };
  } catch (error) {
    console.error('Error getting student stats:', error);
    return {
      testsCompleted: 0,
      averageScore: 0,
      totalStudyTime: 0,
      lastActive: null,
      status: 'inactive' as const
    };
  }
};

export const updateStudyMaterial = async (materialId: string, updates: Partial<StudyMaterial>) => {
  await updateDoc(doc(db, 'studyMaterials', materialId), updates);
};

export const deleteStudyMaterial = async (materialId: string) => {
  await deleteDoc(doc(db, 'studyMaterials', materialId));
};