import { Project } from '../../types';

export const goodStorage: Project = {
  id: 'projeto-good-storage',
  title: 'Good Storage',
  description: 'Uma série de Reels produzidos para a campanha de comunicação da Good Storage.',
  layoutType: 'vertical',
  galleryThumbnail: '',
  coverImage: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FReels_Aline_SoulSmile.mp4?alt=media',
  audioUrl: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Trilha%2FMetavix.mp3?alt=media&token=866a461d-6169-450f-90e9-74cb96e95b00',
  order: 3,
  mediaItems: [],
  theme: {
    accentColor: '#fbbf24', // Amarelo Good Storage
    playerBg: 'bg-black',
    playerBorder: 'border-[#fbbf24]/50',
    playerShadow: 'shadow-[0_0_40px_rgba(251,191,36,0.15)]',
    navButtonBg: 'bg-[#fbbf24]/60',
    navButtonColor: 'text-white',
    // Customização de layout
    playerWidth: 304, // 540 * (9/16) para Reels
    playerHeight: 540,
    borderWidth: '2px',
    borderRadius: '24px'
  },
  aboutConfig: {
    title: 'Campanha Good Storage',
    description: 'Estratégia de comunicação focada em lifestyle e soluções de espaço urbano. \n\nAtravés de uma série de Reels dinâmicos, humanizamos a marca apresentando histórias reais de clientes como Aline Soul Smile e DJ Dre. O foco aqui foi criar um conteúdo de "snack-size" que seja altamente compartilhável e visualmente impactante, reforçando o posicionamento da Good Storage como líder em self-storage inteligente.',
    ctaText: 'Assistir Reels',
    width: 'max-w-md',
    backgroundColor: 'bg-zinc-900/90',
    textColor: 'text-white',
    ctaColor: 'bg-[#fbbf24]',
    ctaTextColor: 'text-black'
  },
  feed: [
    {
      id: 'gs-feed-01',
      title: 'Aline Soul Smile',
      aspectRatio: 0.5625, // 9:16
      media: { 
        type: 'video', 
        order: 1, 
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FReels_Aline_SoulSmile.mp4?alt=media',
        thumbnail: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/media%2Fprojeto-auddar%2F06.webp?alt=media',
        objectFit: 'contain'
      },
      stories: []
    },
    {
      id: 'gs-feed-02',
      title: 'DJ Dre',
      aspectRatio: 0.5625,
      media: { 
        type: 'video', 
        order: 2, 
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FReels_DJDre.mp4?alt=media',
        thumbnail: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/media%2Fprojeto-auddar%2F06.webp?alt=media',
        objectFit: 'contain'
      },
      stories: []
    },
    {
      id: 'gs-feed-03',
      title: 'Lennon Banho de Gato',
      aspectRatio: 0.5625,
      media: { 
        type: 'video', 
        order: 3, 
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FReels_Lennon_BanhodeGato.mp4?alt=media',
        thumbnail: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/media%2Fprojeto-auddar%2F06.webp?alt=media',
        objectFit: 'contain'
      },
      stories: []
    }
  ]
};
