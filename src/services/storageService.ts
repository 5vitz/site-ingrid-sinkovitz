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
  updateDoc,
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
  try {
    const mediaRef = collection(db, 'media_library');
    const snapshot = await getDocs(mediaRef);
    let items = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as object) } as MediaLibraryItem));

    // Log para diagnóstico (visível no console do navegador)
    console.log(`[STORAGE] Buscando mídias. Filtro Projeto ID: ${projectId || 'GERAL'}`);
    console.log(`[STORAGE] Total de mídias no banco: ${items.length}`);

    if (projectId && projectId !== 'new') {
      // FILTRO ESTRITO: 
      // Mostra apenas itens que coincidem com o ID do projeto 
      // OU itens que não tem projeto nenhum (opcional, para transição)
      const projectItems = items.filter(item => item.projectId === projectId);
      const legacyItems = items.filter(item => !item.projectId || item.projectId === 'undefined' || item.projectId === 'null');
      
      console.log(`[STORAGE] Mídias deste projeto: ${projectItems.length}`);
      console.log(`[STORAGE] Mídias legadas/sem dono: ${legacyItems.length}`);
      
      // Por enquanto, vamos retornar ambos mas priorizar os do projeto no topo
      return [...projectItems, ...legacyItems].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    return items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch (error) {
    console.error("Erro ao buscar biblioteca:", error);
    return [];
  }
};

/**
 * Repara links quebrados nos projetos após uma migração de Storage.
 * Procura por mídias na biblioteca que tenham o mesmo nome de arquivo que o link atual do projeto
 * e atualiza o projeto com a nova URL (e novo token).
 */
