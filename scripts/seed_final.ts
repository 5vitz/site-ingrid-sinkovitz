import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

const elobikeVideos = [
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F01.mp4?alt=media&token=8fc725cf-90f7-41a6-98ed-773df4ea20f8",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F02.mp4?alt=media&token=e858db1f-298a-40a2-9721-6f015b6de23c",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F05.mp4?alt=media&token=60a373ca-05e8-46dc-a739-e47e30737a28",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F06.mp4?alt=media&token=36a0fb4f-6d0b-46cb-84fb-4f243be4c5e3",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F08.mp4?alt=media&token=bc8c6913-c918-472d-8bed-a83d35ae6786",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F11.mp4?alt=media&token=54ec5a6c-9c7f-4318-9717-36e6ba90022d",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F12.mp4?alt=media&token=e83e9b62-671c-403d-82d2-8b6b21c43552",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F13.mp4?alt=media&token=4289874a-2f47-49f3-8f08-8e6d1cde0550",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F14.mp4?alt=media&token=38520fdc-5989-4fc3-b295-d2abbb0439e0",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F16.mp4?alt=media&token=8f0ac23a-fcf7-4f6c-9eb9-be8f66858e72",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F17.mp4?alt=media&token=67b12d76-96b0-4663-b1da-35bc87b5a837",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F18.mp4?alt=media&token=67290bc5-6a84-486a-8b83-a9ae34eb99f6",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F19.mp4?alt=media&token=ae86bc3c-c9fa-4f51-b883-ec19572ef6d8",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto2%2FVideos%2F22.mp4?alt=media&token=4eb0814c-1e64-4e2b-8a8b-df174a787cd5"
];

const gsVideos = [
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2FVideos%2F01.mp4?alt=media&token=8eb6b3d4-8d4e-4f3b-8b9a-7c9d6e5f4a3b",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2FVideos%2F02.mp4?alt=media&token=7d5c4b3a-9e8d-4f2c-1a0b-9c8d7e6f5a4b",
  "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto3%2FVideos%2F03.mp4?alt=media&token=6b5a4d3c-2e1f-0b9a-8c7d-6e5f4a3b2c1d"
];

async function seed() {
  try {
    // 1. Projects
    await setDoc(doc(db, 'projects', 'goodstorage-projeto'), {
      id: 'goodstorage-projeto',
      title: 'GoodStorage (Oficial)',
      description: 'GoodStorage - Soluções Inteligentes de Armazenamento\nGestão de conteúdo estratégico para expansão de marca.',
      layoutType: 'vertical',
      galleryThumbnail: 'https://picsum.photos/seed/gs-oficial/800/1200',
      coverImage: 'https://picsum.photos/seed/gs-cover-oficial/1920/1080',
      thumbnailFit: 'cover',
      order: 2,
      mediaItems: gsVideos.map((url, i) => ({ type: 'video', url, order: i }))
    });

    await setDoc(doc(db, 'projects', 'elobike-projeto'), {
      id: 'elobike-projeto',
      title: 'EloBike (Oficial)',
      description: 'EloBike - Mobilidade e Estilo de Vida Urbano\nProdução Audiovisual com foco em Motion e Performance.\nNavegação Híbrida (Horizontal/Vertical).',
      layoutType: 'horizontal',
      galleryThumbnail: 'https://picsum.photos/seed/elobike-oficial/1200/800',
      coverImage: 'https://picsum.photos/seed/elobike-cover-oficial/1920/1080',
      thumbnailFit: 'cover',
      order: 3,
      mediaItems: elobikeVideos.map((url, i) => ({ type: 'video', url, order: i }))
    });

    // 2. Settings (Normalizing)
    const aboutData = {
      description: `Eu sou a Ingrid, e minha trajetória na comunicação nunca foi linear.
Comecei na rádio, passei pela televisão, mergulhei na produção audiovisual, vivi projetos que chegaram à TV Globo e até uma turnê internacional. Mais tarde, empreendi no setor gastronômico, onde, além de gerir um negócio, também fui responsável por construir e posicionar a marca.
Cada uma dessas experiências me colocou em lugares diferentes da comunicação: na frente das câmeras, nos bastidores, na operação, na estratégia.
E foi exatamente isso que moldou a forma como eu enxergo o que faço hoje.
Eu não vejo conteúdo como uma peça isolada. Nem estratégia como algo que existe só no planejamento.
Pra mim, comunicação é um sistema. É entender contexto, intenção, público, narrativa e fazer tudo isso se conectar de forma coerente, consistente e sustentável ao longo do tempo.
Por isso, o meu trabalho não se limita à criação.
Eu entro nos projetos para organizar, estruturar e dar direção. Trago clareza para marcas que muitas vezes já têm presença, mas não têm consistência. Transformo ideias soltas em uma narrativa sólida. E acompanho de perto a execução para garantir que aquilo que foi pensado realmente aconteça com qualidade e alinhamento.
Hoje, atuo como gestora e estrategista de conteúdo, com uma visão ampla de todo o processo. Minha forma de trabalhar é atravessada por tudo o que eu já vivi: diferentes formatos, diferentes mercados, diferentes perspectivas.
E é justamente isso que me permite enxergar além do óbvio e construir algo que não seja só bonito ou bem planejado, mas que faça sentido.
Não é só produzir conteúdo, é construir percepção.`,
      videoUrl: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/SobreMim%2FSobreMim.mp4?alt=media&token=ff5c966d-15e2-489f-bedf-f47a1426a7fd'
    };

    await setDoc(doc(db, 'about', 'sobre_mim'), aboutData);
    await setDoc(doc(db, 'settings', 'global'), {
      accentColor: '#D4AF37',
      whatsappNumber: '5527999193525'
    });

    console.log('Final seed completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Final seed failed:', err);
    process.exit(1);
  }
}

seed();
