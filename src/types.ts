export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectMedia {
  type: 'image' | 'video';
  url: string;
  caption?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  client: string;
  campaign: string;
  description: string;
  challenge: string;
  strategy: string;
  metrics: ProjectMetric[];
  coverImage: string;
  media: ProjectMedia[];
  order: number;
  version?: number;
}

export interface ServiceItem {
  title: string;
  description: string;
  bullets: string[];
  version?: number;
}

export interface SiteSettings {
  name: string;
  role: string;
  tagline: string;
  email: string;
  linkedin: string;
  whatsapp?: string;
  instagram?: string;
}
