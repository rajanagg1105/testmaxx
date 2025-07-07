import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

export const uploadFile = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};

export const deleteFile = async (path: string): Promise<void> => {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
};

export const uploadStudyMaterial = async (file: File, materialId: string): Promise<string> => {
  const path = `study-materials/${materialId}/${file.name}`;
  return await uploadFile(file, path);
};

export const uploadTestImage = async (file: File, testId: string, questionId: string): Promise<string> => {
  const path = `test-images/${testId}/${questionId}/${file.name}`;
  return await uploadFile(file, path);
};