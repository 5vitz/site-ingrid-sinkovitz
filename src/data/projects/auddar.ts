import { Project } from '../../types';

export const auddar: Project = {
  id: 'projeto-auddar',
  title: 'Auddar',
  description: 'Estratégia e Gestão de Conteúdo para Techospitality.',
  layoutType: 'vertical',
  galleryThumbnail: '',
  coverImage: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F04-Parceria.png?alt=media&token=88d95213-2428-441a-8b02-587733d0cfae',
  audioUrl: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2FAudio%2FTrilha-Auddar.mp3?alt=media&token=9a06a8fb-3058-4a61-9a3a-35768a337181',
  order: 4,
  mediaItems: [],
  theme: {
    accentColor: '#172554',
    playerBg: 'bg-zinc-950',
    playerBorder: 'border-[#172554]/60',
    playerShadow: 'shadow-[0_0_50px_rgba(23,37,84,0.4)] animate-neon-pulse',
    navButtonBg: 'bg-[#172554]/60',
    navButtonColor: 'text-white',
    playerWidth: 540,
    playerHeight: 540,
    borderWidth: '1px',
    borderRadius: '8px'
  },
  aboutConfig: undefined,
  feed: [
    {
      id: 'auddar-03',
      title: 'Apresentação Comercial',
      aspectRatio: 1.4148, // 764/540
      media: {
        type: 'image',
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F03-Apresentacao_page-0001.jpg?alt=media&token=a6f10c92-e431-45b3-9c51-42d3391cbe67',
        allowScroll: true
      }
    },
    {
      id: 'auddar-04',
      title: 'Parceria Estratégica',
      aspectRatio: 1.4148, // 764/540
      media: {
        type: 'image',
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F04-Parceria.png?alt=media&token=88d95213-2428-441a-8b02-587733d0cfae',
        allowScroll: true,
      }
    },
    {
      id: 'auddar-05',
      title: 'E-mail Marketing',
      aspectRatio: 1.4148, // 764/540
      media: {
        type: 'image',
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F05-Email.png?alt=media&token=b4a3b159-284e-463f-9de8-8075862e73c7',
        allowScroll: true,
      }
    },
    {
      id: 'auddar-carousel-1',
      title: 'Carrossel 1',
      aspectRatio: 1.0,
      media: {
        type: 'image',
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F06.png?alt=media&token=680da923-89b6-42c0-9137-dfa6fc042f2c'
      },
      stories: [
        { type: 'image', url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F08.png?alt=media&token=2ac67681-97d5-460c-ba2b-3c6333e61b57' },
        { type: 'image', url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F10.png?alt=media&token=8435034c-7286-47b1-869b-8effb8d596e8' },
        { type: 'image', url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F12.png?alt=media&token=12da4f64-c577-45b5-a25e-36c7eee38a82' },
        { type: 'image', url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F14.png?alt=media&token=34ab42ad-e3fb-4360-9b82-d74a20b79fdd' }
      ]
    },
    {
      id: 'auddar-carousel-2',
      title: 'Carrossel 2',
      aspectRatio: 1.0,
      media: {
        type: 'image',
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F07.png?alt=media&token=2ea91a9d-1abb-488e-9911-1c8cd0030b30'
      },
      stories: [
        { type: 'image', url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F11.png?alt=media&token=bbac69b3-ca53-46dd-b369-ee036a522217' },
        { type: 'image', url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F13.png?alt=media&token=e5182804-7b53-4df9-b6f2-6a3cf412c304' },
        { type: 'image', url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F15.png?alt=media&token=70d1c25f-99e3-4efd-b4b7-7999bed4da5a' }
      ]
    }
  ]
};
