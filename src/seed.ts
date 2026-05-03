
import { db } from './lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const seedAuddar = async () => {
  const projectId = 'projeto-auddar';
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
      accentColor: '#172554',
      playerBorder: 'border-[#172554]/60',
      playerShadow: 'shadow-[0_0_50px_rgba(23,37,84,0.4)] animate-neon-pulse'
    },
    feed: [
      {
        id: 'auddar-main',
        title: 'Techospitality Strategy',
        aspectRatio: 1,
        media: {
          type: 'image',
          url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F01-Capa.jpg?alt=media&token=ce795f6e-1aea-4fa7-8f93-d6797b6a2450',
          objectFit: 'cover',
          zoom: 1.03
        },
        stories: [
          {
            type: 'text',
            title: 'Auddar',
            subtitle: 'Techospitality',
            content: 'Estruturação de Marketing e Materiais de Venda | Auddar (Techospitality)\n\nProjeto de estruturação da comunicação e dos serviços da Audaar, empresa de tecnologia para o setor de hospedagem. Objetivo de organizar a proposta de valor da marca, desenvolver narrativa e materiais estratégicos de venda, com foco em clareza, consistência e conversão.\n\nMeu papel:\nGerente de Marketing, atuando de forma integrada ao time comercial para estruturar comunicação, presença digital e suporte às vendas.\n\nEscopo de atuação:\n• Desenvolvimento de narrativa, tom de voz e posicionamento\n• Criação de apresentações comerciais e materiais de venda (propostas, serviços e pitch)\n• Estruturação do Instagram (bio, destaques e identidade inicial)\n• Produção de conteúdos estratégicos (carrosséis informativos)\n• Criação de e-mail marketing (copy e layout) para relacionamento e apoio comercial\n• Planejamento de ações e conteúdos alinhados à aquisição e posicionamento\n• Apoio a demandas internas de comunicação (endomarketing)\n\nEntrega:\n• Organização e clareza na comunicação dos serviços\n• Materiais estruturados para apoio direto ao time comercial\n• Base de presença digital alinhada ao posicionamento da marca\n• Conteúdos voltados à educação do público e geração de demanda\n\nFoco estratégico:\nTradução de soluções técnicas em comunicação acessível e orientada à conversão, conectando marketing, conteúdo e processo comercial',
            layout: 'default'
          },
          {
            type: 'pdf',
            url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F03-Apresentacao.pdf?alt=media&token=e1773370-5a15-409c-9f1b-9cbbc8a5d284',
            title: 'Apresentação Comercial'
          },
          {
            type: 'image',
            url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F04-Parceria.png?alt=media&token=88d95213-2428-441a-8b02-587733d0cfae',
            objectFit: 'cover',
            zoom: 1.15
          },
          {
            type: 'image',
            url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F05-Email.png?alt=media&token=b4a3b159-284e-463f-9de8-8075862e73c7',
            objectFit: 'cover',
            zoom: 1.15
          },
          {
            type: 'image',
            url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F06.png?alt=media&token=680da923-89b6-42c0-9137-dfa6fc042f2c',
            objectFit: 'cover',
            zoom: 1.05
          },
          {
            type: 'image',
            url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F07.png?alt=media&token=2ea91a9d-1abb-488e-9911-1c8cd0030b30',
            objectFit: 'cover',
            zoom: 1.05
          },
          {
            type: 'image',
            url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F08.png?alt=media&token=2ac67681-97d5-460c-ba2b-3c6333e61b57',
            objectFit: 'cover',
            zoom: 1.05
          },
          {
            type: 'image',
            url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F09.png?alt=media&token=469b3533-2836-4c5a-a9e0-ce5e2e6c3ac6',
            objectFit: 'cover',
            zoom: 1.05
          },
          {
            type: 'image',
            url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F10.png?alt=media&token=8435034c-7286-47b1-869b-8effb8d596e8',
            objectFit: 'cover',
            zoom: 1.05
          },
          {
            type: 'image',
            url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F11.png?alt=media&token=bbac69b3-ca53-46dd-b369-ee036a522217',
            objectFit: 'cover',
            zoom: 1.05
          },
          {
            type: 'image',
            url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F12.png?alt=media&token=12da4f64-c577-45b5-a25e-36c7eee38a82',
            objectFit: 'cover',
            zoom: 1.05
          },
          {
            type: 'image',
            url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F13.png?alt=media&token=e5182804-7b53-4df9-b6f2-6a3cf412c304',
            objectFit: 'cover',
            zoom: 1.05
          },
          {
            type: 'image',
            url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F14.png?alt=media&token=34ab42ad-e3fb-4360-9b82-d74a20b79fdd',
            objectFit: 'cover',
            zoom: 1.05
          },
          {
            type: 'image',
            url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F15.png?alt=media&token=70d1c25f-99e3-4efd-b4b7-7999bed4da5a',
            objectFit: 'cover',
            zoom: 1.05
          }
        ]
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
