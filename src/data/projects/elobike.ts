import { Project } from '../../types';

export const elobike: Project = {
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