export const repairProjectLinks = async (onProgress?: (msg: string) => void) => {
  if (onProgress) onProgress("🛠️ Iniciando reparo de links nos projetos...");
  
  try {
    const projectsSnapshot = await getDocs(collection(db, 'projects'));
    const mediaLibrary = await getMediaLibrary();
    
    // Mapeamos a biblioteca por [projetoId][nomeArquivo] para busca rápida
    // Se houver nomes iguais (ex: 01.jpg), guardamos todos os candidatos com seus paths
    const mediaMap: Record<string, Record<string, Array<{url: string, path: string}>>> = {};
    mediaLibrary.forEach(item => {
      const pid = item.projectId || 'global';
      if (!mediaMap[pid]) mediaMap[pid] = {};
      if (!mediaMap[pid][item.name]) mediaMap[pid][item.name] = [];
      mediaMap[pid][item.name].push({ url: item.url, path: item.fullPath || '' });
    });

    let fixedCount = 0;

    for (const projectDoc of projectsSnapshot.docs) {
      const project = projectDoc.data();
      const projectId = projectDoc.id;
      let hasChanges = false;
      const updatedProject = { ...project };

      if (onProgress) onProgress(`🧐 Analisando projeto: ${project.title || projectId}`);

      // Campos que contêm URLs de mídia
      const fieldsToFix = ['backgroundImage', 'logoUrl', 'galleryThumbnail', 'audioUrl', 'coverImage'];
      
      const fixUrl = (url: string, pId: string) => {
        if (!url || typeof url !== 'string' || !url.includes('firebasestorage')) return url;
        try {
          const decodedUrl = decodeURIComponent(url);
          // O caminho original pode ser algo como "projeto6/Pasta/foto.jpg"
          const urlParts = decodedUrl.split('/').pop()?.split('?')[0]?.split('%2F') || [];
          const fileName = urlParts.pop();
          
          if (fileName) {
            const candidates = [...(mediaMap[pId]?.[fileName] || []), ...(mediaMap['global']?.[fileName] || [])];
            
            if (candidates.length === 1) {
              return candidates[0].url; // Único candidato, fácil.
            } else if (candidates.length > 1) {
              // Conflito de nomes (ex: vários 01.jpg). 
              // Tentamos encontrar o que mais se assemelha ao caminho original.
              const originalPath = decodedUrl.toLowerCase();
              let bestCandidate = candidates[0];
              let bestScore = -1;

              candidates.forEach(c => {
                let score = 0;
                const newPath = c.path.toLowerCase();
                // Verifica se partes das pastas coincidem
                urlParts.forEach(part => {
                  if (part && newPath.includes(part.toLowerCase())) score += 10;
                });
                // Se o nome da pasta pai for igual, bônus alto
                const folderName = newPath.split('/').slice(-2, -1)[0];
                if (folderName && originalPath.includes(folderName.toLowerCase())) score += 20;

                if (score > bestScore) {
                  bestScore = score;
                  bestCandidate = c;
                }
              });
              return bestCandidate.url;
            }
          }
        } catch (e) {
          console.error(`Erro ao processar URL`, e);
        }
        return url;
      };

      fieldsToFix.forEach(field => {
        const currentUrl = project[field];
        const fixed = fixUrl(currentUrl, projectId);
        if (fixed !== currentUrl) {
          updatedProject[field] = fixed;
          hasChanges = true;
          if (onProgress) onProgress(`✅ Corregido campo "${field}"`);
        }
      });

      // Suporte para mediaItems (projetos antigos ou estrutura vertical legada)
      if (project.mediaItems && Array.isArray(project.mediaItems)) {
        project.mediaItems.forEach((item: any, idx: number) => {
          // Fix URL principal do item
          if (item.url) {
            const fixed = fixUrl(item.url, projectId);
            if (fixed !== item.url) {
              item.url = fixed;
              hasChanges = true;
            }
          }
          // Fix Thumbnail
          if (item.thumbnail) {
            const fixed = fixUrl(item.thumbnail, projectId);
            if (fixed !== item.thumbnail) {
              item.thumbnail = fixed;
              hasChanges = true;
            }
          }
          // Fix array de imagens (Carrosséis)
          if (item.images && Array.isArray(item.images)) {
            const newImages = item.images.map((img: string) => fixUrl(img, projectId));
            if (JSON.stringify(newImages) !== JSON.stringify(item.images)) {
              item.images = newImages;
              hasChanges = true;
              if (onProgress) onProgress(`✅ Corregido carrossel em mediaItems[${idx}]`);
            }
          }
        });
      }

      // Também precisamos verificar o feed (stories e carrosséis 2D)
      if (project.feed && Array.isArray(project.feed)) {
        project.feed.forEach((item: any, idx: number) => {
          if (item.media) {
            // Fix URL principal
            if (item.media.url) {
              const fixed = fixUrl(item.media.url, projectId);
              if (fixed !== item.media.url) {
                item.media.url = fixed;
                hasChanges = true;
              }
            }
            // Fix Thumbnail
            if (item.media.thumbnail) {
              const fixed = fixUrl(item.media.thumbnail, projectId);
              if (fixed !== item.media.thumbnail) {
                item.media.thumbnail = fixed;
                hasChanges = true;
              }
            }
            // Fix array de imagens (Carrosséis no Feed)
            if (item.media.images && Array.isArray(item.media.images)) {
              const newImages = item.media.images.map((img: string) => fixUrl(img, projectId));
              if (JSON.stringify(newImages) !== JSON.stringify(item.media.images)) {
                item.media.images = newImages;
                hasChanges = true;
                if (onProgress) onProgress(`✅ Corregido carrossel no feed item ${idx + 1}`);
              }
            }
          }

          if (item.stories && Array.isArray(item.stories)) {
            item.stories.forEach((story: any, sIdx: number) => {
               // Fix story URL (IMPORTANTE: story já é o MediaItem)
               if (story.url) {
                 const fixed = fixUrl(story.url, projectId);
                 if (fixed !== story.url) {
                   story.url = fixed;
                   hasChanges = true;
                 }
               }
               // Fix story images array (Carrossel dentro da story)
               if (story.images && Array.isArray(story.images)) {
                 const newImages = story.images.map((img: string) => fixUrl(img, projectId));
                 if (JSON.stringify(newImages) !== JSON.stringify(story.images)) {
                   story.images = newImages;
                   hasChanges = true;
                 }
               }
               // Fix story thumbnail
               if (story.thumbnail) {
                 const fixed = fixUrl(story.thumbnail, projectId);
                 if (fixed !== story.thumbnail) {
                   story.thumbnail = fixed;
                   hasChanges = true;
                 }
               }
            });
          }
        });
      }

      if (hasChanges) {
        await updateDoc(projectDoc.ref, updatedProject);
        fixedCount++;
      }
    }

    if (onProgress) onProgress(`🎉 Reparo concluído! ${fixedCount} projetos foram atualizados.`);
    return fixedCount;
  } catch (error) {
    if (onProgress) onProgress(`❌ Erro no reparo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    return 0;
  }
};

export const syncStorageWithFirestore = async (
  path: string = 'media', 
  currentProjectId?: string, 
  cachedUrls?: Set<string>,
  onProgress?: (msg: string) => void,
  allFoundUrls?: Set<string>
) => {
  const isRoot = path === 'media';
  if (onProgress) onProgress(`🔎 Varrendo: "${path}"`);
  
  // No root, iniciamos o conjunto de URLs encontradas para limpeza de órfãos
  const validUrls = allFoundUrls || new Set<string>();

  try {
    const storageRef = ref(storage, path);
    // Tenta listar, mas com tratamento de erro específico para pastas vazias/inexistentes
    let res;
    try {
      res = await listAll(storageRef);
    } catch (e) {
      if (onProgress) onProgress(`⚠️ Pasta não acessível ou vazia: ${path}`);
      return [];
    }
    
    // Identificação do Projeto
    const pathParts = path.split('/').filter(p => p !== '');
    let projectId: string | undefined = currentProjectId;
    
    // Lógica robusta: se o path for 'media/xyz' ou 'Projetos/xyz'
    if (!projectId && pathParts.length >= 2 && (pathParts[0] === 'media' || pathParts[0] === 'Projetos')) {
      projectId = pathParts[1];
      // Tratamento especial para o erro comum do usuário (Audar vs Auddar)
      if (projectId === 'projeto-audar') {
        projectId = 'projeto-auddar';
        if (onProgress) onProgress(`💡 Notei "projeto-audar", corrigindo para "projeto-auddar"...`);
      }
      
      // Mapeamento extra para nomes de pastas numéricas (ex: projeto4 -> projeto-lion-jump)
      if (projectId === 'projeto4') projectId = 'projeto-lion-jump';
      if (projectId === 'projeto1') projectId = 'projeto-metavix';
      if (projectId === 'projeto2') projectId = 'projeto-elobike';
      if (projectId === 'projeto3') projectId = 'projeto-good-storage';
    }

    // Cache inicial
    let existingUrls = cachedUrls;
    if (!existingUrls) {
      if (onProgress) onProgress(`📊 Sincronizando com o banco de dados...`);
      const allDocs = await getMediaLibrary();
      existingUrls = new Set(allDocs.map(d => d.url));
    }

    const itemsAdded: MediaLibraryItem[] = [];

    // Processa arquivos
    for (const itemRef of res.items) {
      try {
        const url = await getDownloadURL(itemRef);
        validUrls.add(url); // Marca como URL válida existente no Storage
        
        if (!existingUrls.has(url)) {
          if (onProgress) onProgress(`✨ Novo arquivo: ${itemRef.name}`);
          const metadata = await getMetadata(itemRef);
          
          let category: MediaLibraryItem['category'] = 'other';
          const contentType = metadata.contentType || '';
          if (contentType.startsWith('image/')) category = 'image';
          else if (contentType.startsWith('video/')) category = 'video';
          else if (contentType.startsWith('audio/')) category = 'audio';

          const newItem: Omit<MediaLibraryItem, 'id'> = {
            name: itemRef.name,
            url: url,
            type: contentType || 'unknown',
            size: metadata.size,
            category,
            projectId: projectId || null,
            fullPath: itemRef.fullPath,
            createdAt: new Date(metadata.timeCreated).getTime()
          };

          const docRef = await addDoc(collection(db, 'media_library'), newItem);
          itemsAdded.push({ id: docRef.id, ...(newItem as object) } as MediaLibraryItem);
          existingUrls.add(url); 
        } else {
          // Se já existe mas não temos o fullPath no banco (caso de migração parcial), atualizamos agora
          const existingItem = (await getMediaLibrary()).find(i => i.url === url);
          if (existingItem && !existingItem.fullPath) {
            await updateDoc(doc(db, 'media_library', existingItem.id), {
              fullPath: itemRef.fullPath
            });
            if (onProgress) onProgress(`📝 Atualizado metadados de: ${itemRef.name}`);
          }
        }
      } catch (err) {
        console.error(`[SYNC] Erro no item ${itemRef.name}:`, err);
      }
    }

    // Recursividade: Entra nas subpastas
    for (const folderRef of res.prefixes) {
      const subItems = await syncStorageWithFirestore(folderRef.fullPath, projectId, existingUrls, onProgress, validUrls);
      itemsAdded.push(...subItems);
    }

    // Se estivermos no final do processo ROOT, podemos opcionalmente limpar os órfãos
    if (isRoot && onProgress) {
      onProgress(`🧹 Verificando se existem arquivos órfãos no banco...`);
      const allFirestoreDocs = await getMediaLibrary();
      let orphansCount = 0;
      
      for (const item of allFirestoreDocs) {
        // Se a URL está no Firestore mas NÃO foi encontrada no Storage durante a varredura
        if (!validUrls.has(item.url)) {
          try {
            await deleteDoc(doc(db, 'media_library', item.id));
            orphansCount++;
          } catch (e) {
            console.error(`Erro ao deletar órfão ${item.id}`);
          }
        }
      }
      if (orphansCount > 0) {
        onProgress(`🗑️ ${orphansCount} registros órfãos foram removidos.`);
      }
    }

    return itemsAdded;
  } catch (error) {
    if (onProgress) onProgress(`❌ Erro em ${path}: ${error instanceof Error ? error.message : 'Erro oculto'}`);
    return [];
  }
};

/**
 * Função utilitária para migrar mídias que não possuem projectId
 * ATENÇÃO: Use com cuidado.
 */
export const migrateLegacyMedia = async (targetProjectId: string) => {
  const mediaRef = collection(db, 'media_library');
  const snapshot = await getDocs(mediaRef);
  
  const batch = snapshot.docs
    .filter(doc => {
      const data = doc.data();
      return !data.projectId || 
             data.projectId === 'undefined' || 
             data.projectId === 'null' || 
             data.projectId === 'projeto6';
    })
    .map(doc => {
      return updateDoc(doc.ref, { projectId: targetProjectId });
    });

  await Promise.all(batch);
  return batch.length;
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
