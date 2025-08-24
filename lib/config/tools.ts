export interface Tool {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  featured?: boolean;
  premium?: boolean;
  bulkSupport?: boolean;
}

export const TOOLS: Tool[] = [
  // PDF Tools
  {
    id: 'merge-pdf',
    slug: 'merge-pdf',
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into one document',
    category: 'pdf',
    icon: '📄',
    featured: true,
    bulkSupport: true
  },
  {
    id: 'split-pdf',
    slug: 'split-pdf',
    title: 'Split PDF',
    description: 'Split PDF into multiple files by page ranges',
    category: 'pdf',
    icon: '✂️',
    featured: true,
    bulkSupport: true
  },
  {
    id: 'compress-pdf',
    slug: 'compress-pdf',
    title: 'Compress PDF',
    description: 'Reduce PDF file size while maintaining quality',
    category: 'pdf',
    icon: '🗜️',
    featured: true,
    bulkSupport: true
  },
  {
    id: 'pdf-to-images',
    slug: 'pdf-to-images',
    title: 'PDF to Images',
    description: 'Convert PDF pages to PNG, JPG, or WebP images',
    category: 'pdf',
    icon: '🖼️',
    bulkSupport: true
  },
  {
    id: 'rotate-pdf',
    slug: 'rotate-pdf',
    title: 'Rotate PDF',
    description: 'Rotate PDF pages and organize document layout',
    category: 'pdf',
    icon: '🔄',
    bulkSupport: true
  },
  {
    id: 'protect-pdf',
    slug: 'protect-pdf',
    title: 'Protect PDF',
    description: 'Add password protection to PDF documents',
    category: 'pdf',
    icon: '🔒',
    bulkSupport: true
  },

  // Image Tools
  {
    id: 'compress-image',
    slug: 'compress-image',
    title: 'Compress Image',
    description: 'Reduce image file size with quality control',
    category: 'image',
    icon: '🗜️',
    featured: true,
    bulkSupport: true
  },
  {
    id: 'resize-image',
    slug: 'resize-image',
    title: 'Resize Image',
    description: 'Change image dimensions while maintaining aspect ratio',
    category: 'image',
    icon: '📏',
    featured: true,
    bulkSupport: true
  },
  {
    id: 'convert-image',
    slug: 'convert-image',
    title: 'Convert Image',
    description: 'Convert between JPG, PNG, WebP, AVIF formats',
    category: 'image',
    icon: '🔄',
    featured: true,
    bulkSupport: true
  },
  {
    id: 'crop-image',
    slug: 'crop-image',
    title: 'Crop Image',
    description: 'Crop images with precise pixel control',
    category: 'image',
    icon: '✂️',
    bulkSupport: true
  },
  {
    id: 'watermark-image',
    slug: 'watermark-image',
    title: 'Add Watermark',
    description: 'Add text or image watermarks to photos',
    category: 'image',
    icon: '©️',
    bulkSupport: true
  },
  {
    id: 'extract-colors',
    slug: 'extract-colors',
    title: 'Extract Colors',
    description: 'Extract color palette and metadata from images',
    category: 'image',
    icon: '🎨',
    bulkSupport: true
  },

  // QR & Barcode Tools
  {
    id: 'qr-generator',
    slug: 'qr-generator',
    title: 'QR Code Generator',
    description: 'Create custom QR codes with logos and colors',
    category: 'qr',
    icon: '📱',
    featured: true
  },
  {
    id: 'bulk-qr',
    slug: 'bulk-qr',
    title: 'Bulk QR Generator',
    description: 'Generate multiple QR codes from CSV data',
    category: 'qr',
    icon: '📊',
    bulkSupport: true
  },
  {
    id: 'qr-scanner',
    slug: 'qr-scanner',
    title: 'QR Scanner',
    description: 'Scan QR codes from images or webcam',
    category: 'qr',
    icon: '📷'
  },
  {
    id: 'barcode-generator',
    slug: 'barcode-generator',
    title: 'Barcode Generator',
    description: 'Generate EAN, UPC, Code128 barcodes',
    category: 'qr',
    icon: '📊'
  },

  // Code Tools
  {
    id: 'json-formatter',
    slug: 'json-formatter',
    title: 'JSON Formatter',
    description: 'Format, validate and minify JSON data',
    category: 'code',
    icon: '{ }',
    featured: true
  },
  {
    id: 'html-formatter',
    slug: 'html-formatter',
    title: 'HTML Formatter',
    description: 'Format and beautify HTML code',
    category: 'code',
    icon: '</>',
    featured: true
  },
  {
    id: 'css-formatter',
    slug: 'css-formatter',
    title: 'CSS Formatter',
    description: 'Format and minify CSS stylesheets',
    category: 'code',
    icon: '🎨'
  },
  {
    id: 'js-formatter',
    slug: 'js-formatter',
    title: 'JavaScript Formatter',
    description: 'Format and beautify JavaScript code',
    category: 'code',
    icon: 'JS'
  },
  {
    id: 'base64-encoder',
    slug: 'base64-encoder',
    title: 'Base64 Encoder',
    description: 'Encode and decode Base64 strings',
    category: 'code',
    icon: '🔤'
  },
  {
    id: 'url-encoder',
    slug: 'url-encoder',
    title: 'URL Encoder',
    description: 'Encode and decode URL strings',
    category: 'code',
    icon: '🔗'
  },
  {
    id: 'regex-tester',
    slug: 'regex-tester',
    title: 'Regex Tester',
    description: 'Test regular expressions with syntax highlighting',
    category: 'code',
    icon: '🔍'
  },
  {
    id: 'xml-formatter',
    slug: 'xml-formatter',
    title: 'XML Formatter',
    description: 'Format and beautify XML documents',
    category: 'code',
    icon: '📄'
  },
  {
    id: 'yaml-formatter',
    slug: 'yaml-formatter',
    title: 'YAML Formatter',
    description: 'Format and validate YAML files',
    category: 'code',
    icon: '📋'
  },
  {
    id: 'sql-formatter',
    slug: 'sql-formatter',
    title: 'SQL Formatter',
    description: 'Format and beautify SQL queries',
    category: 'code',
    icon: '🗃️'
  },
  {
    id: 'markdown-editor',
    slug: 'markdown-editor',
    title: 'Markdown Editor',
    description: 'Edit and preview Markdown documents',
    category: 'code',
    icon: '📝'
  },
  {
    id: 'hash-generator',
    slug: 'hash-generator',
    title: 'Hash Generator',
    description: 'Generate MD5, SHA1, SHA256 hashes',
    category: 'code',
    icon: '#️⃣'
  },
  {
    id: 'password-generator',
    slug: 'password-generator',
    title: 'Password Generator',
    description: 'Generate secure passwords with custom options',
    category: 'code',
    icon: '🔐'
  },

  // SEO Tools
  {
    id: 'meta-generator',
    slug: 'meta-generator',
    title: 'Meta Tag Generator',
    description: 'Generate SEO meta tags and Open Graph tags',
    category: 'seo',
    icon: '🏷️',
    featured: true
  },
  {
    id: 'redirect-checker',
    slug: 'redirect-checker',
    title: 'Redirect Checker',
    description: 'Check HTTP redirects and response codes',
    category: 'seo',
    icon: '🔄'
  },
  {
    id: 'robots-generator',
    slug: 'robots-generator',
    title: 'Robots.txt Generator',
    description: 'Generate robots.txt files for websites',
    category: 'seo',
    icon: '🤖'
  },
  {
    id: 'sitemap-generator',
    slug: 'sitemap-generator',
    title: 'Sitemap Generator',
    description: 'Create XML sitemaps for better SEO',
    category: 'seo',
    icon: '🗺️'
  },
  {
    id: 'keyword-density',
    slug: 'keyword-density',
    title: 'Keyword Density',
    description: 'Analyze keyword density in text content',
    category: 'seo',
    icon: '📊'
  },
  {
    id: 'backlink-checker',
    slug: 'backlink-checker',
    title: 'Backlink Checker',
    description: 'Analyze website backlinks and authority',
    category: 'seo',
    icon: '🔗'
  },
  {
    id: 'page-speed-test',
    slug: 'page-speed-test',
    title: 'Page Speed Test',
    description: 'Test website loading speed and performance',
    category: 'seo',
    icon: '⚡'
  },
  {
    id: 'broken-link-checker',
    slug: 'broken-link-checker',
    title: 'Broken Link Checker',
    description: 'Find and fix broken links on websites',
    category: 'seo',
    icon: '🔍'
  },

  // Network Tools
  {
    id: 'ssl-checker',
    slug: 'ssl-checker',
    title: 'SSL Certificate Checker',
    description: 'Check SSL certificate details and validity',
    category: 'network',
    icon: '🔒'
  },
  {
    id: 'user-agent-parser',
    slug: 'user-agent-parser',
    title: 'User Agent Parser',
    description: 'Parse and analyze user agent strings',
    category: 'network',
    icon: '🌐'
  },
  {
    id: 'ip-lookup',
    slug: 'ip-lookup',
    title: 'IP Address Lookup',
    description: 'Get location and details for IP addresses',
    category: 'network',
    icon: '🌍'
  },
  {
    id: 'dns-lookup',
    slug: 'dns-lookup',
    title: 'DNS Lookup',
    description: 'Perform DNS queries and domain analysis',
    category: 'network',
    icon: '🔍'
  },
  {
    id: 'port-scanner',
    slug: 'port-scanner',
    title: 'Port Scanner',
    description: 'Scan open ports on servers and networks',
    category: 'network',
    icon: '🔌'
  },
  {
    id: 'ping-test',
    slug: 'ping-test',
    title: 'Ping Test',
    description: 'Test network connectivity and latency',
    category: 'network',
    icon: '📡'
  },
  {
    id: 'whois-lookup',
    slug: 'whois-lookup',
    title: 'WHOIS Lookup',
    description: 'Get domain registration information',
    category: 'network',
    icon: '🔍'
  },

  // Utility Tools
  {
    id: 'unit-converter',
    slug: 'unit-converter',
    title: 'Unit Converter',
    description: 'Convert between different units of measurement',
    category: 'utilities',
    icon: '📐',
    featured: true
  },
  {
    id: 'color-converter',
    slug: 'color-converter',
    title: 'Color Converter',
    description: 'Convert between HEX, RGB, HSL color formats',
    category: 'utilities',
    icon: '🎨'
  },
  {
    id: 'timezone-converter',
    slug: 'timezone-converter',
    title: 'Timezone Converter',
    description: 'Convert time between different timezones',
    category: 'utilities',
    icon: '🕐'
  },
  {
    id: 'lorem-generator',
    slug: 'lorem-generator',
    title: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for designs',
    category: 'utilities',
    icon: '📝'
  },
  {
    id: 'currency-converter',
    slug: 'currency-converter',
    title: 'Currency Converter',
    description: 'Convert between different currencies',
    category: 'utilities',
    icon: '💱'
  },
  {
    id: 'case-converter',
    slug: 'case-converter',
    title: 'Text Case Converter',
    description: 'Convert text between different cases',
    category: 'utilities',
    icon: 'Aa'
  }
  {
    id: 'qr-scanner',
    slug: 'qr-scanner',
    title: 'QR Code Scanner',
    description: 'Scan QR codes from images or webcam',
    category: 'qr',
    icon: '📷'
  },
  {
    id: 'barcode-generator',
    slug: 'barcode-generator',
    title: 'Barcode Generator',
    description: 'Generate various barcode formats',
    category: 'qr',
    icon: '📊'
  },
  {
    id: 'bulk-qr-generator',
    slug: 'bulk-qr-generator',
    title: 'Bulk QR Generator',
    description: 'Generate multiple QR codes from CSV',
    category: 'qr',
    icon: '📋'
  },
  {
    id: 'vcard-qr',
    slug: 'vcard-qr',
    title: 'vCard QR Generator',
    description: 'Create QR codes for contact information',
    category: 'qr',
    icon: '👤'
  },
  {
    id: 'wifi-qr',
    slug: 'wifi-qr',
    title: 'WiFi QR Generator',
    description: 'Generate QR codes for WiFi networks',
    category: 'qr',
    icon: '📶'
  },
  {
    id: 'pdf-to-word',
    slug: 'pdf-to-word',
    title: 'PDF to Word',
    description: 'Convert PDF documents to Word format',
    category: 'pdf',
    icon: '📄'
  },
  {
    id: 'pdf-to-excel',
    slug: 'pdf-to-excel',
    title: 'PDF to Excel',
    description: 'Convert PDF tables to Excel spreadsheets',
    category: 'pdf',
    icon: '📊'
  },
  {
    id: 'pdf-to-powerpoint',
    slug: 'pdf-to-powerpoint',
    title: 'PDF to PowerPoint',
    description: 'Convert PDF to PowerPoint presentations',
    category: 'pdf',
    icon: '📽️'
  },
  {
    id: 'word-to-pdf',
    slug: 'word-to-pdf',
    title: 'Word to PDF',
    description: 'Convert Word documents to PDF format',
    category: 'pdf',
    icon: '📄'
  },
  {
    id: 'excel-to-pdf',
    slug: 'excel-to-pdf',
    title: 'Excel to PDF',
    description: 'Convert Excel spreadsheets to PDF',
    category: 'pdf',
    icon: '📊'
  },
  {
    id: 'powerpoint-to-pdf',
    slug: 'powerpoint-to-pdf',
    title: 'PowerPoint to PDF',
    description: 'Convert PowerPoint presentations to PDF',
    category: 'pdf',
    icon: '📽️'
  },
  {
    id: 'add-page-numbers',
    slug: 'add-page-numbers',
    title: 'Add Page Numbers',
    description: 'Add page numbers to PDF documents',
    category: 'pdf',
    icon: '🔢'
  },
  {
    id: 'remove-pages',
    slug: 'remove-pages',
    title: 'Remove PDF Pages',
    description: 'Delete specific pages from PDF documents',
    category: 'pdf',
    icon: '🗑️'
  },
  {
    id: 'extract-pages',
    slug: 'extract-pages',
    title: 'Extract PDF Pages',
    description: 'Extract specific pages from PDF documents',
    category: 'pdf',
    icon: '📄'
  },
  {
    id: 'pdf-ocr',
    slug: 'pdf-ocr',
    title: 'PDF OCR',
    description: 'Extract text from scanned PDF documents',
    category: 'pdf',
    icon: '👁️'
  },
  {
    id: 'add-watermark',
    slug: 'add-watermark',
    title: 'Add Watermark',
    description: 'Add text or image watermarks to images',
    category: 'image',
    icon: '©️',
    bulkSupport: true
  },
  {
    id: 'remove-background',
    slug: 'remove-background',
    title: 'Remove Background',
    description: 'Remove background from images automatically',
    category: 'image',
    icon: '🎭',
    bulkSupport: true
  },
  {
    id: 'image-filters',
    slug: 'image-filters',
    title: 'Image Filters',
    description: 'Apply filters and effects to images',
    category: 'image',
    icon: '🎨',
    bulkSupport: true
  },
  {
    id: 'photo-editor',
    slug: 'photo-editor',
    title: 'Photo Editor',
    description: 'Advanced photo editing with layers',
    category: 'image',
    icon: '🖼️'
  },
  {
    id: 'image-upscaler',
    slug: 'image-upscaler',
    title: 'Image Upscaler',
    description: 'Enhance and upscale image resolution',
    category: 'image',
    icon: '⬆️',
    bulkSupport: true
  },
  {
    id: 'gif-maker',
    slug: 'gif-maker',
    title: 'GIF Maker',
    description: 'Create animated GIFs from images or videos',
    category: 'image',
    icon: '🎬'
  },
  {
    id: 'meme-generator',
    slug: 'meme-generator',
    title: 'Meme Generator',
    description: 'Create memes with text overlays',
    category: 'image',
    icon: '😂'
  },
  {
    id: 'collage-maker',
    slug: 'collage-maker',
    title: 'Collage Maker',
    description: 'Create photo collages and layouts',
    category: 'image',
    icon: '🖼️'
  },
  {
    id: 'screenshot-tool',
    slug: 'screenshot-tool',
    title: 'Screenshot Tool',
    description: 'Capture and edit screenshots',
    category: 'image',
    icon: '📸'
  },
  {
    id: 'image-to-text',
    slug: 'image-to-text',
    title: 'Image to Text (OCR)',
    description: 'Extract text from images using OCR',
    category: 'image',
    icon: '📝'
  }
];

