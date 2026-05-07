import { Project } from '../../types';

export const lionJump: Project = {
  id: 'projeto-lion-jump',
  title: 'Lion Jump',
  description: 'Lion Jump: Campanha de Lançamento e Divulgação Artística.',
  layoutType: 'vertical',
  galleryThumbnail: '',
  coverImage: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F01-SobreProjeto%2FCapaLionJump.png?alt=media&token=ef2677d3-ab36-4eb2-a2e9-7991754fb7f4',
  audioUrl: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Trilha%2FMetavix.mp3?alt=media&token=866a461d-6169-450f-90e9-74cb96e95b00',
  order: 5,
  mediaItems: [],
  theme: {
    accentColor: '#FEF200',
    playerBg: 'bg-black',
    playerBorder: 'border-[#FEF200]/40',
    playerShadow: 'shadow-[0_0_50px_rgba(254,242,0,0.25)] animate-neon-pulse',
    navButtonBg: 'bg-[#0c9347]',
    navButtonColor: 'text-white',
    playerWidth: 960, // Formato 16:9 original
    playerHeight: 540,
    borderWidth: '1px',
    borderRadius: '8px'
  },
  aboutConfig: {
    title: 'Campanha de Lançamento e Divulgação Artística',
    subtitle: 'Lion Jump',
    description: `Projeto de comunicação e produção cultural para lançamento e divulgação de álbum musical da banda Lion Jump. Objetivo de estruturar a presença pública do projeto, ampliando visibilidade, relacionamento com mídia e alcance de público por meio de campanha integrada de marketing e assessoria.

Meu papel:
Atuação em comunicação e produção cultural, com foco em estratégia de divulgação, relacionamento e execução de ações e eventos.

Escopo de atuação:
• Planejamento e execução da estratégia de divulgação (release, mídia, peças digitais e redes sociais)
• Construção de narrativa e posicionamento artístico
• Desenvolvimento de projetos e captação de patrocínio/apoio
• Produção e organização de eventos e agenda
• Relacionamento com parceiros, imprensa e stakeholders

Entrega:
• Campanha de divulgação integrada para lançamento do álbum
• Materiais de comunicação e presença digital do projeto
• Estrutura de relacionamento com mídia e parceiros
• Execução de eventos e ativações ligadas ao lançamento

Destaques do projeto:
• Atuação na comunicação de banda selecionada para o programa SuperStar
• Coordenação de materiais e presença de mídia durante exposição nacional
• Participação em turnê internacional (Itália), com gestão de comunicação e agenda
• Experiência em gestão de imagem pública e narrativa artística

Foco estratégico:
Construção de visibilidade e posicionamento artístico por meio de comunicação integrada, conectando mídia, conteúdo e presença pública.`,
    ctaText: 'Iniciar Experiência',
    width: 'max-w-2xl',
    backgroundColor: 'bg-zinc-900/90',
    textColor: 'text-white',
    ctaColor: 'bg-[#0c9347]',
    ctaTextColor: 'text-white'
  },
  feed: [
    // Seção 01: Sobre o Projeto
    {
      id: 'lj-feed-01',
      title: 'Sobre o Projeto',
      aspectRatio: 1.77777777778,
      media: { 
        type: 'image', 
        order: 1, 
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F01-SobreProjeto%2FCapaLionJump.png?alt=media&token=ef2677d3-ab36-4eb2-a2e9-7991754fb7f4',
      }
    },
    // Seção 02: Sobre a Banda
    {
      id: 'lj-feed-02',
      title: 'Sobre a Banda',
      aspectRatio: 1.77777777778,
      media: { 
        type: 'image', 
        order: 3, 
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F02-SobreBanda%2FCapaBanda.png?alt=media&token=77de858c-f5e1-4b8d-bb32-2eeb48cdc889',
      }
    },
    // Seção 03: SuperStar
    {
      id: 'lj-feed-03-gshow',
      title: 'GShow 1',
      aspectRatio: 1.77777777778,
      media: {
        type: 'image',
        order: 7,
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F03-SuperStar%2FGShow1%2FGShow1.png?alt=media&token=39148d2c-02c9-4156-beeb-5ef15cfc1841',
        allowScroll: true
      }
    },
    {
      id: 'lj-feed-03-video',
      title: 'SuperStar Apresentação',
      aspectRatio: 1.77777777778,
      media: {
        type: 'video',
        order: 8,
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F03-SuperStar%2FLionJump_superstarApresentação.mp4?alt=media&token=c49c92a3-58b4-4c81-a083-344ce4bb1e25',
        objectFit: 'cover'
      }
    },
    // Seção 04: África
    {
      id: 'lj-feed-04-video1',
      title: 'Clip África',
      aspectRatio: 1.77777777778,
      media: {
        type: 'video',
        order: 10,
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F04-Africa%2FClip_África.mp4?alt=media&token=47f294c8-6420-4b82-9ad9-9a6efd332cd1',
        objectFit: 'cover'
      }
    },
    {
      id: 'lj-feed-04-video2',
      title: 'Em Movimento África',
      aspectRatio: 1.77777777778,
      media: {
        type: 'video',
        order: 11,
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F04-Africa%2FEmMovimentoAfrica.mp4?alt=media&token=75dcf0b9-53aa-4601-9267-e87c8c74e747',
        objectFit: 'cover'
      }
    },
    {
      id: 'lj-feed-04-pages',
      title: 'Em Movimento África',
      aspectRatio: 1.77777777778,
      media: {
        type: 'image',
        order: 12,
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F04-Africa%2FEmMovimentoAfrica_page-0001.jpg?alt=media&token=9045d6b8-dad6-4936-9867-3a97d2eed372',
        images: [
          'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F04-Africa%2FEmMovimentoAfrica_page-0001.jpg?alt=media&token=9045d6b8-dad6-4936-9867-3a97d2eed372',
          'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F04-Africa%2FEmMovimentoAfrica_page-0002.jpg?alt=media&token=1a0c76e4-e880-4b9e-b7a1-11d0aa7dd328'
        ],
        allowScroll: true
      }
    },
    // Seção 05: Itália
    {
      id: 'lj-feed-05',
      title: 'Itália',
      aspectRatio: 1.77777777778,
      media: { 
        type: 'image', 
        order: 13, 
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F05-Italia%2FCapaItalia.png?alt=media&token=21f53070-5798-4113-b692-1fa42cdb7abd',
      }
    },
    {
      id: 'lj-feed-05-gshow',
      title: 'GShow Itália',
      aspectRatio: 1.77777777778,
      media: {
        type: 'image',
        order: 14,
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F05-Italia%2FGShow%2FGShow.png?alt=media&token=35baa827-2dde-4813-8d33-bd1e415e6d2e',
        allowScroll: true
      }
    },
    {
      id: 'lj-feed-05-video',
      title: 'Olhos de Todas as Cores',
      aspectRatio: 1.77777777778,
      media: {
        type: 'video',
        order: 15,
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F05-Italia%2FOlhosDeTodasAsCores.mp4?alt=media&token=c7f637dc-85e1-434c-968a-e9dfcf12ac0a',
        objectFit: 'cover'
      }
    }
  ]
};
