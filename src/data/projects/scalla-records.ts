import { Project } from '../../types';

export const scallaRecords: Project = {
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
