export interface DomainConfig {
  host: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  categories: string[];
  isGlobal?: boolean;
}

export const DOMAINS: Record<string, DomainConfig> = {
  'pixoratools.com': {
    host: 'pixoratools.com',
    name: 'Pixora Tools',
    description: 'Complete suite of online tools for professionals',
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    logo: '🔧',
    categories: ['pdf', 'image', 'qr', 'code', 'seo', 'network', 'utilities'],
    isGlobal: true
  },
  'pixorapdf.com': {
    host: 'pixorapdf.com',
    name: 'Pixora PDF',
    description: 'Professional PDF tools for every need',
    primaryColor: '#EF4444',
    secondaryColor: '#F97316',
    logo: '📄',
    categories: ['pdf']
  },
  'pixoraimg.com': {
    host: 'pixoraimg.com',
    name: 'Pixora IMG',
    description: 'Advanced image processing tools',
    primaryColor: '#3B82F6',
    secondaryColor: '#06B6D4',
    logo: '🖼️',
    categories: ['image']
  },
  'pixoraqrcode.com': {
    host: 'pixoraqrcode.com',
    name: 'Pixora QR',
    description: 'QR code and barcode generation tools',
    primaryColor: '#10B981',
    secondaryColor: '#059669',
    logo: '📱',
    categories: ['qr']
  },
  'pixoracode.com': {
    host: 'pixoracode.com',
    name: 'Pixora Code',
    description: 'Developer tools for code formatting and validation',
    primaryColor: '#8B5CF6',
    secondaryColor: '#A855F7',
    logo: '💻',
    categories: ['code']
  },
  'pixoraseo.com': {
    host: 'pixoraseo.com',
    name: 'Pixora SEO',
    description: 'SEO analysis and optimization tools',
    primaryColor: '#F59E0B',
    secondaryColor: '#D97706',
    logo: '📈',
    categories: ['seo']
  },
  'pixoranet.com': {
    host: 'pixoranet.com',
    name: 'Pixora Net',
    description: 'Network analysis and system tools',
    primaryColor: '#06B6D4',
    secondaryColor: '#0891B2',
    logo: '🌐',
    categories: ['network']
  },
  'pixorautilities.com': {
    host: 'pixorautilities.com',
    name: 'Pixora Utilities',
    description: 'Essential utility tools for daily tasks',
    primaryColor: '#84CC16',
    secondaryColor: '#65A30D',
    logo: '🛠️',
    categories: ['utilities']
  }
};

export function getDomainConfig(host: string): DomainConfig {
  // Remove port and protocol for local development
  const cleanHost = host.replace(/^https?:\/\//, '').replace(/:\d+$/, '');
  
  // For localhost development, default to global domain
  if (cleanHost.includes('localhost') || cleanHost.includes('127.0.0.1')) {
    return DOMAINS['pixoratools.com'];
  }
  
  return DOMAINS[cleanHost] || DOMAINS['pixoratools.com'];
}