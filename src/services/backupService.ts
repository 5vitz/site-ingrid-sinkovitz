import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  serverTimestamp, 
  writeBatch, 
  query, 
  orderBy,
  Timestamp,
  deleteDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Project, Testimonial, SiteSettings, AboutMe, Service } from '../types';

export interface BackupData {
  projects: Project[];
  testimonials: Testimonial[];
  services: Service[];
  aboutMe: AboutMe | null;
  globalSettings: SiteSettings | null;
}

export interface Backup {
  id: string;
  name: string;
  createdAt: Timestamp;
  authorEmail: string;
  data: BackupData;
}

export const createBackup = async (name: string) => {
  if (!auth.currentUser) throw new Error("Usuário não autenticado");

  // 1. Coletar dados atuais
  const projectsSnap = await getDocs(collection(db, 'projects'));
  const testimonialsSnap = await getDocs(collection(db, 'testimonials'));
  const servicesSnap = await getDocs(collection(db, 'services'));
  const aboutMeSnap = await getDoc(doc(db, 'settings', 'sobre'));
  const globalSnap = await getDoc(doc(db, 'settings', 'global'));

  const data: BackupData = {
    projects: projectsSnap.docs.map(d => d.data() as Project),
    testimonials: testimonialsSnap.docs.map(d => d.data() as Testimonial),
    services: servicesSnap.docs.map(d => d.data() as Service),
    aboutMe: aboutMeSnap.exists() ? aboutMeSnap.data() as AboutMe : null,
    globalSettings: globalSnap.exists() ? globalSnap.data() as SiteSettings : null
  };

  // 2. Salvar snapshot
  const backupRef = await addDoc(collection(db, 'backups'), {
    name,
    createdAt: serverTimestamp(),
    authorEmail: auth.currentUser.email,
    data
  });

  return backupRef.id;
};

export const getBackups = async (): Promise<Backup[]> => {
  const q = query(collection(db, 'backups'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Backup));
};

export const restoreBackup = async (backup: Backup, onProgress?: (msg: string) => void) => {
  const { data } = backup;
  const batch = writeBatch(db);

  // Limpeza de coleções pode ser custosa, mas para restaurar um estado, 
  // idealmente sobrescrevemos ou limpamos antes.
  // Como são poucas coleções, vamos usar lógica de sobrescrita.

  onProgress?.('Restaurando Projetos...');
  data.projects.forEach(p => {
    batch.set(doc(db, 'projects', p.id), p);
  });

  onProgress?.('Restaurando Depoimentos...');
  data.testimonials.forEach(t => {
    batch.set(doc(db, 'testimonials', t.id), t);
  });

  onProgress?.('Restaurando Serviços...');
  data.services.forEach(s => {
    batch.set(doc(db, 'services', s.id), s);
  });

  onProgress?.('Restaurando Configurações...');
  if (data.aboutMe) {
    batch.set(doc(db, 'settings', 'sobre'), data.aboutMe);
  }
  if (data.globalSettings) {
    batch.set(doc(db, 'settings', 'global'), data.globalSettings);
  }

  await batch.commit();
  onProgress?.('Restauração concluída!');
};

export const deleteBackup = async (id: string) => {
  await deleteDoc(doc(db, 'backups', id));
};

export const exportToJson = (data: BackupData) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().split('T')[0];
  a.href = url;
  a.download = `backup_ingrid_portolio_${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const validateBackupFile = (json: any): json is BackupData => {
  // Verificação básica de estrutura para evitar importar lixo
  return (
    json &&
    Array.isArray(json.projects) &&
    Array.isArray(json.testimonials) &&
    typeof json.aboutMe === 'object'
  );
};
