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
import { db, auth } from '../lib/firebase';
import { Project, Service, Testimonial, SiteSettings, AboutMe, UserRoleDoc } from '../types';

// Tipagem para erros do Firestore conforme instruções
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error Detailed: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Generic fetcher
export const subscribeToCollection = <T,>(collectionName: string, callback: (data: T[]) => void) => {
  try {
    const q = query(collection(db, collectionName));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as T));
      const sorted = [...items].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
      callback(sorted);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, collectionName);
    });
  } catch (error) {
    console.error(`Falha crítica ao tentar subscrever coleção [${collectionName}]:`, error);
    callback([]);
    return () => {};
  }
};

// Site Settings
export const getSettings = async () => {
  const fetchWithTimeout = async (docRef: any) => {
    const fetchPromise = getDoc(docRef);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout carregando configurações')), 3000)
    );
    return Promise.race([fetchPromise, timeoutPromise]) as Promise<any>;
  };

  try {
    const [global, sobre] = await Promise.all([
      fetchWithTimeout(doc(db, 'settings', 'global')),
      fetchWithTimeout(doc(db, 'settings', 'sobre'))
    ]);

    return {
      global: global.exists() ? global.data() as SiteSettings : null,
      sobre: sobre.exists() ? sobre.data() as AboutMe : null
    };
  } catch (error) {
    console.warn("Falha ao carregar configurações (usando padrões):", error);
    return { global: null, sobre: null };
  }
};

export const updateSettings = (key: 'global' | 'sobre', data: any) => {
  return setDoc(doc(db, 'settings', key), data, { merge: true });
};

// Helper para limpar propriedades undefined e valores não serializáveis (que o Firestore não aceita)
const cleanData = (data: any): any => {
  if (data === null || data === undefined) return null;
  
  if (Array.isArray(data)) {
    return data.map(item => cleanData(item));
  }

  if (typeof data === 'object') {
    // Se for um objeto que não é literal, tentamos converter se tiver método toJSON ou similar, 
    // mas aqui focamos em objetos planos do ReactFlow/App
    const result: any = {};
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value !== undefined && typeof value !== 'function') {
        result[key] = cleanData(value);
      }
    });
    return result;
  }

  return data;
};

// Projects CRUD
export const subscribeToProjects = (callback: (data: Project[]) => void) => {
  return subscribeToCollection<Project>('projects', callback);
};

export const addProject = async (data: Omit<Project, 'id'>) => {
  const cleaned = cleanData(data);
  try {
    console.log("Firestore: addProject", cleaned);
    return await addDoc(collection(db, 'projects'), cleaned);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'projects');
  }
};

export const updateProject = async (id: string, data: Partial<Project>) => {
  if (!id) {
    console.error("Firestore Error: Tentativa de update sem ID");
    return Promise.reject(new Error("ID do projeto é obrigatório para atualização"));
  }
  const { id: _, ...rest } = data as any;
  const cleaned = cleanData(rest);
  try {
    console.log(`Firestore: updateProject [${id}]`, cleaned);
    return await updateDoc(doc(db, 'projects', id), cleaned);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `projects/${id}`);
  }
};

export const deleteProject = async (id: string) => {
  try {
    console.log(`Firestore: deleteProject [${id}]`);
    return await deleteDoc(doc(db, 'projects', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
  }
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