export const CATEGORIES = {
  pdf: {
    name: 'PDF Tools',
    description: 'Professional PDF processing tools',
    icon: '📄',
    color: 'from-red-500 to-pink-500'
  },
  image: {
    name: 'Image Tools',
    description: 'Advanced image processing and editing',
    icon: '🖼️',
    color: 'from-blue-500 to-cyan-500'
  },
  qr: {
    name: 'QR & Barcode',
    description: 'QR code and barcode generation tools',
    icon: '📱',
    color: 'from-green-500 to-emerald-500'
  },
  code: {
    name: 'Code Tools',
    description: 'Developer tools for code formatting',
    icon: '💻',
    color: 'from-purple-500 to-violet-500'
  },
  seo: {
    name: 'SEO Tools',
    description: 'Search engine optimization utilities',
    icon: '📈',
    color: 'from-orange-500 to-red-500'
  },
  network: {
    name: 'Network Tools',
    description: 'Network analysis and system tools',
    icon: '🌐',
    color: 'from-teal-500 to-blue-500'
  },
  utilities: {
    name: 'Utilities',
    description: 'Essential utility tools for daily tasks',
    icon: '🛠️',
    color: 'from-indigo-500 to-purple-500'
  }
};

export function getToolsByCategory(category: string): Tool[] {
  return TOOLS.filter(tool => tool.category === category);
}

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find(tool => tool.slug === slug);
}

export function getFeaturedTools(): Tool[] {
  return TOOLS.filter(tool => tool.featured);
}

export function getToolsForDomain(categories: string[]): Tool[] {
  return TOOLS.filter(tool => categories.includes(tool.category));
}