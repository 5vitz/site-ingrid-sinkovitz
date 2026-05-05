import { doc, setDoc, writeBatch, getDocFromServer } from 'firebase/firestore';
import { db, auth } from './lib/firebase';
import { PROJECTS_LIST } from './constants/projects';
import { Testimonial } from './types';

// Função utilitária para capturar erros e fornecer diagnóstico
const handleFirestoreError = (error: any, operation: string, path: string) => {
  const info = {
    error: error.message || String(error),
    operation,
    path,
    code: error.code || 'unknown',
    user: auth?.currentUser?.email
  };
  console.error(`[FIRESTORE_DIAGNOSTIC]`, JSON.stringify(info));
  return new Error(`${operation} em ${path} falhou: ${info.error}`);
};

// Função utilitária para timeout
const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number, errorMsg: string): Promise<T> => {
  let timeoutHandle: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => reject(new Error(errorMsg)), timeoutMs);
  });
  const result = await Promise.race([promise, timeoutPromise]);
  clearTimeout(timeoutHandle);
  return result;
};

// Teste de conectividade inicial simplificado
export const testConnectivity = async () => {
  try {
    console.log('🔍 Verificando resposta do servidor...');
    // Apenas tenta um GetFromServer que falha rápido se offline
    await withTimeout(
      getDocFromServer(doc(db, 'diagnostics', 'ping')),
      5000,
      'Servidor não respondeu.'
    );
    return true;
  } catch (err: any) {
    // Se o erro for de permissão, significa que o servidor RESPONDEU (o que é bom)
    if (err.code === 'permission-denied' || err.code === 'unauthenticated') {
      console.log('✅ Servidor alcançável.');
      return true;
    }
    console.warn('⚠️ Servidor parece inacessível no momento, mas tentaremos os lotes:', err.message);
    return false;
  }
};

export const seedAllProjects = async (onProgress?: (msg: string) => void) => {
  console.log('🚀 Iniciando Seed de Projetos (Modo Individual)...');
  onProgress?.('Iniciando carga de projetos...');
  
  try {
    let count = 0;
    const total = PROJECTS_LIST.length;
    
    for (const project of PROJECTS_LIST) {
      count++;
      onProgress?.(`Projeto ${count}/${total}: ${project.title}`);
      console.log(`📤 Enviando: ${project.title}`);
      
      const docRef = doc(db, 'projects', project.id);
      await withTimeout(
        setDoc(docRef, project, { merge: true }),
        45000,
        `Tempo esgotado ao salvar o projeto "${project.title}". Verifique sua rede.`
      );
      
      // Pequeno respiro para a rede
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('✅ Todos os projetos sincronizados.');
  } catch (error: any) {
    console.error('❌ Erro no seed de projetos:', error);
    throw handleFirestoreError(error, 'SET_DOC', 'projects');
  }
};

export const seedTestimonials = async (onProgress?: (msg: string) => void) => {
  const testimonialsList: Testimonial[] = [
    {
      id: 'testimonial-1',
      author: "Paulo Buzzo",
      role: "Gestor Comercial | Growth | IA",
      text: "Tive a honra de ter a Ingrid na equipe comercial da Auddar. Ela muito além do esperado, cuidando da comunicação interna, eventos e transformando as redes sociais...",
      photoUrl: "https://lh3.googleusercontent.com/d/1gOBdoaCX4zcS1xfMYbi-LTtZ_2WFeIva",
      order: 1
    },
    {
      id: 'testimonial-2',
      author: "Karina Redivo",
      role: "Coordinadora de Marketing",
      text: "A Ingrid é uma profissional multifuncional, muito dedicada, organizada e com senso de resolução incrível...",
      photoUrl: "https://lh3.googleusercontent.com/d/1BkSIA3AFFHwMutkS8FVjOnImhIkPq92A",
      order: 2
    },
    {
      id: 'testimonial-3',
      author: "Guilherme Bressan",
      role: "Creative Director at Estoriah",
      text: "Tive o prazer de trabalhar com a Guigui em minha Produtora de Narrativas em 2022 e 2023...",
      photoUrl: "https://lh3.googleusercontent.com/d/1rmHzyu5fdTHMGj6a30KQxElstZ78UGDS",
      order: 3
    }
  ];

  try {
    let i = 0;
    for (const t of testimonialsList) {
      i++;
      onProgress?.(`Gravando depoimento ${i}/3...`);
      await withTimeout(
        setDoc(doc(db, 'testimonials', t.id), t, { merge: true }),
        20000,
        `Timeout ao salvar depoimento de ${t.author}`
      );
      await new Promise(r => setTimeout(r, 200));
    }
    console.log('✅ Depoimentos sincronizados.');
  } catch (error) {
    throw handleFirestoreError(error, 'SET_DOC', 'testimonials');
  }
};

export const seedAboutMe = async (onProgress?: (msg: string) => void) => {
  try {
    onProgress?.('Gravando Bio...');
    await withTimeout(
      setDoc(doc(db, 'settings', 'sobre'), {
        videoUrl: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/SobreMim%2FSobreMim.mp4?alt=media&token=ff5c966d-15e2-489f-bedf-f47a1426a7fd',
        description: `Eu sou a Ingrid, e minha trajetória na comunicação nunca foi linear...`
      }, { merge: true }),
      10000,
      'Timeout ao salvar Bio.'
    );
    console.log('✅ Bio atualizada.');
  } catch (error) {
    throw handleFirestoreError(error, 'SET_DOC', 'settings/sobre');
  }
};

export const seedGlobalSettings = async (onProgress?: (msg: string) => void) => {
  try {
    onProgress?.('Gravando Configurações Globais...');
    await withTimeout(
      setDoc(doc(db, 'settings', 'global'), {
        whatsappNumber: '5511999999999',
        accentColor: '#172554'
      }, { merge: true }),
      10000,
      'Timeout ao salvar Configurações.'
    );
    console.log('✅ Globais atualizadas.');
  } catch (error) {
    throw handleFirestoreError(error, 'SET_DOC', 'settings/global');
  }
};

export const seedAll = async (onProgress?: (msg: string) => void) => {
  console.log('--- INICIANDO SYNC COMPLETO ---');
  
  if (!auth.currentUser) {
    throw new Error('Você precisa estar logado para sincronizar o banco.');
  }

  onProgress?.('Verificando status...');
  // Reduzimos o tempo de ping para ser quase instantâneo
  try {
    await withTimeout(getDocFromServer(doc(db, 'diagnostics', 'ping')), 2500, 'Ping timeout');
  } catch (e) {
    console.log('🔥 Server slow but proceeding...');
  }
  
  onProgress?.('Sincronizando Projetos...');
  await seedAllProjects(onProgress);
  
  onProgress?.('Sincronizando Depoimentos...');
  await seedTestimonials(onProgress);
  
  onProgress?.('Sincronizando Bio...');
  await seedAboutMe(onProgress);
  
  onProgress?.('Sincronizando Configurações...');
  await seedGlobalSettings(onProgress);
  
  onProgress?.('Concluído!');
  console.log('--- SYNC FINALIZADO ---');
};
