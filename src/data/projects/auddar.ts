import { Project } from '../../types';

export const auddar: Project = {
  id: 'projeto-auddar',
  title: 'Auddar',
  description: 'Estratégia e Gestão de Conteúdo para Techospitality.',
  layoutType: 'vertical',
  galleryThumbnail: '',
  coverImage: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/media%2Fprojeto-auddar%2F04-Parceria.webp?alt=media',
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
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/media%2Fprojeto-auddar%2F03-Apresentacao_page-0001.webp?alt=media',
        allowScroll: true
      }
    },
    {
      id: 'auddar-04',
      title: 'Parceria Estratégica',
      aspectRatio: 1.4148, // 764/540
      media: {
        type: 'image',
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/media%2Fprojeto-auddar%2F04-Parceria.webp?alt=media',
        allowScroll: true,
      }
    },
    {
      id: 'auddar-05',
      title: 'E-mail Marketing',
      aspectRatio: 1.4148, // 764/540
      media: {
        type: 'image',
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/media%2Fprojeto-auddar%2F05-Email.webp?alt=media',
        allowScroll: true,
      }
    },
    {
      id: 'auddar-carousel-1',
      title: 'Carrossel 1',
      aspectRatio: 1.0,
      media: {
        type: 'image',
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/media%2Fprojeto-auddar%2F06.webp?alt=media'
      },
      stories: [
        { type: 'image', url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/media%2Fprojeto-auddar%2F08.webp?alt=media' },
        { type: 'image', url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/media%2Fprojeto-auddar%2F10.webp?alt=media' },
        { type: 'image', url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/media%2Fprojeto-auddar%2F12.webp?alt=media' },
        { type: 'image', url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/media%2Fprojeto-auddar%2F14.webp?alt=media' }
      ]
    },
    {
      id: 'auddar-carousel-2',
      title: 'Carrossel 2',
      aspectRatio: 1.0,
      media: {
        type: 'image',
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/media%2Fprojeto-auddar%2F07.webp?alt=media'
      },
      stories: [
        { type: 'image', url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/media%2Fprojeto-auddar%2F11.webp?alt=media' },
        { type: 'image', url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/media%2Fprojeto-auddar%2F13.webp?alt=media' },
        { type: 'image', url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/media%2Fprojeto-auddar%2F15.webp?alt=media' }
      ]
    }
  ]
};
