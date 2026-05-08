import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Static Data Imports
import { PROJECTS_LIST } from '../src/constants/projects';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function migrate() {
  console.log('Iniciando migração...');

  try {
    // 1. Projects
    console.log('Migrando projetos...');
    for (const project of PROJECTS_LIST) {
      // Remover undefined para evitar erro no Firestore
      const cleanProject = JSON.parse(JSON.stringify(project));
      await setDoc(doc(db, 'projects', project.id), {
        ...cleanProject,
        status: 'published'
      });
      console.log(`Projeto migrate: ${project.title}`);
    }

    // 2. Services (Extracted from ServicesSection.tsx previous view)
    const services = [
      {
        id: 'estrategia',
        title: "Estratégia & Posicionamento",
        order: 1,
        items: [
          "Planejamento estratégico de conteúdo para redes sociais",
          "Construção de narrativa, tom de voz e storytelling da marca",
          "Desenvolvimento de linha editorial alinhada ao posicionamento",
          "Pesquisa, benchmarking e análise de mercado"
        ]
      },
      {
        id: 'planejamento',
        title: "Planejamento & Execução",
        order: 2,
        items: [
          "Planejamento e gestão de calendário editorial",
          "Criação de pautas, roteiros e briefings para produção de conteúdo",
          "Desenvolvimento e coordenação de campanhas digitais"
        ]
      },
      {
        id: 'gestao',
        title: "Gestão & Coordenação",
        order: 3,
        items: [
          "Coordenação, direcionamento e apoio a times de social media e criação",
          "Organização de fluxos de trabalho e processos de produção de conteúdo",
          "Monitoramento da qualidade das entregas, garantindo consistência e alinhamento estratégico",
          "Gestão de múltiplos projetos e prazos simultaneamente"
        ]
      },
      {
        id: 'acompanhamento',
        title: "Acompanhamento & Otimização",
        order: 4,
        items: [
          "Acompanhamento de métricas e performance de conteúdo",
          "Análise de resultados e otimização estratégica contínua",
          "Identificação de oportunidades de melhoria na comunicação"
        ]
      },
      {
        id: 'relacionamento',
        title: "Relacionamento & Gestão de Projetos",
        order: 5,
        items: [
          "Condução de reuniões, alinhamentos e apresentações estratégicas",
          "Interface entre cliente e equipe criativa",
          "Gestão de feedbacks e acompanhamento de demandas"
        ]
      }
    ];

    console.log('Migrando serviços...');
    for (const s of services) {
      await setDoc(doc(db, 'services', s.id), s);
    }

    // 3. Testimonials (Extracted from TestimonialsSection.tsx previous view)
    const testimonials = [
      {
        author: "Paulo Buzzo",
        role: "Gestor Comercial | Growth | IA",
        order: 1,
        text: "Tive a honra de ter a Ingrid na equipe comercial da Auddar. Ela muito além do esperado, cuidando da comunicação interna, eventos e transformando as redes sociais, criando um planejamento estratégico de brilhar os olhos. Sempre proativa e cheia de ideias, destaco sua energia e dedicação inspiraram a todos ao redor. Ela é contagiante! Foi um privilégio ter Ingrid no time, e sei que onde ela estiver, trará sempre excelentes resultados e boas vibrações!",
        photoUrl: "https://lh3.googleusercontent.com/d/1gOBdoaCX4zcS1xfMYbi-LTtZ_2WFeIva"
      },
      {
        author: "Karina Redivo",
        role: "Coordinadora de Marketing",
        order: 2,
        text: "A Ingrid é uma profissional multifuncional, muito dedicada, organizada e com senso de resolução incrível. Durante o time em que atuou como Social Media em nosso time de marketing, ela trouxe ideias fantásticas, ajudou a aprimorar processos de rotina conforme as necessidades do setor e estava sempre disposta a realizar tudo com responsabilidade e empenho. Linda, alegre, cativante, serena, cuidadosa com as entregas e resultados! Foi um prazer ter a Ingrid em nosso time. Simplesmente maravilhosa!",
        photoUrl: "https://lh3.googleusercontent.com/d/1BkSIA3AFFHwMutkS8FVjOnImhIkPq92A"
      },
      {
        author: "Guilherme Bressan",
        role: "Creative Director at Estoriah",
        order: 3,
        text: "Tive o prazer de trabalhar com a Guigui em minha Produtora de Narrativas em 2022 e 2023. Uma pessoa muito carismática e de excelente comunicação que se destacava sempre por sua versatilidade e habilidade multitask. Além de Produtora Executiva, atuou como Assistente de Direção, acompanhando todas as etapas de produção de conteúdo sempre com uma postura proativa, pontualidade e uma capacidade impressionante de coordenação de equipe. Ela foi essencial em todas as etapas do processo: desde a gestão de produção, atendimento, visita técnica, até a coordenação da equipe envolvida.",
        photoUrl: "https://lh3.googleusercontent.com/d/1rmHzyu5fdTHMGj6a30KQxElstZ78UGDS"
      }
    ];

    console.log('Migrando depoimentos...');
    for (const t of testimonials) {
      await addDoc(collection(db, 'testimonials'), t);
    }

    // 4. Global Settings (Default values)
    console.log('Configurando site_settings...');
    await setDoc(doc(db, 'settings', 'global'), {
      accentColor: '#FEF200',
      whatsappNumber: '5511999999999',
      maintenanceMode: false
    });

    // 5. User Roles (Super Admin)
    console.log('Configurando super admin...');
    await setDoc(doc(db, 'users_roles', 'sinkando@gmail.com'), {
      email: 'sinkando@gmail.com',
      role: 'super',
      assignedBy: 'system'
    });

    console.log('Migração concluída com sucesso!');
  } catch (error) {
    console.error('Erro na migração:', error);
  }
}

migrate();
