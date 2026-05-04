
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


  try {
    await setDoc(doc(db, 'projects', projectId), auddarData, { merge: true });
    console.log('Project Auddar seeded successfully with correct URLs');
  } catch (error) {
    console.error('Error seeding Auddar:', error);
  }
};

export const seedTestimonials = async () => {
  const testimonials = [
    {
      id: 'testimonial-1',
      author: "Paulo Buzzo",
      role: "Gestor Comercial | Growth | IA",
      text: "Tive a honra de ter a Ingrid na equipe comercial da Auddar. Ela muito além do esperado, cuidando da comunicação interna, eventos e transformando as redes sociais, criando um planejamento estratégico de brilhar os olhos. Sempre proativa e cheia de ideias, destaco sua energia e dedicação inspiraram a todos ao redor.Ela é contagiante! Foi um privilégio ter Ingrid no time, e sei que onde ela estiver, trará sempre excelentes resultados e boas vibrações!",
      photoUrl: "https://lh3.googleusercontent.com/d/1gOBdoaCX4zcS1xfMYbi-LTtZ_2WFeIva",
      order: 1
    },
    {
      id: 'testimonial-2',
      author: "Karina Redivo",
      role: "Coordinadora de Marketing",
      text: "A Ingrid é uma profissional multifuncional, muito dedicada, organizada e com senso de resolução incrível. Durante o time em que atuou como Social Media em nosso time de marketing, ela trouxe ideias fantásticas, ajudou a aprimorar processos de rotina conforme as necessidades do setor e estava sempre disposta a realizar tudo com responsabilidade e empenho. Linda, alegre, cativante, serena, cuidadosa com as entregas e resultados! Foi um prazer ter a Ingrid em nosso time. Simplesmente maravilhosa!",
      photoUrl: "https://lh3.googleusercontent.com/d/1BkSIA3AFFHwMutkS8FVjOnImhIkPq92A",
      order: 2
    },
    {
      id: 'testimonial-3',
      author: "Guilherme Bressan",
      role: "Creative Director at Estoriah",
      text: "Tive o prazer de trabalhar com a Guigui em minha Produtora de Narrativas em 2022 e 2023. Uma pessoa muito carismática e de excelente comunicação que se destacava sempre por sua versatilidade e habilidade multitask. Além de Produtora Executiva, atuou como Assistente de Direção, acompanhando todas as etapas de produção de conteúdo sempre com uma postura proativa, pontualidade e uma capacidade impressionante de coordenação de equipe. Ela foi essencial em todas as etapas do processo: desde a gestão de produção, atendimento, visita técnica, até a coordenação da equipe envolvida.",
      photoUrl: "https://lh3.googleusercontent.com/d/1rmHzyu5fdTHMGj6a30KQxElstZ78UGDS",
      order: 3
    }
  ];

  for (const t of testimonials) {
    try {
      await setDoc(doc(db, 'testimonials', t.id), t, { merge: true });
    } catch (error) {
      console.error(`Error seeding testimonial ${t.author}:`, error);
    }
  }
};
