import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Project, Service, Testimonial, SiteSettings, AboutMe, UserRoleDoc } from '../types';

// Generic fetcher
export const subscribeToCollection = <T,>(collectionName: string, callback: (data: T[]) => void) => {
  const q = query(collection(db, collectionName));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    // Sort locally as fallback or define complex queries if needed
    const sorted = [...items].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    callback(sorted);
  });
};

// Site Settings
export const getSettings = async () => {
  const global = await getDoc(doc(db, 'settings', 'global'));
  const sobre = await getDoc(doc(db, 'about', 'sobre_mim'));
  return {
    global: global.exists() ? global.data() as SiteSettings : null,
    sobre: sobre.exists() ? sobre.data() as AboutMe : null
  };
};

export const updateSettings = (key: 'global' | 'sobre', data: any) => {
  return setDoc(doc(db, 'settings', key), data, { merge: true });
};

// Projects CRUD
export const addProject = (data: Omit<Project, 'id'>) => {
  return addDoc(collection(db, 'projects'), data);
};

export const updateProject = (id: string, data: Partial<Project>) => {
  return updateDoc(doc(db, 'projects', id), data);
};

export const deleteProject = (id: string) => {
  return deleteDoc(doc(db, 'projects', id));
};

// Services CRUD
export const updateService = (id: string, data: Partial<Service>) => {
  return setDoc(doc(db, 'services', id), data, { merge: true });
};

export const deleteService = (id: string) => {
  return deleteDoc(doc(db, 'services', id));
};

// Testimonials CRUD
export const addTestimonial = (data: Omit<Testimonial, 'id'>) => {
  return addDoc(collection(db, 'testimonials'), { ...data, order: Date.now() });
};

export const updateTestimonial = (id: string, data: Partial<Testimonial>) => {
  return updateDoc(doc(db, 'testimonials', id), data);
};

export const deleteTestimonial = (id: string) => {
  return deleteDoc(doc(db, 'testimonials', id));
};

// Users ACL
export const setUserRole = (email: string, role: string, assignedBy: string) => {
  return setDoc(doc(db, 'users_roles', email), { email, role, assignedBy });
};
