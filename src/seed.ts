
import { db } from './lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const seedAuddar = async () => {
  const projectId = 'projeto6';
  const auddarData = {
    id: projectId,
    title: 'Auddar',
    description: 'Estratégia e Gestão de Conteúdo para a maior plataforma de leilões do Brasil.',
    order: 6,
    galleryThumbnail: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F01-Capa.jpg?alt=media&token=ce795f6e-1aea-4fa7-8f93-d6797b6a2450',
    coverImage: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F01-Capa.jpg?alt=media&token=ce795f6e-1aea-4fa7-8f93-d6797b6a2450',
    layoutType: 'horizontal',
    theme: {
      playerBg: 'bg-zinc-950',
      accentColor: '#00D154',
      playerBorder: 'border-accent/20'
    },
    feed: [
      {
        id: 'f1',
        title: 'Capa do Projeto',
        aspectRatio: 1,
        media: {
          type: 'image',
          url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F01-Capa.jpg?alt=media&token=ce795f6e-1aea-4fa7-8f93-d6797b6a2450',
          zoom: 1,
          objectFit: 'cover'
        }
      },
      {
        id: 'f2',
        title: 'O Desafio',
        aspectRatio: 1,
        media: {
          type: 'text',
          title: 'Auddar',
          subtitle: 'Estratégia & Posicionamento',
          content: 'A Auddar é a maior plataforma de leilões do mercado de luxo no Brasil. O desafio foi humanizar a comunicação e criar uma narrativa que conectasse a exclusividade dos produtos com a confiabilidade da marca.\n\nImplementamos uma estratégia focada em desejo e autoridade, transformando cada leilão em um evento digital de alto impacto.',
          layout: 'default'
        }
      }
    ]
  };

  try {
    await setDoc(doc(db, 'projects', projectId), auddarData, { merge: true });
    console.log('Project Auddar seeded successfully');
  } catch (error) {
    console.error('Error seeding Auddar:', error);
  }
};
