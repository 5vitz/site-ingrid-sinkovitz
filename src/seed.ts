
import { db } from './lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const seedAuddar = async () => {
  const projectId = 'projeto-auddar';
  const auddarData = {
    id: projectId,
    title: 'Auddar',
    description: 'Estratégia e Gestão de Conteúdo para Techospitality.',
    order: 4,
    galleryThumbnail: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F04-Parceria.png?alt=media&token=88d95213-2428-441a-8b02-587733d0cfae',
    coverImage: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F04-Parceria.png?alt=media&token=88d95213-2428-441a-8b02-587733d0cfae',
    layoutType: 'vertical',
    audioUrl: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2FAudio%2FTrilha-Auddar.mp3?alt=media&token=9a06a8fb-3058-4a61-9a3a-35768a337181',
    theme: {
      playerBg: 'bg-zinc-950',
      accentColor: '#172554',
      playerBorder: 'border-[#172554]/60',
      playerShadow: 'shadow-[0_0_50px_rgba(23,37,84,0.4)] animate-neon-pulse'
    },
    aboutConfig: {
      title: 'Estruturação de Marketing e Materiais de Venda',
      subtitle: 'Audaar - Techospitality',
      description: `Projeto de estruturação da comunicação e dos serviços da Audaar, empresa de tecnologia para o setor de hospedagem. Objetivo de organizar a proposta de valor da marca, desenvolver narrativa e materiais estratégicos de venda, com foco em clareza, consistência e conversão.

Meu papel:
Gerente de Marketing, atuando de forma integrada ao time comercial para estruturar comunicação, presença digital e suporte às vendas.

Escopo de atuação:
Desenvolvimento de narrativa, tom de voz e posicionamento
Criação de apresentações comerciais e materiais de venda (propostas, serviços e pitch)
Estruturação do Instagram (bio, destaques e identidade inicial)
Produção de conteúdos estratégicos (carrosséis informativos)
Criação de e-mail marketing (copy e layout) para relacionamento e apoio comercial
Planejamento de ações e conteúdos alinhados à aquisição e posicionamento
Apoio a demandas internas de comunicação (endomarketing)

Entrega:
Organização e clareza na comunicação dos serviços
Materiais estruturados para apoio direto ao time comercial
Base de presença digital alinhada ao posicionamento da marca
Conteúdos voltados à educação do público e geração de demanda

Foco estratégico:
Tradução de soluções técnicas em comunicação acessível e orientada à conversão, conectando marketing, conteúdo e processo comercial`,
      ctaText: 'Ver Projeto',
      width: 'max-w-2xl',
      backgroundColor: 'bg-zinc-900/90',
      textColor: 'text-white',
      ctaColor: 'bg-[#172554]',
      ctaTextColor: 'text-white'
    },
    feed: [
      {
        id: 'auddar-03',
        title: 'Apresentação Comercial',
        aspectRatio: 1.777,
        media: {
          type: 'pdf',
          url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F03-Apresentacao.pdf?alt=media&token=e1773370-5a15-409c-9f1b-9cbbc8a5d284'
        }
      },
      {
        id: 'auddar-04',
        title: 'Parceria Estratégica',
        aspectRatio: 0.8,
        media: {
          type: 'image',
          url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F04-Parceria.png?alt=media&token=88d95213-2428-441a-8b02-587733d0cfae'
        }
      },
      {
        id: 'auddar-05',
        title: 'E-mail Marketing',
        aspectRatio: 0.8,
        media: {
          type: 'image',
          url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F05-Email.png?alt=media&token=b4a3b159-284e-463f-9de8-8075862e73c7'
        }
      },
      {
        id: 'auddar-carousel-1',
        title: 'Carrossel 1',
        aspectRatio: 0.8,
        media: {
          type: 'image',
          url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F06.png?alt=media&token=680da923-89b6-42c0-9137-dfa6fc042f2c'
        },
        stories: [
          { type: 'image', url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F06.png?alt=media&token=680da923-89b6-42c0-9137-dfa6fc042f2c' },
          { type: 'image', url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F08.png?alt=media&token=2ac67681-97d5-460c-ba2b-3c6333e61b57' },
          { type: 'image', url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F10.png?alt=media&token=8435034c-7286-47b1-869b-8effb8d596e8' },
          { type: 'image', url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F12.png?alt=media&token=12da4f64-c577-45b5-a25e-36c7eee38a82' },
          { type: 'image', url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F14.png?alt=media&token=34ab42ad-e3fb-4360-9b82-d74a20b79fdd' }
        ]
      },
      {
        id: 'auddar-carousel-2',
        title: 'Carrossel 2',
        aspectRatio: 0.8,
        media: {
          type: 'image',
          url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F07.png?alt=media&token=2ea91a9d-1abb-488e-9911-1c8cd0030b30'
        },
        stories: [
          { type: 'image', url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F07.png?alt=media&token=2ea91a9d-1abb-488e-9911-1c8cd0030b30' },
          { type: 'image', url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F09.png?alt=media&token=469b3533-2836-4c5a-a9e0-ce5e2e6c3ac6' },
          { type: 'image', url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F11.png?alt=media&token=bbac69b3-ca53-46dd-b369-ee036a522217' },
          { type: 'image', url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F13.png?alt=media&token=e5182804-7b53-4df9-b6f2-6a3cf412c304' },
          { type: 'image', url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F15.png?alt=media&token=70d1c25f-99e3-4efd-b4b7-7999bed4da5a' }
        ]
      }
    ]
  };


  try {
    await setDoc(doc(db, 'projects', projectId), auddarData, { merge: true });
    console.log('Project Auddar seeded successfully with correct URLs');
  } catch (error) {
    console.error('Error seeding Auddar:', error);
  }
};
