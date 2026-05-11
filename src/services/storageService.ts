import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject,
  listAll,
  getMetadata
} from 'firebase/storage';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  orderBy, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { storage, db } from '../lib/firebase';
import { MediaLibraryItem } from '../types';

export const uploadMedia = (
  file: File, 
  projectId: string,
  onProgress: (progress: number) => void
): Promise<MediaLibraryItem> => {
  return new Promise((resolve, reject) => {
    // Timeout de 2 minutos para evitar promessas penduradas
    const timeout = setTimeout(() => {
      reject(new Error("Timeout: O upload demorou mais que o esperado."));
    }, 120000);

    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `media/${projectId}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      },
      (error) => {
        clearTimeout(timeout);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          let category: MediaLibraryItem['category'] = 'other';
          if (file.type.startsWith('image/')) category = 'image';
          else if (file.type.startsWith('video/')) category = 'video';
          else if (file.type.startsWith('audio/')) category = 'audio';

          const mediaItem: Omit<MediaLibraryItem, 'id'> = {
            name: file.name,
            url: downloadURL,
            type: file.type,
            size: file.size,
            category,
            projectId,
            createdAt: Date.now()
          };

          const docRef = await addDoc(collection(db, 'media_library'), mediaItem);
          clearTimeout(timeout);
          resolve({ id: docRef.id, ...mediaItem });
        } catch (err) {
          clearTimeout(timeout);
          reject(err);
        }
      }
    );
  });
};

export const getMediaLibrary = async (projectId?: string): Promise<MediaLibraryItem[]> => {
  let q;
  if (projectId) {
    q = query(
      collection(db, 'media_library'), 
      where('projectId', '==', projectId),
      orderBy('createdAt', 'desc')
    );
  } else {
    q = query(collection(db, 'media_library'), orderBy('createdAt', 'desc'));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as object) } as MediaLibraryItem));
};

export const syncStorageWithFirestore = async (path: string = 'media') => {
  const storageRef = ref(storage, path);
  const res = await listAll(storageRef);
  
  // Pegamos o que já existe no Firestore para não duplicar
  const existingDocs = await getMediaLibrary();
  const existingUrls = new Set(existingDocs.map(d => d.url));

  const itemsAdded: MediaLibraryItem[] = [];

  for (const itemRef of res.items) {
    const url = await getDownloadURL(itemRef);
    
    if (!existingUrls.has(url)) {
      const metadata = await getMetadata(itemRef);
      
      let category: MediaLibraryItem['category'] = 'other';
      if (metadata.contentType?.startsWith('image/')) category = 'image';
      else if (metadata.contentType?.startsWith('video/')) category = 'video';
      else if (metadata.contentType?.startsWith('audio/')) category = 'audio';

      const newItem: Omit<MediaLibraryItem, 'id'> = {
        name: itemRef.name,
        url: url,
        type: metadata.contentType || 'unknown',
        size: metadata.size,
        category,
        createdAt: new Date(metadata.timeCreated).getTime()
      };

      const docRef = await addDoc(collection(db, 'media_library'), newItem);
      itemsAdded.push({ id: docRef.id, ...(newItem as object) } as MediaLibraryItem);
    }
  }

  // Se houver subpastas, sincroniza elas também (recursivo simples)
  for (const folderRef of res.prefixes) {
    await syncStorageWithFirestore(folderRef.fullPath);
  }

  return itemsAdded;
};

export const deleteMedia = async (item: MediaLibraryItem) => {
  // Extrair o nome do arquivo da URL (Firebase Storage format)
  // Ou simplesmente guardar o path se for complexo, mas por simplicidade vamos tentar deletar o doc primeiro
  // Para deletar do storage com segurança, precisaríamos do path original. 
  // Por enquanto vamos deletar do Firestore e o storage fica como backup manual se necessário,
  // ou podemos tentar extrair o nome do arquivo da URL.
  
  try {
    await deleteDoc(doc(db, 'media_library', item.id));
    // Omitindo deleteObject do storage por enquanto para evitar erros de path se a URL for alterada
    // Mas o ideal é deletar ambos.
  } catch (error) {
    console.error("Erro ao deletar mídia:", error);
    throw error;
  }
};
