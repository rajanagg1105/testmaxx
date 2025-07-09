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
  // First get the test to log what's being deleted
  const testDoc = await getDoc(doc(db, 'tests', testId));
  if (testDoc.exists()) {
    const testData = testDoc.data();
    console.log(`Deleting test: ${testData.title} (${testData.subject} - Class ${testData.class})`);
  }
  
  // Delete the test document
  await deleteDoc(doc(db, 'tests', testId));
  
  // Also delete any related test attempts (optional - you might want to keep for analytics)
  // const attemptsQuery = query(collection(db, 'testAttempts'), where('testId', '==', testId));
  // const attemptsSnapshot = await getDocs(attemptsQuery);
  // const deletePromises = attemptsSnapshot.docs.map(doc => deleteDoc(doc.ref));
  // await Promise.all(deletePromises);
};

export const updateStudyMaterial = async (materialId: string, updates: Partial<StudyMaterial>) => {
  await updateDoc(doc(db, 'studyMaterials', materialId), updates);
};

export const deleteStudyMaterial = async (materialId: string) => {
  await deleteDoc(doc(db, 'studyMaterials', materialId));
};