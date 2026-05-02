
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
        title: 'Sobre o Projeto',
        aspectRatio: 1,
        media: {
          type: 'text',
          title: 'Auddar',
          subtitle: 'Techospitality',
          content: 'Estruturação de Marketing e Materiais de Venda | Auddar (Techospitality)\n\nProjeto de estruturação da comunicação e dos serviços da Audaar, empresa de tecnologia para o setor de hospedagem. Objetivo de organizar a proposta de valor da marca, desenvolver narrativa e materiais estratégicos de venda, com foco em clareza, consistência e conversão.\n\nMeu papel:\nGerente de Marketing, atuando de forma integrada ao time comercial para estruturar comunicação, presença digital e suporte às vendas.\n\nEscopo de atuação:\n• Desenvolvimento de narrativa, tom de voz e posicionamento\n• Criação de apresentações comerciais e materiais de venda (propostas, serviços e pitch)\n• Estruturação do Instagram (bio, destaques e identidade inicial)\n• Produção de conteúdos estratégicos (carrosséis informativos)\n• Criação de e-mail marketing (copy e layout) para relacionamento e apoio comercial\n• Planejamento de ações e conteúdos alinhados à aquisição e posicionamento\n• Apoio a demandas internas de comunicação (endomarketing)\n\nEntrega:\n• Organização e clareza na comunicação dos serviços\n• Materiais estruturados para apoio direto ao time comercial\n• Base de presença digital alinhada ao posicionamento da marca\n• Conteúdos voltados à educação do público e geração de demanda\n\nFoco estratégico:\nTradução de soluções técnicas em comunicação acessível e orientada à conversão, conectando marketing, conteúdo e processo comercial',
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
