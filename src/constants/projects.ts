import { Project } from '../types';

export const METAVIX_PROJECT: Project = {
  id: 'projeto-metavix',
  title: 'Projeto Metavix',
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
    navButtonBg: 'bg-[#00D154]/35'
  },
  feed: [
    { id: 'f01', aspectRatio: 0.56, media: { type: 'video', order: 1, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F01.mp4?alt=media&token=19f0b135-718b-4e94-82a1-c5d1e080005c' } },
    { id: 'f02', aspectRatio: 0.56, media: { type: 'video', order: 2, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F03.mp4?alt=media&token=f9d51d7a-966c-4cc6-872a-8ce22d492b54' } },
    { id: 'f03', aspectRatio: 0.56, media: { type: 'video', order: 3, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F04.mp4?alt=media&token=27704524-5b1d-4835-9ac0-10033ff1078b' } },
    { id: 'f04', aspectRatio: 0.56, media: { type: 'video', order: 4, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F05.mp4?alt=media&token=523b5061-5011-401c-8c14-e7708433dbe8' } },
    { id: 'f05', aspectRatio: 0.56, media: { type: 'video', order: 5, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F07.mp4?alt=media&token=675083eb-6534-4f61-bc3f-fc9b94786543' } },
    { id: 'f06', aspectRatio: 0.56, media: { type: 'video', order: 6, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F09.mp4?alt=media&token=3d656f3d-ad65-4f85-a921-6cbba0a2a3ab' } },
    { id: 'f07', aspectRatio: 0.56, media: { type: 'video', order: 7, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F18.mp4?alt=media&token=bc96c55d-0895-4c6a-a24f-b29c8aa7385d' } },
    { id: 'f08', aspectRatio: 0.56, media: { type: 'video', order: 8, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F23.mp4?alt=media&token=51c2e65d-3939-473f-8cc3-fcebb527f293' } },
    { id: 'f09', aspectRatio: 0.56, media: { type: 'video', order: 9, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F25.mp4?alt=media&token=044b72a8-90f3-4fa3-a735-a2828e3782df' } },
    { id: 'f10', aspectRatio: 0.56, media: { type: 'video', order: 10, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F27.mp4?alt=media&token=a7d800d2-1ee9-42f6-9f1e-056047929dac' } },
    { id: 'f11', aspectRatio: 0.56, media: { type: 'video', order: 11, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F28.mp4?alt=media&token=41b0d434-4cc8-4fa7-b427-9f6b7d58aefc' } },
    { id: 'f12', aspectRatio: 0.56, media: { type: 'video', order: 12, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FVideos%2F29.mp4?alt=media&token=0d19ec59-bfb1-47d9-9eaf-1dddb59425ac' } },
    {
      id: 'f13-dekki',
      aspectRatio: 0.80,
      media: { type: 'image', order: 13, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FDekki%2F01.jpg?alt=media&token=84b15674-9ffd-4bd6-b6e3-8fcc20132791' },
      stories: [
        { type: 'image', order: 14, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FDekki%2F02.jpg?alt=media&token=04e14351-2f8f-4140-90a8-072dfcdddef0' },
        { type: 'image', order: 15, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FDekki%2F03.jpg?alt=media&token=6362e633-b812-41f4-823b-f806defe9829' },
        { type: 'image', order: 16, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FDekki%2F04.jpg?alt=media&token=d6f3f79b-c316-4ffc-9749-0842533c1de5' },
        { type: 'image', order: 17, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FDekki%2F05.jpg?alt=media&token=e32c4695-ed32-4392-aaee-010aabf1074d' },
        { type: 'image', order: 18, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FDekki%2F06.jpg?alt=media&token=b342008d-d088-45df-945c-608f922409de' },
        { type: 'image', order: 19, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FDekki%2F07.jpg?alt=media&token=461c4857-aa7e-48cd-a1d0-34bbb0757561' }
      ]
    },
    {
      id: 'f20-sushi',
      aspectRatio: 0.80,
      media: { type: 'image', order: 20, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Sushi%2F01.jpg?alt=media&token=5f95fd80-1877-4f56-9512-d933a67679f3' },
      stories: [
        { type: 'image', order: 21, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Sushi%2F02.jpg?alt=media&token=7b7e9d51-1520-45f3-9d7f-a74651627e81' },
        { type: 'image', order: 22, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Sushi%2F03.jpg?alt=media&token=b5e9861a-0c9b-428e-aa64-00f4c2ded8e3' },
        { type: 'image', order: 23, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Sushi%2F04.jpg?alt=media&token=1b1c07bc-cbf2-4e05-a1a5-b3e2ee5754e4' },
        { type: 'image', order: 24, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Sushi%2F05.jpg?alt=media&token=3c787220-a41e-49a5-b36a-124f4c5df147' },
        { type: 'image', order: 25, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Sushi%2F06.jpg?alt=media&token=12f4b6c3-16d2-456c-9837-07f8c23d2286' },
        { type: 'image', order: 26, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Sushi%2F07.jpg?alt=media&token=8434379d-76f8-467e-8d36-44dfa1a57ce9' }
      ]
    },
    {
      id: 'f27-ambiente',
      aspectRatio: 0.80,
      media: { type: 'image', order: 27, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Ambiente%2F01.jpg?alt=media&token=fe2b8ed0-671a-45b3-89ee-fca87037e006' },
      stories: [
        { type: 'image', order: 28, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Ambiente%2F02.jpg?alt=media&token=c07dc69c-05a0-45bc-ada1-be3cf7981bd1' },
        { type: 'image', order: 29, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Ambiente%2F03.jpg?alt=media&token=d5f666c5-373c-4a72-b5ab-0c035574a076' },
        { type: 'image', order: 30, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Ambiente%2F04.jpg?alt=media&token=49c4ea31-f560-4a2b-a961-f339df1e3a3d' },
        { type: 'image', order: 31, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Ambiente%2F05.jpg?alt=media&token=22824c2a-db92-4c18-9b41-ad553249e9d7' },
        { type: 'image', order: 32, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Ambiente%2F06.jpg?alt=media&token=21bc0827-0897-4d5d-a2f4-a23036edd7d1' },
        { type: 'image', order: 33, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Ambiente%2F07.jpg?alt=media&token=311d5b1e-7cb7-468c-a2ad-03f86bace21f' },
        { type: 'image', order: 34, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Ambiente%2F08.jpg?alt=media&token=7b9b3423-2061-40f0-9466-76b481ea456c' },
        { type: 'image', order: 35, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto1%2FFotos%2FBanzai-Ambiente%2F09.jpg?alt=media&token=e3334b58-5a72-4f33-9d6c-11759c107879' }
      ]
    },
  ]
};

export const GOOD_STORAGE_PROJECT: Project = {
  id: 'projeto-good-storage',
  title: 'Good Storage',
  description: 'Trabalho cinematográfico focado em organização e espaço.',
  layoutType: '2d',
  galleryThumbnail: '',
  coverImage: '',
  audioUrl: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Trilha%2FMetavix.mp3?alt=media&token=866a461d-6169-450f-90e9-74cb96e95b00',
  order: 2,
  mediaItems: [],
  theme: {
    accentColor: '#00D154',
    playerBorder: 'border-white/10',
    navButtonBg: 'bg-[#00D154]/35'
  },
  feed: [
    { id: 'gs-01', aspectRatio: 0.56, media: { type: 'video', order: 1, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2FVideos%2FEloBike_01.mp4?alt=media&token=8eb6b3d4-8d4e-4f3b-8b9a-7c9d6e5f4a3b' } },
    { id: 'gs-02', aspectRatio: 0.56, media: { type: 'video', order: 2, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2FVideos%2FEloBike_02.mp4?alt=media&token=7d5c4b3a-9e8d-4f2c-1a0b-9c8d7e6f5a4b' } },
    { id: 'gs-03', aspectRatio: 0.56, media: { type: 'video', order: 3, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2FVideos%2FEloBike_03.mp4?alt=media&token=6b5a4d3c-2e1f-0b9a-8c7d-6e5f4a3b2c1d' } }
  ]
};

export const ELOBIKE_PROJECT: Project = {
  id: 'projeto-elobike',
  title: 'EloBike',
  description: 'Uma jornada de cicloturismo explorando belas paisagens e histórias.',
  layoutType: '2d',
  galleryThumbnail: '',
  coverImage: '',
  audioUrl: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Trilha%2FMetavix.mp3?alt=media&token=866a461d-6169-450f-90e9-74cb96e95b00',
  order: 3,
  mediaItems: [],
  theme: {
    accentColor: '#00D154',
    playerBorder: 'border-white/10',
    navButtonBg: 'bg-[#00D154]/35'
  },
  feed: [
    {
      id: 'eb-marau',
      aspectRatio: 0.80,
      media: { type: 'video', order: 1, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F01-Marau%2F00.mp4?alt=media&token=60a6fe52-c33c-41f5-a2aa-65c2b842af15' },
      stories: [
        { type: 'image', order: 2, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F01-Marau%2F01-Marau.jpg?alt=media&token=4d54362a-0846-47e3-a6d4-d61b41b1cbd3' },
        { type: 'image', order: 3, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F01-Marau%2FDia01.jpg?alt=media&token=4c4013a9-befb-4640-92ba-3e670984edb8' },
        { type: 'image', order: 4, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F01-Marau%2FDia02.jpg?alt=media&token=c5ceeef4-760d-4a12-82a2-4e09f1e1a2b0' },
        { type: 'image', order: 5, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F01-Marau%2FDia03.jpg?alt=media&token=a128f4c7-1ea7-439d-93cc-84a878fd3b46' },
        { type: 'image', order: 6, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F01-Marau%2FDia04.jpg?alt=media&token=3a65065f-8cf5-4c71-929e-53549481fb47' },
        { type: 'image', order: 7, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F01-Marau%2FDia05.jpg?alt=media&token=d59eec19-db47-42a9-a67e-3159dbfebc4e' },
        { type: 'image', order: 8, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F01-Marau%2FDia06.jpg?alt=media&token=13eedb37-6252-4b95-9a45-29e90b3d73fe' },
        { type: 'image', order: 9, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F01-Marau%2FDia07.jpg?alt=media&token=7014c649-7fb1-4798-8515-8546a2abac19' },
        { type: 'image', order: 10, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F01-Marau%2FDia08.jpg?alt=media&token=3b71f199-785c-4031-96ff-5a41afc1da6b' },
        { type: 'image', order: 11, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F01-Marau%2FHospedagem.jpg?alt=media&token=7e5110ec-889b-4893-ad3f-761f093ae323' }
      ]
    },
    {
      id: 'eb-cacau',
      aspectRatio: 0.80,
      media: { type: 'video', order: 12, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F02-Cacau%2F00.mp4?alt=media&token=3e83b1ef-0676-4adb-a08e-052e6c6dbe0a' },
      stories: [
        { type: 'image', order: 13, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F02-Cacau%2F01.jpg?alt=media&token=69f2ca5c-aba6-4578-a103-ca1158c5adbd' },
        { type: 'image', order: 14, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F02-Cacau%2FDia01.jpg?alt=media&token=62187d4a-208e-4ad0-8355-3091d80082aa' },
        { type: 'image', order: 15, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F02-Cacau%2FDia02.jpg?alt=media&token=bc47bbc0-0135-49a5-8614-1bd06708f425' },
        { type: 'image', order: 16, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F02-Cacau%2FDia03.jpg?alt=media&token=5c6d3b4b-cdab-402f-804e-4c353c7a4968' },
        { type: 'image', order: 17, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F02-Cacau%2FDia04.jpg?alt=media&token=e90c9853-cec9-4dfd-a078-c653de7f2172' },
        { type: 'image', order: 18, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F02-Cacau%2FDia05.jpg?alt=media&token=9654f369-116a-4a97-95b8-8a4bdd2f237b' },
        { type: 'image', order: 19, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F02-Cacau%2FDia06.jpg?alt=media&token=bb88bac7-8def-4aa9-b2e8-093bcca01a7a' },
        { type: 'image', order: 20, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F02-Cacau%2FDia07.jpg?alt=media&token=210d975c-8e3d-464c-bab2-53c5a6c686b5' }
      ]
    },
    {
      id: 'eb-viajar',
      aspectRatio: 0.80,
      media: { type: 'image', order: 21, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F03-ViajarSozinha%2F01.jpg?alt=media&token=eb3f3aab-792f-4243-ba7a-85a39e5168a4' },
      stories: [
        { type: 'image', order: 22, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F03-ViajarSozinha%2F02.jpg?alt=media&token=9029dcf8-4cd6-48f9-a359-a90d82adc272' },
        { type: 'image', order: 23, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F03-ViajarSozinha%2F03.jpg?alt=media&token=833d7830-4754-4f3b-a5fe-8fb0975ca12e' },
        { type: 'image', order: 24, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F03-ViajarSozinha%2F04.jpg?alt=media&token=8b576951-4c76-4bb4-b624-528abe04c5a0' },
        { type: 'image', order: 25, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F03-ViajarSozinha%2F05.jpg?alt=media&token=783b2f2d-6028-4d9d-8145-e016df0a3fd8' },
        { type: 'image', order: 26, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F03-ViajarSozinha%2F06.jpg?alt=media&token=83f87512-fe9b-4bd3-9959-fa07ba49d733' },
        { type: 'image', order: 27, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F03-ViajarSozinha%2F07.jpg?alt=media&token=c24521d2-7b58-4c77-b5ee-30fa40facaa6' }
      ]
    },
    {
      id: 'eb-indica',
      aspectRatio: 0.80,
      media: { type: 'image', order: 28, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F04-EloIndica%2F00.jpg?alt=media&token=7d14ff63-f81a-4a96-9a8d-d8382158149f' },
      stories: [
        { type: 'image', order: 29, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F04-EloIndica%2F01.jpg?alt=media&token=d7802010-5112-489a-8c3a-93722a6c349e' },
        { type: 'image', order: 30, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F04-EloIndica%2F02.jpg?alt=media&token=9ca2e2f1-f44e-4268-a76e-df2226d4563b' },
        { type: 'image', order: 31, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F04-EloIndica%2F03.jpg?alt=media&token=71254303-800a-4471-be5f-64b227c7c5f8' },
        { type: 'image', order: 32, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F04-EloIndica%2F04.jpg?alt=media&token=1fc84ecd-0d82-4748-bfa6-ac953b4ee651' },
        { type: 'image', order: 33, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F04-EloIndica%2F05.jpg?alt=media&token=4b57a143-5ddf-4a74-bdbb-fd5275cf8f7f' },
        { type: 'image', order: 34, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F04-EloIndica%2F06.jpg?alt=media&token=596d93fb-2601-48d1-8c0c-492c2c9ba992' },
        { type: 'image', order: 35, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F04-EloIndica%2F07.jpg?alt=media&token=c5577db4-3633-4ac3-997a-3a39b2d0e89b' },
        { type: 'image', order: 36, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F04-EloIndica%2F08.jpg?alt=media&token=cd48cdc9-0d01-410c-b7b8-3af05b4ac9c3' },
        { type: 'image', order: 37, url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2F04-EloIndica%2F09.jpg?alt=media&token=530f5e94-128e-4ddc-8a4e-18e37b467d44' }
      ]
    }
  ]
};

export const LION_JUMP_PROJECT: Project = {
  id: 'projeto-lion-jump',
  title: 'Projeto Lion Jump',
  description: 'Lion Jump: Campanha de Lançamento e Divulgação Artística.',
  layoutType: 'vertical',
  galleryThumbnail: '',
  coverImage: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F01-SobreProjeto%2FCapaLionJump.png?alt=media&token=ef2677d3-ab36-4eb2-a2e9-7991754fb7f4',
  audioUrl: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Trilha%2FMetavix.mp3?alt=media&token=866a461d-6169-450f-90e9-74cb96e95b00',
  order: 4,
  mediaItems: [],
  theme: {
    accentColor: '#FEF200',
    playerBg: 'bg-black',
    playerBorder: 'border-[#FEF200]/40',
    playerShadow: 'shadow-[0_0_50px_rgba(254,242,0,0.25)] animate-pulse',
    navButtonBg: 'bg-[#FEF200]/40',
    navButtonColor: 'text-black'
  },
  feed: [
    {
      id: 'lj-feed-01',
      title: 'Sobre o Projeto',
      aspectRatio: 1.77777777778,
      media: { 
        type: 'image', 
        order: 1, 
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F01-SobreProjeto%2FCapaLionJump.png?alt=media&token=ef2677d3-ab36-4eb2-a2e9-7991754fb7f4',
        zoom: 1.1,
        yOffset: -12
      },
      stories: [
        {
          id: 'card-02',
          type: 'image',
          order: 2,
          url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F01-SobreProjeto%2FTextoProjeto.png?alt=media&token=c064b8fb-c83f-48fb-bb27-939475c9b3a6',
          allowScroll: true
        }
      ]
    },
    {
      id: 'lj-feed-02',
      title: 'Sobre a Banda',
      aspectRatio: 1.77777777778,
      media: { 
        type: 'image', 
        order: 3, 
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F02-SobreBanda%2FCapaBanda.png?alt=media&token=e1bddd4b-093a-46fd-a1a4-4fb82633288c',
        zoom: 1.1,
        yOffset: -12
      },
      stories: [
        {
          id: 'card-04',
          type: 'image',
          order: 4,
          url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F02-SobreBanda%2FGShow2%2FGShow2.png?alt=media&token=01436ae3-a62b-4c08-b16d-ec93cae2f3a8',
          allowScroll: true
        },
        {
          id: 'card-05',
          type: 'video',
          order: 5,
          url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F02-SobreBanda%2FNaGaragem.mp4?alt=media&token=46be8878-67a9-4304-b33a-4b56d11a973a',
          objectFit: 'contain'
        }
      ]
    },
    {
      id: 'lj-feed-03',
      title: 'SuperStar',
      aspectRatio: 1.77777777778,
      media: { 
        type: 'image', 
        order: 6, 
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F03-SuperStar%2FCapaSuperStar.png?alt=media&token=4eb58609-525a-4e49-aaa6-ad046da90beb',
        zoom: 1.05,
        yOffset: 0,
        xOffset: -5
      },
      stories: [
        {
          id: 'card-07',
          type: 'image',
          order: 7,
          url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F03-SuperStar%2FGShow1%2FGShow1.png?alt=media&token=39148d2c-02c9-4156-beeb-5ef15cfc1841',
          allowScroll: true
        },
        {
          id: 'card-08',
          type: 'video',
          order: 8,
          url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F03-SuperStar%2FLionJump_superstarApresenta%C3%A7%C3%A3o.mp4?alt=media&token=c49c92a3-58b4-4c81-a083-344ce4bb1e25',
          objectFit: 'contain'
        }
      ]
    },
    {
      id: 'lj-feed-04',
      title: 'África',
      aspectRatio: 1.77777777778,
      media: { 
        type: 'image',
        order: 9,
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F04-Africa%2FBanner_Lan%C3%A7amento_AFRICA_04.png?alt=media&token=0da585e6-641b-493e-ac1d-0a3d4d3ac928',
        zoom: 1.12,
        xOffset: -40,
        objectFit: 'contain'
      },
      stories: [
        {
          id: 'card-10',
          type: 'video',
          order: 10,
          url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F04-Africa%2FClip_%C3%81frica.mp4?alt=media&token=47f294c8-6420-4b82-9ad9-9a6efd332cd1',
          objectFit: 'contain'
        },
        {
          id: 'card-11',
          type: 'video',
          order: 11,
          url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F04-Africa%2FEmMovimentoAfrica.mp4?alt=media&token=75dcf0b9-53aa-4601-9267-e87c8c74e747',
          objectFit: 'contain'
        },
        {
          id: 'card-12',
          type: 'image',
          order: 12,
          url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F04-Africa%2FEmMovimentoAfrica.png?alt=media&token=d63690d8-651a-4ebe-90bf-6ba337fbb5d2',
          allowScroll: true,
          aspectRatio: 1.77777777778
        }
      ]
    },
    {
      id: 'lj-feed-05',
      title: 'Itália',
      aspectRatio: 1.77777777778,
      media: { 
        type: 'image', 
        order: 13, 
        url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F05-Italia%2FCapaItalia.png?alt=media&token=21f53070-5798-4113-b692-1fa42cdb7abd',
        objectFit: 'contain'
      },
      stories: [
        {
          id: 'card-14',
          type: 'image',
          order: 14,
          url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F05-Italia%2FGShow%2FGShow.png?alt=media&token=35baa827-2dde-4813-8d33-bd1e415e6d2e',
          allowScroll: true
        },
        {
          id: 'card-15',
          type: 'video',
          order: 15,
          url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto4%2F05-Italia%2FOlhosDeTodasAsCores.mp4?alt=media&token=c7f637dc-85e1-434c-968a-e9dfcf12ac0a',
          objectFit: 'contain'
        }
      ]
    }
  ]
};

export const AUDDAR_PROJECT: Project = {
  id: 'projeto-auddar',
  title: 'Auddar',
  description: 'Estratégia e Gestão de Conteúdo para Techospitality.',
  layoutType: 'horizontal',
  galleryThumbnail: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F01-Capa.jpg?alt=media&token=ce795f6e-1aea-4fa7-8f93-d6797b6a2450',
  coverImage: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F01-Capa.jpg?alt=media&token=ce795f6e-1aea-4fa7-8f93-d6797b6a2450',
  order: 6,
  mediaItems: [],
  theme: {
    accentColor: '#2563eb',
    playerBg: 'bg-zinc-950',
    playerBorder: 'border-[#2563eb]/60',
    playerShadow: 'shadow-[0_0_50px_rgba(37,99,235,0.4)] animate-pulse'
  },
  feed: []
};

export const PROJECTS_LIST: Project[] = [
  METAVIX_PROJECT, 
  GOOD_STORAGE_PROJECT, 
  ELOBIKE_PROJECT, 
  LION_JUMP_PROJECT,
  AUDDAR_PROJECT
];
