import { Timestamp } from 'firebase/firestore';

export type UserRole = 'super' | 'admin' | 'support';

export interface UserRoleDoc {
  email: string;
  role: UserRole;
  assignedBy: string;
}

export type LayoutType = 'vertical' | 'horizontal';
export type MediaType = 'image' | 'video' | 'text' | 'link' | 'iframe' | 'pdf';

export interface Overlay {
  id: string;
  type: 'color' | 'image' | 'video';
  color?: string;
  url?: string;
  top: string;
  left: string;
  width: string;
  height: string;
}

export interface MediaItem {
  id?: string;
  type: MediaType;
  layout?: 'gshow' | 'standard';
  url?: string;
  thumbnail?: string;
  order?: number;
  label?: string;
  title?: string;
  subtitle?: string;
  credits?: string;
  content?: string;
  images?: string[];
  zoom?: number;
  yOffset?: number;
  xOffset?: number;
  objectFit?: 'cover' | 'contain';
  objectPosition?: string;
  allowScroll?: boolean;
  aspectRatio?: number;
  playerWidth?: number;
  playerHeight?: number;
  overlays?: Overlay[];
}

export interface FeedItem {
  id: string;
  title?: string;
  media: MediaItem;
  stories?: MediaItem[];
  aspectRatio: number; // 0.56 ou 0.80
}

export interface ProjectTheme {
  playerBg?: string;
  playerBorder?: string;
  playerShadow?: string;
  modalOverlayBg?: string;
  accentColor?: string;
  navButtonBg?: string;
  navButtonColor?: string;
  closeButtonBg?: string;
  closeButtonColor?: string;
  // Novas propriedades para customização total
  playerWidth?: number; // Largura customizada
  playerHeight?: number; // Altura (padrão 540)
  playerMaxHeight?: number; // Altura máxima em px
  aspectRatio?: number; // Ex: 0.56, 1.77, 1
  borderWidth?: string; // Ex: '1px'
  playerBorderColor?: string; // Cor da borda
  borderRadius?: string; // Ex: '8px'
  boxShadow?: string; // Efeito de sombra
}

export interface AboutConfig {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  width?: string; // Ex: 'max-w-md', 'max-w-2xl'
  height?: string; // Ex: 'max-h-[80vh]'
  backgroundColor?: string;
  textColor?: string;
  ctaColor?: string;
  ctaTextColor?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  layoutType: LayoutType | '2d';
  audioUrl?: string;
  galleryThumbnail: string;
  coverImage: string;
  thumbnailFit?: 'cover' | 'contain';
  cardBg?: string;
  mediaItems: MediaItem[]; // Para compatibilidade com projetos antigos
  feed?: FeedItem[]; // Nova estrutura 2D
  order: number;
  status?: 'published' | 'draft';
  isLocked?: boolean;
  password?: string;
  flowData?: {
    nodes: any[];
    edges: any[];
  };
  theme?: ProjectTheme;
  aboutConfig?: AboutConfig;
}

export interface Service {
  id: string;
  title: string;
  items: string[];
  order: number;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  text: string;
  photoUrl: string;
  order: number;
}

export interface SiteSettings {
  whatsappNumber: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  emailContact?: string;
  accentColor: string;
  maintenanceMode?: boolean;
  maintenanceTitle?: string;
  cor1?: string;
  cor2?: string;
  cor3?: string;
  cor4?: string;
  cor5?: string;
  cor6?: string;
  white?: string;
  grayLight?: string;
  textDark?: string;
  shadow?: string;
  fontSizeH1?: string;
  fontSizeH2?: string;
  fontSizeH3?: string;
  fontSizeH4?: string;
}

export interface AboutMe {
  videoUrl: string;
  description: string;
}

export interface MediaLibraryItem {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: number;
  category: 'image' | 'video' | 'audio' | 'other';
  projectId?: string;
}
