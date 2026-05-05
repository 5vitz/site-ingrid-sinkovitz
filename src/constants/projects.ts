import { Project } from '../types';

export const METAVIX_PROJECT: Project = {
  id: 'projeto-metavix',
  title: 'Metavix',
  description: 'Apresentação arquitetônica completa dividida em Reels (Feed vertical) e Capítulos de Carrossel (Stories horizontais).',
  layoutType: '2d',
  galleryThumbnail: '',
  coverImage: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FDekki%2F01.jpg?alt=media&token=84b15674-9ffd-4bd6-b6e3-8fcc20132791',
  audioUrl: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Trilha%2FMetavix.mp3?alt=media&token=866a461d-6169-450f-90e9-74cb96e95b00',
  order: 1,
  mediaItems: [],
  theme: {
    accentColor: '#00D154',
    playerBorder: 'border-white/10',
    navButtonBg: 'bg-[#00D154]/35',
    playerWidth: 303,
    playerHeight: 540,
    borderWidth: '1px',
    borderRadius: '8px'
  },
  aboutConfig: {
    title: 'Estratégia de Conteúdo e Gestão de Social Media',
    subtitle: 'Metavix - Grupo de Restaurantes',
    description: `Projeto de estruturação e gestão da comunicação digital do Grupo Metavix, responsável por diferentes marcas no segmento gastronômico. Objetivo de consolidar o posicionamento das marcas nas redes sociais, trazendo consistência de comunicação, fortalecimento de presença digital e apoio à geração de demanda.

Escopo de atuação:
• Planejamento e condução da estratégia de conteúdo para múltiplas marcas
• Desenvolvimento de narrativa, tom de voz e linha editorial
• Estruturação e gestão do calendário editorial
• Criação de pautas, roteiros e briefings para produção de conteúdo
• Coordenação de time criativo (design e audiovisual), com direcionamento e acompanhamento de entregas
• Organização de fluxos de trabalho e processos de produção
• Condução de alinhamentos e acompanhamento estratégico com stakeholders
• Monitoramento de qualidade e consistência das entregas
• Acompanhamento de métricas e otimização contínua de conteúdo

Entrega:
• Estruturação da presença digital das marcas do grupo no Instagram
• Padronização de comunicação e fortalecimento de identidade de marca
• Organização da operação de conteúdo, com mais eficiência e previsibilidade
• Conteúdos alinhados ao posicionamento e ao público de cada restaurante

Foco estratégico:
Organização e escalabilidade da comunicação para múltiplas marcas, garantindo consistência, eficiência operacional e conexão entre posicionamento, conteúdo e resultado.`,
    ctaText: 'Iniciar Tour',
    width: 'max-w-2xl',
    backgroundColor: 'bg-zinc-900/90',
    textColor: 'text-white',
    ctaColor: 'bg-[#00D154]',
    ctaTextColor: 'text-white'
  },
  feed: [
    { id: 'f01', aspectRatio: 0.56, media: { type: 'video', order: 1, playerWidth: 303, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F01.mp4?alt=media&token=19f0b135-718b-4e94-82a1-c5d1e080005c' } },
    { id: 'f03', aspectRatio: 0.56, media: { type: 'video', order: 3, playerWidth: 303, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F04.mp4?alt=media&token=27704524-5b1d-4835-9ac0-10033ff1078b' } },
    { id: 'f04', aspectRatio: 0.56, media: { type: 'video', order: 4, playerWidth: 303, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F05.mp4?alt=media&token=523b5061-5011-401c-8c14-e7708433dbe8' } },
    {
      id: 'f13-dekki',
      aspectRatio: 0.80,
      media: { type: 'image', order: 13, playerWidth: 432, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FDekki%2F01.jpg?alt=media&token=84b15674-9ffd-4bd6-b6e3-8fcc20132791' },
      stories: [
        { type: 'image', order: 14, playerWidth: 432, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FDekki%2F02.jpg?alt=media&token=04e14351-2f8f-4140-90a8-072dfcdddef0' },
        { type: 'image', order: 15, playerWidth: 432, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FDekki%2F03.jpg?alt=media&token=6362e633-b812-41f4-823b-f806defe9829' },
        { type: 'image', order: 16, playerWidth: 432, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FDekki%2F04.jpg?alt=media&token=d6f3f79b-c316-4ffc-9749-0842533c1de5' },
        { type: 'image', order: 17, playerWidth: 432, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FDekki%2F05.jpg?alt=media&token=e32c4695-ed32-4392-aaee-010aabf1074d' },
        { type: 'image', order: 18, playerWidth: 432, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FDekki%2F06.jpg?alt=media&token=b342008d-d088-45df-945c-608f922409de' },
        { type: 'image', order: 19, playerWidth: 432, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FDekki%2F07.jpg?alt=media&token=461c4857-aa7e-48cd-a1d0-34bbb0757561' }
      ]
    },
    { id: 'f05', aspectRatio: 0.56, media: { type: 'video', order: 5, playerWidth: 303, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F07.mp4?alt=media&token=675083eb-6534-4f61-bc3f-fc9b94786543' } },
    { id: 'f06', aspectRatio: 0.56, media: { type: 'video', order: 6, playerWidth: 303, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F09.mp4?alt=media&token=3d656f3d-ad65-4f85-a921-6cbba0a2a3ab' } },
    { id: 'f07', aspectRatio: 0.56, media: { type: 'video', order: 7, playerWidth: 303, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F18.mp4?alt=media&token=bc96c55d-0895-4c6a-a24f-b29c8aa7385d' } },
    {
      id: 'f20-sushi',
      aspectRatio: 0.80,
      media: { type: 'image', order: 20, playerWidth: 432, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Sushi%2F01.jpg?alt=media&token=5f95fd80-1877-4f56-9512-d933a67679f3' },
      stories: [
        { type: 'image', order: 21, playerWidth: 432, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Sushi%2F02.jpg?alt=media&token=7b7e9d51-1520-45f3-9d7f-a74651627e81' },
        { type: 'image', order: 22, playerWidth: 432, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Sushi%2F03.jpg?alt=media&token=b5e9861a-0c9b-428e-aa64-00f4c2ded8e3' },
        { type: 'image', order: 23, playerWidth: 432, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Sushi%2F04.jpg?alt=media&token=1b1c07bc-cbf2-4e05-a1a5-b3e2ee5754e4' },
        { type: 'image', order: 24, playerWidth: 432, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Sushi%2F05.jpg?alt=media&token=3c787220-a41e-49a5-b36a-124f4c5df147' },
        { type: 'image', order: 25, playerWidth: 432, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Sushi%2F06.jpg?alt=media&token=12f4b6c3-16d2-456c-9837-07f8c23d2286' },
        { type: 'image', order: 26, playerWidth: 432, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Sushi%2F07.jpg?alt=media&token=8434379d-76f8-467e-8d36-44dfa1a57ce9' }
      ]
    },
    { id: 'f08', aspectRatio: 0.56, media: { type: 'video', order: 8, playerWidth: 303, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F23.mp4?alt=media&token=51c2e65d-3939-473f-8cc3-fcebb527f293' } },
    { id: 'f09', aspectRatio: 0.56, media: { type: 'video', order: 9, playerWidth: 303, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F25.mp4?alt=media&token=044b72a8-90f3-4fa3-a735-a2828e3782df' } },
    { id: 'f10', aspectRatio: 0.56, media: { type: 'video', order: 10, playerWidth: 303, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F27.mp4?alt=media&token=a7d800d2-1ee9-42f6-9f1e-056047929dac' } },
    {
      id: 'f27-ambiente',
      aspectRatio: 0.80,
      media: { type: 'image', order: 27, playerWidth: 432, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Ambiente%2F01.jpg?alt=media&token=fe2b8ed0-671a-45b3-89ee-fca87037e006' },
      stories: [
        { type: 'image', order: 28, playerWidth: 432, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Ambiente%2F02.jpg?alt=media&token=c07dc69c-05a0-45bc-ada1-be3cf7981bd1' },
        { type: 'image', order: 29, playerWidth: 432, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Ambiente%2F03.jpg?alt=media&token=d5f666c5-373c-4a72-b5ab-0c035574a076' },
        { type: 'image', order: 30, playerWidth: 432, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Ambiente%2F04.jpg?alt=media&token=49c4ea31-f560-4a2b-a961-f339df1e3a3d' },
        { type: 'image', order: 31, playerWidth: 432, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Ambiente%2F05.jpg?alt=media&token=22824c2a-db92-4c18-9b41-ad553249e9d7' },
        { type: 'image', order: 32, playerWidth: 432, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Ambiente%2F06.jpg?alt=media&token=21bc0827-0897-4d5d-a2f4-a23036edd7d1' },
        { type: 'image', order: 33, playerWidth: 432, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Ambiente%2F07.jpg?alt=media&token=311d5b1e-7cb7-468c-a2ad-03f86bace21f' },
        { type: 'image', order: 34, playerWidth: 432, playerHeight: 540, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Ambiente%2F08.jpg?alt=media&token=7b9b3423-2061-40f0-9466-76b481ea456c' }
      ]
    },
  ]
};

export const GOOD_STORAGE_PROJECT: Project = {
  id: 'projeto-good-storage',
  title: 'Good Storage',
  description: 'Uma série de Reels produzidos para a campanha de comunicação da Good Storage.',
  layoutType: 'vertical',
  galleryThumbnail: '',
  coverImage: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FReels_Aline_SoulSmile.mp4?alt=media&token=0e21b470-de72-48be-95bc-935659fdcfca',
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
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FReels_Aline_SoulSmile.mp4?alt=media&token=0e21b470-de72-48be-95bc-935659fdcfca',
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
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FReels_DJDre.mp4?alt=media&token=5649c5f7-03ea-4d8b-a05c-fd889dbda36f',
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
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FReels_Lennon_BanhodeGato.mp4?alt=media&token=f2d22066-0327-4d67-99ef-9675899a0239',
        objectFit: 'contain'
      },
      stories: []
    }
  ]
};

export const ELOBIKE_PROJECT: Project = {
  id: 'projeto-elobike',
  title: 'ELO Bike e Trips',
  description: 'EloBike: Cicloturismo, histórias e paisagens em uma jornada de conexão.',
  layoutType: 'vertical',
  galleryThumbnail: '',
  coverImage: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F01-Marau%2F01-Marau.jpg?alt=media&token=4d54362a-0846-47e3-a6d4-d61b41b1cbd3',
  audioUrl: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Trilha%2FMetavix.mp3?alt=media&token=866a461d-6169-450f-90e9-74cb96e95b00',
  order: 2,
  mediaItems: [],
  theme: {
    accentColor: '#22c55e', // Verde cicloturismo
    playerBg: 'bg-black',
    playerBorder: 'border-[#22c55e]/50',
    playerShadow: 'shadow-[0_0_40px_rgba(34,197,94,0.15)]',
    navButtonBg: 'bg-[#22c55e]/60',
    navButtonColor: 'text-white',
    playerWidth: 432,
    playerHeight: 540,
    borderWidth: '2px',
    borderRadius: '16px'
  },
  aboutConfig: {
    title: 'Estratégia de Conteúdo e Presença Digital',
    subtitle: 'ELO Bike & Trips',
    description: `Projeto de estruturação e gestão da presença digital da ELO Bike & Trips, agência de cicloturismo. Objetivo de consolidar o Instagram como principal canal de comunicação e conversão, com crescimento orgânico e fortalecimento da marca.

Escopo de atuação:
• Planejamento e condução da estratégia de conteúdo para redes sociais
• Desenvolvimento de narrativa, tom de voz e linha editorial
• Estruturação e gestão do calendário editorial
• Criação de pautas, roteiros e briefings para produção de conteúdo
• Organização de fluxos de trabalho e acompanhamento da produção
• Interface direta com o cliente e alinhamento estratégico contínuo
• Monitoramento de qualidade e consistência das entregas
• Análise de performance e otimização de conteúdos

Entrega:
• Estruturação da presença digital no Instagram
• Conteúdos alinhados ao posicionamento da marca e ao perfil do público
• Consistência na comunicação e frequência de publicação
• Base estratégica para crescimento orgânico e geração de demanda

Foco estratégico:
Construção de uma comunicação autêntica e consistente, conectando experiência, estilo de vida e turismo, com foco em gerar identificação, engajamento e conversão.`,
    ctaText: 'Ver Jornada',
    width: 'max-w-2xl',
    backgroundColor: 'bg-zinc-900/90',
    textColor: 'text-white',
    ctaColor: 'bg-[#22c55e]',
    ctaTextColor: 'text-white'
  },
  feed: [
    {
      id: 'eb-reel-marau',
      title: 'Reel Maraú',
      aspectRatio: 0.561,
      media: { 
        type: 'video', 
        order: 1, 
        playerWidth: 303,
        playerHeight: 540,
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F01-Marau%2F00.mp4?alt=media&token=60a6fe52-c33c-41f5-a2aa-65c2b842af15',
        objectFit: 'contain'
      },
      stories: []
    },
    {
      id: 'eb-carousel-marau',
      title: 'Carrossel Maraú',
      aspectRatio: 0.8,
      media: { 
        type: 'image', 
        order: 2, 
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F01-Marau%2F01-Marau.jpg?alt=media&token=4d54362a-0846-47e3-a6d4-d61b41b1cbd3'
      },
      stories: [
        { id: 'eb-s01-03', type: 'image', order: 3, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F01-Marau%2FDia01.jpg?alt=media&token=4c4013a9-befb-4640-92ba-3e670984edb8' },
        { id: 'eb-s01-04', type: 'image', order: 4, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F01-Marau%2FDia02.jpg?alt=media&token=c5ceeef4-760d-4a12-82a2-4e09f1e1a2b0' },
        { id: 'eb-s01-05', type: 'image', order: 5, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F01-Marau%2FDia03.jpg?alt=media&token=a128f4c7-1ea7-439d-93cc-84a878fd3b46' },
        { id: 'eb-s01-06', type: 'image', order: 6, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F01-Marau%2FDia04.jpg?alt=media&token=3a65065f-8cf5-4c71-929e-53549481fb47' },
        { id: 'eb-s01-07', type: 'image', order: 7, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F01-Marau%2FDia05.jpg?alt=media&token=d59eec19-db47-42a9-a67e-3159dbfebc4e' },
        { id: 'eb-s01-08', type: 'image', order: 8, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F01-Marau%2FDia06.jpg?alt=media&token=13eedb37-6252-4b95-9a45-29e90b3d73fe' },
        { id: 'eb-s01-09', type: 'image', order: 9, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F01-Marau%2FDia07.jpg?alt=media&token=7014c649-7fb1-4798-8515-8546a2abac19' },
        { id: 'eb-s01-10', type: 'image', order: 10, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F01-Marau%2FDia08.jpg?alt=media&token=3b71f199-785c-4031-96ff-5a41afc1da6b' },
        { id: 'eb-s01-11', type: 'image', order: 11, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F01-Marau%2FHospedagem.jpg?alt=media&token=7e5110ec-889b-4893-ad3f-761f093ae323' }
      ]
    },
    {
      id: 'eb-reel-cacau',
      title: 'Reel Cacau',
      aspectRatio: 0.561,
      media: { 
        type: 'video', 
        order: 12, 
        playerWidth: 303,
        playerHeight: 540,
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F02-Cacau%2F00.mp4?alt=media&token=3e83b1ef-0676-4adb-a08e-052e6c6dbe0a',
        objectFit: 'contain'
      },
      stories: []
    },
    {
      id: 'eb-carousel-combined',
      title: 'Carrossel Cacau & Indica',
      aspectRatio: 0.8,
      media: { 
        type: 'image', 
        order: 13, 
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F02-Cacau%2F01.jpg?alt=media&token=69f2ca5c-aba6-4578-a103-ca1158c5adbd'
      },
      stories: [
        { id: 'eb-s02-14', type: 'image', order: 14, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F02-Cacau%2FDia01.jpg?alt=media&token=62187d4a-208e-4ad0-8355-3091d80082aa' },
        { id: 'eb-s02-15', type: 'image', order: 15, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F02-Cacau%2FDia02.jpg?alt=media&token=bc47bbc0-0135-49a5-8614-1bd06708f425' },
        { id: 'eb-s02-16', type: 'image', order: 16, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F02-Cacau%2FDia03.jpg?alt=media&token=5c6d3b4b-cdab-402f-804e-4c353c7a4968' },
        { id: 'eb-s02-17', type: 'image', order: 17, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F02-Cacau%2FDia04.jpg?alt=media&token=e90c9853-cec9-4dfd-a078-c653de7f2172' },
        { id: 'eb-s02-18', type: 'image', order: 18, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F02-Cacau%2FDia05.jpg?alt=media&token=9654f369-116a-4a97-95b8-8a4bdd2f237b' },
        { id: 'eb-s02-19', type: 'image', order: 19, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F02-Cacau%2FDia06.jpg?alt=media&token=bb88bac7-8def-4aa9-b2e8-093bcca01a7a' },
        { id: 'eb-s02-20', type: 'image', order: 20, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F02-Cacau%2FDia07.jpg?alt=media&token=210d975c-8e3d-464c-bab2-53c5a6c686b5' },
        { id: 'eb-s-indica-01', type: 'image', order: 21, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F04-EloIndica%2F01.jpg?alt=media&token=d7802010-5112-489a-8c3a-93722a6c349e' },
        { id: 'eb-s-indica-02', type: 'image', order: 22, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F04-EloIndica%2F02.jpg?alt=media&token=9ca2e2f1-f44e-4268-a76e-df2226d4563b' },
        { id: 'eb-s-indica-03', type: 'image', order: 23, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F04-EloIndica%2F03.jpg?alt=media&token=71254303-800a-4471-be5f-64b227c7c5f8' },
        { id: 'eb-s-indica-04', type: 'image', order: 24, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F04-EloIndica%2F04.jpg?alt=media&token=1fc84ecd-0d82-4748-bfa6-ac953b4ee651' },
        { id: 'eb-s-indica-05', type: 'image', order: 25, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F04-EloIndica%2F05.jpg?alt=media&token=4b57a143-5ddf-4a74-bdbb-fd5275cf8f7f' },
        { id: 'eb-s-indica-06', type: 'image', order: 26, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F04-EloIndica%2F06.jpg?alt=media&token=596d93fb-2601-48d1-8c0c-492c2c9ba992' },
        { id: 'eb-s-indica-07', type: 'image', order: 27, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F04-EloIndica%2F07.jpg?alt=media&token=c5577db4-3633-4ac3-997a-3a39b2d0e89b' }
      ]
    }
  ]
};

export const LION_JUMP_PROJECT: Project = {
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
    {
      id: 'lj-feed-02-gshow',
      title: 'GShow 2',
      aspectRatio: 1.77777777778,
      media: {
        type: 'image',
        order: 4,
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F02-SobreBanda%2FGShow2%2FGShow2.png?alt=media&token=01436ae3-a62b-4c08-b16d-ec93cae2f3a8',
        allowScroll: true
      }
    },
    // Seção 03: SuperStar
    {
      id: 'lj-feed-03',
      title: 'SuperStar',
      aspectRatio: 1.77777777778,
      media: { 
        type: 'image', 
        order: 6, 
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F03-SuperStar%2FCapaSuperStar.png?alt=media&token=4eb58609-525a-4e49-aaa6-ad046da90beb',
      }
    },
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
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F03-SuperStar%2FLionJump_superstarApresenta%C3%A7%C3%A3o.mp4?alt=media&token=c49c92a3-58b4-4c81-a083-344ce4bb1e25',
        objectFit: 'cover'
      }
    },
    // Seção 04: África
    {
      id: 'lj-feed-04',
      title: 'África',
      aspectRatio: 1.77777777778,
      media: { 
        type: 'image',
        order: 9,
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F04-Africa%2FBanner_Lan%C3%A7amento_AFRICA_04.png?alt=media&token=0da585e6-641b-493e-ac1d-0a3d4d3ac928',
        objectFit: 'cover',
        objectPosition: 'right'
      }
    },
    {
      id: 'lj-feed-04-video1',
      title: 'Clip África',
      aspectRatio: 1.77777777778,
      media: {
        type: 'video',
        order: 10,
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F04-Africa%2FClip_%C3%81frica.mp4?alt=media&token=47f294c8-6420-4b82-9ad9-9a6efd332cd1',
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
      id: 'lj-feed-04-pdf',
      title: 'PDF África',
      aspectRatio: 1.77777777778,
      media: {
        type: 'pdf',
        order: 12,
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F04-Africa%2FEmMovimentoAfrica.pdf?alt=media&token=d63690d8-651a-4ebe-90bf-6ba337fbb5d2',
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

export const AUDDAR_PROJECT: Project = {
  id: 'projeto-auddar',
  title: 'Auddar',
  description: 'Estratégia e Gestão de Conteúdo para Techospitality.',
  layoutType: 'vertical',
  galleryThumbnail: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F04-Parceria.png?alt=media&token=88d95213-2428-441a-8b02-587733d0cfae',
  coverImage: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F04-Parceria.png?alt=media&token=88d95213-2428-441a-8b02-587733d0cfae',
  order: 4,
  mediaItems: [],
  theme: {
    accentColor: '#172554',
    playerBg: 'bg-zinc-950',
    playerBorder: 'border-[#172554]/60',
    playerShadow: 'shadow-[0_0_50px_rgba(23,37,84,0.4)] animate-neon-pulse',
    navButtonBg: 'bg-[#172554]/60',
    navButtonColor: 'text-white',
    playerWidth: 960,
    playerHeight: 540,
    borderWidth: '1px',
    borderRadius: '8px'
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
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F04-Parceria.png?alt=media&token=88d95213-2428-441a-8b02-587733d0cfae',
        allowScroll: true,
        zoom: 1.01
      }
    },
    {
      id: 'auddar-05',
      title: 'E-mail Marketing',
      aspectRatio: 0.8,
      media: {
        type: 'image',
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F05-Email.png?alt=media&token=b4a3b159-284e-463f-9de8-8075862e73c7',
        allowScroll: true,
        zoom: 1.01
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

export const SCALLA_RECORDS_PROJECT: Project = {
  id: 'projeto-scalla-records',
  title: 'Scalla Records',
  description: 'Projeto em construção.',
  status: 'draft',
  layoutType: 'vertical',
  galleryThumbnail: '',
  coverImage: '',
  order: 6,
  mediaItems: [],
  theme: {
    accentColor: '#444444',
    playerBg: 'bg-zinc-900',
    playerBorder: 'border-zinc-800',
    playerWidth: 304,
    playerHeight: 540,
    borderWidth: '1px',
    borderRadius: '12px'
  },
  aboutConfig: {
    title: 'Scalla Records',
    description: 'Em breve: Uma nova visão sobre a indústria fonográfica e produção musical. \n\nAguarde o lançamento de um projeto que une técnica, criatividade e uma gestão de conteúdo focada na identidade única de cada artista.',
    ctaText: 'Aguarde',
    width: 'max-w-md',
    backgroundColor: 'bg-zinc-900/90',
    textColor: 'text-white',
    ctaColor: 'bg-zinc-700',
    ctaTextColor: 'text-white'
  },
  feed: []
};

export const PROJECTS_LIST: Project[] = [
  METAVIX_PROJECT, 
  ELOBIKE_PROJECT,
  GOOD_STORAGE_PROJECT, 
  AUDDAR_PROJECT,
  LION_JUMP_PROJECT,
  SCALLA_RECORDS_PROJECT
];
