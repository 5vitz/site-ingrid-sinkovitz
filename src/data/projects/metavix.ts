import { Project } from '../../types';

export const metavix: Project = {
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
