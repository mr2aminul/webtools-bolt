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
  maxFileSize?: number;
  supportedFormats?: string[];
  processingType: 'client' | 'wasm' | 'worker';
}

export const TOOLS: Tool[] = [
  // PDF Tools (Production Ready)
  {
    id: 'merge-pdf',
    slug: 'merge-pdf',
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into one document with drag & drop reordering',
    category: 'pdf',
    icon: '📄',
    featured: true,
    bulkSupport: true,
    maxFileSize: 100 * 1024 * 1024, // 100MB
    supportedFormats: ['.pdf'],
    processingType: 'wasm'
  },
  {
    id: 'split-pdf',
    slug: 'split-pdf',
    title: 'Split PDF',
    description: 'Extract pages from PDF - split by page ranges, extract single pages, or split every page',
    category: 'pdf',
    icon: '✂️',
    featured: true,
    bulkSupport: true,
    maxFileSize: 100 * 1024 * 1024,
    supportedFormats: ['.pdf'],
    processingType: 'wasm'
  },
  {
    id: 'compress-pdf',
    slug: 'compress-pdf',
    title: 'Compress PDF',
    description: 'Reduce PDF file size with 3 compression levels while maintaining quality',
    category: 'pdf',
    icon: '🗜️',
    featured: true,
    bulkSupport: true,
    maxFileSize: 100 * 1024 * 1024,
    supportedFormats: ['.pdf'],
    processingType: 'wasm'
  },
  {
    id: 'pdf-to-jpg',
    slug: 'pdf-to-jpg',
    title: 'PDF to JPG',
    description: 'Convert PDF pages to high-quality JPG images with custom DPI settings',
    category: 'pdf',
    icon: '🖼️',
    bulkSupport: true,
    maxFileSize: 100 * 1024 * 1024,
    supportedFormats: ['.pdf'],
    processingType: 'wasm'
  },
  {
    id: 'jpg-to-pdf',
    slug: 'jpg-to-pdf',
    title: 'JPG to PDF',
    description: 'Convert JPG images to PDF with custom page sizes and margins',
    category: 'pdf',
    icon: '📄',
    bulkSupport: true,
    maxFileSize: 50 * 1024 * 1024,
    supportedFormats: ['.jpg', '.jpeg'],
    processingType: 'client'
  },
  {
    id: 'rotate-pdf',
    slug: 'rotate-pdf',
    title: 'Rotate PDF',
    description: 'Rotate PDF pages 90°, 180°, or 270° - all pages or specific page ranges',
    category: 'pdf',
    icon: '🔄',
    bulkSupport: true,
    maxFileSize: 100 * 1024 * 1024,
    supportedFormats: ['.pdf'],
    processingType: 'wasm'
  },
  {
    id: 'unlock-pdf',
    slug: 'unlock-pdf',
    title: 'Unlock PDF',
    description: 'Remove password protection from PDF files',
    category: 'pdf',
    icon: '🔓',
    bulkSupport: true,
    maxFileSize: 100 * 1024 * 1024,
    supportedFormats: ['.pdf'],
    processingType: 'wasm'
  },
  {
    id: 'protect-pdf',
    slug: 'protect-pdf',
    title: 'Protect PDF',
    description: 'Add password protection and set permissions for PDF documents',
    category: 'pdf',
    icon: '🔒',
    bulkSupport: true,
    maxFileSize: 100 * 1024 * 1024,
    supportedFormats: ['.pdf'],
    processingType: 'wasm'
  },
  {
    id: 'add-watermark-pdf',
    slug: 'add-watermark-pdf',
    title: 'Add Watermark to PDF',
    description: 'Add text or image watermarks to PDF with position and transparency control',
    category: 'pdf',
    icon: '©️',
    bulkSupport: true,
    maxFileSize: 100 * 1024 * 1024,
    supportedFormats: ['.pdf'],
    processingType: 'wasm'
  },
  {
    id: 'pdf-to-word',
    slug: 'pdf-to-word',
    title: 'PDF to Word',
    description: 'Convert PDF to editable Word documents with OCR support',
    category: 'pdf',
    icon: '📝',
    bulkSupport: true,
    maxFileSize: 100 * 1024 * 1024,
    supportedFormats: ['.pdf'],
    processingType: 'wasm'
  },

  // Image Tools (Production Ready)
  {
    id: 'compress-image',
    slug: 'compress-image',
    title: 'Compress Image',
    description: 'Reduce image file size up to 80% with quality slider and format optimization',
    category: 'image',
    icon: '🗜️',
    featured: true,
    bulkSupport: true,
    maxFileSize: 50 * 1024 * 1024,
    supportedFormats: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
    processingType: 'wasm'
  },
  {
    id: 'resize-image',
    slug: 'resize-image',
    title: 'Resize Image',
    description: 'Resize images by pixels, percentage, or preset sizes with aspect ratio control',
    category: 'image',
    icon: '📏',
    featured: true,
    bulkSupport: true,
    maxFileSize: 50 * 1024 * 1024,
    supportedFormats: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'],
    processingType: 'wasm'
  },
  {
    id: 'crop-image',
    slug: 'crop-image',
    title: 'Crop Image',
    description: 'Crop images with visual editor, preset ratios, or custom pixel dimensions',
    category: 'image',
    icon: '✂️',
    featured: true,
    bulkSupport: true,
    maxFileSize: 50 * 1024 * 1024,
    supportedFormats: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
    processingType: 'client'
  },
  {
    id: 'convert-image',
    slug: 'convert-image',
    title: 'Convert Image',
    description: 'Convert between JPG, PNG, WebP, AVIF, GIF, BMP with quality settings',
    category: 'image',
    icon: '🔄',
    bulkSupport: true,
    maxFileSize: 50 * 1024 * 1024,
    supportedFormats: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff'],
    processingType: 'wasm'
  },
  {
    id: 'rotate-image',
    slug: 'rotate-image',
    title: 'Rotate Image',
    description: 'Rotate images by any angle with automatic or custom background fill',
    category: 'image',
    icon: '🔄',
    bulkSupport: true,
    maxFileSize: 50 * 1024 * 1024,
    supportedFormats: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
    processingType: 'client'
  },
  {
    id: 'flip-image',
    slug: 'flip-image',
    title: 'Flip Image',
    description: 'Flip images horizontally or vertically with preview',
    category: 'image',
    icon: '↔️',
    bulkSupport: true,
    maxFileSize: 50 * 1024 * 1024,
    supportedFormats: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
    processingType: 'client'
  },
  {
    id: 'add-watermark-image',
    slug: 'add-watermark-image',
    title: 'Add Watermark to Image',
    description: 'Add text or image watermarks with position, opacity, and rotation control',
    category: 'image',
    icon: '©️',
    bulkSupport: true,
    maxFileSize: 50 * 1024 * 1024,
    supportedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    processingType: 'client'
  },
  {
    id: 'remove-background',
    slug: 'remove-background',
    title: 'Remove Background',
    description: 'Automatically remove image backgrounds with AI-powered edge detection',
    category: 'image',
    icon: '🎭',
    premium: true,
    bulkSupport: true,
    maxFileSize: 25 * 1024 * 1024,
    supportedFormats: ['.jpg', '.jpeg', '.png'],
    processingType: 'wasm'
  },
  {
    id: 'upscale-image',
    slug: 'upscale-image',
    title: 'Upscale Image',
    description: 'Enhance image resolution up to 4x using advanced algorithms',
    category: 'image',
    icon: '⬆️',
    premium: true,
    bulkSupport: true,
    maxFileSize: 25 * 1024 * 1024,
    supportedFormats: ['.jpg', '.jpeg', '.png'],
    processingType: 'wasm'
  },
  {
    id: 'image-effects',
    slug: 'image-effects',
    title: 'Image Effects',
    description: 'Apply filters and effects: blur, sharpen, vintage, black & white, sepia',
    category: 'image',
    icon: '🎨',
    bulkSupport: true,
    maxFileSize: 50 * 1024 * 1024,
    supportedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    processingType: 'client'
  },

  // QR & Barcode Tools (Production Ready)
  {
    id: 'qr-generator',
    slug: 'qr-generator',
    title: 'QR Code Generator',
    description: 'Create custom QR codes with logos, colors, patterns, and high-resolution export',
    category: 'qr',
    icon: '📱',
    featured: true,
    maxFileSize: 5 * 1024 * 1024,
    supportedFormats: ['.png', '.jpg', '.svg'],
    processingType: 'client'
  },
  {
    id: 'qr-scanner',
    slug: 'qr-scanner',
    title: 'QR Code Scanner',
    description: 'Scan QR codes from images or webcam with batch processing support',
    category: 'qr',
    icon: '📷',
    bulkSupport: true,
    maxFileSize: 25 * 1024 * 1024,
    supportedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    processingType: 'wasm'
  },
  {
    id: 'bulk-qr-generator',
    slug: 'bulk-qr-generator',
    title: 'Bulk QR Generator',
    description: 'Generate hundreds of QR codes from CSV/Excel with custom templates',
    category: 'qr',
    icon: '📊',
    bulkSupport: true,
    maxFileSize: 10 * 1024 * 1024,
    supportedFormats: ['.csv', '.xlsx', '.txt'],
    processingType: 'client'
  },
  {
    id: 'vcard-qr',
    slug: 'vcard-qr',
    title: 'vCard QR Generator',
    description: 'Create QR codes for contact information with vCard format',
    category: 'qr',
    icon: '👤',
    processingType: 'client'
  },
  {
    id: 'wifi-qr',
    slug: 'wifi-qr',
    title: 'WiFi QR Generator',
    description: 'Generate QR codes for WiFi networks with WPA/WEP/Open security',
    category: 'qr',
    icon: '📶',
    processingType: 'client'
  },
  {
    id: 'barcode-generator',
    slug: 'barcode-generator',
    title: 'Barcode Generator',
    description: 'Generate EAN-13, UPC-A, Code 128, Code 39 barcodes with validation',
    category: 'qr',
    icon: '📊',
    processingType: 'client'
  },
  {
    id: 'qr-analytics',
    slug: 'qr-analytics',
    title: 'QR Code Analytics',
    description: 'Track QR code scans with detailed analytics and geographic data',
    category: 'qr',
    icon: '📈',
    premium: true,
    processingType: 'client'
  },
  {
    id: 'dynamic-qr',
    slug: 'dynamic-qr',
    title: 'Dynamic QR Codes',
    description: 'Create editable QR codes that can be updated without reprinting',
    category: 'qr',
    icon: '🔄',
    premium: true,
    processingType: 'client'
  },
  {
    id: 'qr-designer',
    slug: 'qr-designer',
    title: 'QR Code Designer',
    description: 'Advanced QR code customization with frames, gradients, and patterns',
    category: 'qr',
    icon: '🎨',
    premium: true,
    processingType: 'client'
  },
  {
    id: 'batch-qr-scanner',
    slug: 'batch-qr-scanner',
    title: 'Batch QR Scanner',
    description: 'Scan multiple QR codes from images and export results to CSV',
    category: 'qr',
    icon: '📋',
    bulkSupport: true,
    maxFileSize: 100 * 1024 * 1024,
    supportedFormats: ['.jpg', '.jpeg', '.png', '.pdf'],
    processingType: 'wasm'
  },

  // Code Tools (Production Ready)
  {
    id: 'json-formatter',
    slug: 'json-formatter',
    title: 'JSON Formatter',
    description: 'Format, validate, minify JSON with syntax highlighting and error detection',
    category: 'code',
    icon: '{ }',
    featured: true,
    maxFileSize: 50 * 1024 * 1024,
    supportedFormats: ['.json', '.txt'],
    processingType: 'client'
  },
  {
    id: 'html-formatter',
    slug: 'html-formatter',
    title: 'HTML Formatter',
    description: 'Format, beautify, minify HTML with validation and tag completion',
    category: 'code',
    icon: '</>',
    featured: true,
    maxFileSize: 50 * 1024 * 1024,
    supportedFormats: ['.html', '.htm', '.txt'],
    processingType: 'client'
  },
  {
    id: 'css-formatter',
    slug: 'css-formatter',
    title: 'CSS Formatter',
    description: 'Format, beautify, minify CSS with autoprefixer and optimization',
    category: 'code',
    icon: '🎨',
    maxFileSize: 25 * 1024 * 1024,
    supportedFormats: ['.css', '.scss', '.less', '.txt'],
    processingType: 'client'
  },
  {
    id: 'js-formatter',
    slug: 'js-formatter',
    title: 'JavaScript Formatter',
    description: 'Format, beautify, minify JavaScript with ES6+ support and validation',
    category: 'code',
    icon: 'JS',
    maxFileSize: 25 * 1024 * 1024,
    supportedFormats: ['.js', '.jsx', '.ts', '.tsx', '.txt'],
    processingType: 'client'
  },
  {
    id: 'xml-formatter',
    slug: 'xml-formatter',
    title: 'XML Formatter',
    description: 'Format, validate, minify XML with schema validation and namespace support',
    category: 'code',
    icon: '📄',
    maxFileSize: 50 * 1024 * 1024,
    supportedFormats: ['.xml', '.xsd', '.xsl', '.txt'],
    processingType: 'client'
  },
  {
    id: 'sql-formatter',
    slug: 'sql-formatter',
    title: 'SQL Formatter',
    description: 'Format SQL queries with syntax highlighting for MySQL, PostgreSQL, SQLite',
    category: 'code',
    icon: '🗃️',
    maxFileSize: 10 * 1024 * 1024,
    supportedFormats: ['.sql', '.txt'],
    processingType: 'client'
  },
  {
    id: 'base64-encoder',
    slug: 'base64-encoder',
    title: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings with file support and URL-safe variants',
    category: 'code',
    icon: '🔤',
    maxFileSize: 100 * 1024 * 1024,
    processingType: 'client'
  },
  {
    id: 'url-encoder',
    slug: 'url-encoder',
    title: 'URL Encoder/Decoder',
    description: 'Encode and decode URLs with component-wise encoding and validation',
    category: 'code',
    icon: '🔗',
    processingType: 'client'
  },
  {
    id: 'hash-generator',
    slug: 'hash-generator',
    title: 'Hash Generator',
    description: 'Generate MD5, SHA1, SHA256, SHA512 hashes with file support',
    category: 'code',
    icon: '#️⃣',
    maxFileSize: 500 * 1024 * 1024,
    processingType: 'wasm'
  },
  {
    id: 'regex-tester',
    slug: 'regex-tester',
    title: 'Regex Tester',
    description: 'Test regular expressions with syntax highlighting, flags, and match groups',
    category: 'code',
    icon: '🔍',
    processingType: 'client'
  },

  // SEO Tools (Production Ready)
  {
    id: 'meta-tags-generator',
    slug: 'meta-tags-generator',
    title: 'Meta Tags Generator',
    description: 'Generate SEO meta tags, Open Graph, Twitter Cards with preview',
    category: 'seo',
    icon: '🏷️',
    featured: true,
    processingType: 'client'
  },
  {
    id: 'keyword-density-checker',
    slug: 'keyword-density-checker',
    title: 'Keyword Density Checker',
    description: 'Analyze keyword density, frequency, and SEO optimization suggestions',
    category: 'seo',
    icon: '📊',
    maxFileSize: 5 * 1024 * 1024,
    supportedFormats: ['.txt', '.html'],
    processingType: 'client'
  },
  {
    id: 'backlink-checker',
    slug: 'backlink-checker',
    title: 'Backlink Checker',
    description: 'Check website backlinks, domain authority, and link quality analysis',
    category: 'seo',
    icon: '🔗',
    processingType: 'client'
  },
  {
    id: 'page-speed-analyzer',
    slug: 'page-speed-analyzer',
    title: 'Page Speed Analyzer',
    description: 'Analyze website loading speed with performance optimization suggestions',
    category: 'seo',
    icon: '⚡',
    processingType: 'client'
  },
  {
    id: 'sitemap-generator',
    slug: 'sitemap-generator',
    title: 'Sitemap Generator',
    description: 'Generate XML sitemaps with priority, frequency, and last modified dates',
    category: 'seo',
    icon: '🗺️',
    processingType: 'client'
  },
  {
    id: 'robots-txt-generator',
    slug: 'robots-txt-generator',
    title: 'Robots.txt Generator',
    description: 'Create robots.txt files with crawl delay, sitemap, and user-agent rules',
    category: 'seo',
    icon: '🤖',
    processingType: 'client'
  },
  {
    id: 'broken-link-checker',
    slug: 'broken-link-checker',
    title: 'Broken Link Checker',
    description: 'Find and fix broken links on websites with detailed error reports',
    category: 'seo',
    icon: '🔍',
    processingType: 'client'
  },
  {
    id: 'google-serp-checker',
    slug: 'google-serp-checker',
    title: 'Google SERP Checker',
    description: 'Check Google search rankings for keywords across different locations',
    category: 'seo',
    icon: '🔍',
    processingType: 'client'
  },
  {
    id: 'domain-authority-checker',
    slug: 'domain-authority-checker',
    title: 'Domain Authority Checker',
    description: 'Check domain authority, page authority, and SEO metrics',
    category: 'seo',
    icon: '📈',
    processingType: 'client'
  },
  {
    id: 'schema-markup-generator',
    slug: 'schema-markup-generator',
    title: 'Schema Markup Generator',
    description: 'Generate JSON-LD schema markup for better search engine understanding',
    category: 'seo',
    icon: '📋',
    processingType: 'client'
  },

  // Network Tools (Production Ready)
  {
    id: 'ping-test',
    slug: 'ping-test',
    title: 'Ping Test',
    description: 'Test network connectivity and latency to servers worldwide',
    category: 'network',
    icon: '📡',
    processingType: 'client'
  },
  {
    id: 'dns-lookup',
    slug: 'dns-lookup',
    title: 'DNS Lookup',
    description: 'Perform DNS queries for A, AAAA, MX, CNAME, TXT, NS records',
    category: 'network',
    icon: '🔍',
    processingType: 'client'
  },
  {
    id: 'whois-lookup',
    slug: 'whois-lookup',
    title: 'WHOIS Lookup',
    description: 'Get domain registration information, expiry dates, and registrar details',
    category: 'network',
    icon: '🔍',
    processingType: 'client'
  },
  {
    id: 'ssl-checker',
    slug: 'ssl-checker',
    title: 'SSL Certificate Checker',
    description: 'Check SSL certificate validity, expiry, and security configuration',
    category: 'network',
    icon: '🔒',
    processingType: 'client'
  },
  {
    id: 'port-scanner',
    slug: 'port-scanner',
    title: 'Port Scanner',
    description: 'Scan open ports on servers with service detection and security analysis',
    category: 'network',
    icon: '🔌',
    processingType: 'client'
  },
  {
    id: 'ip-lookup',
    slug: 'ip-lookup',
    title: 'IP Address Lookup',
    description: 'Get geolocation, ISP, and network information for IP addresses',
    category: 'network',
    icon: '🌍',
    processingType: 'client'
  },
  {
    id: 'traceroute',
    slug: 'traceroute',
    title: 'Traceroute',
    description: 'Trace network path to destination with hop-by-hop analysis',
    category: 'network',
    icon: '🛤️',
    processingType: 'client'
  },
  {
    id: 'bandwidth-test',
    slug: 'bandwidth-test',
    title: 'Bandwidth Test',
    description: 'Test internet connection speed with upload/download measurements',
    category: 'network',
    icon: '📊',
    processingType: 'client'
  },
  {
    id: 'subnet-calculator',
    slug: 'subnet-calculator',
    title: 'Subnet Calculator',
    description: 'Calculate IP subnets, CIDR notation, and network ranges',
    category: 'network',
    icon: '🧮',
    processingType: 'client'
  },
  {
    id: 'mac-address-lookup',
    slug: 'mac-address-lookup',
    title: 'MAC Address Lookup',
    description: 'Lookup MAC address vendor information and device manufacturer',
    category: 'network',
    icon: '🔍',
    processingType: 'client'
  },

  // Utility Tools (Production Ready)
  {
    id: 'password-generator',
    slug: 'password-generator',
    title: 'Password Generator',
    description: 'Generate secure passwords with custom length, characters, and strength analysis',
    category: 'utilities',
    icon: '🔐',
    featured: true,
    processingType: 'client'
  },
  {
    id: 'unit-converter',
    slug: 'unit-converter',
    title: 'Unit Converter',
    description: 'Convert between units: length, weight, temperature, area, volume, speed',
    category: 'utilities',
    icon: '📐',
    featured: true,
    processingType: 'client'
  },
  {
    id: 'color-picker',
    slug: 'color-picker',
    title: 'Color Picker & Converter',
    description: 'Pick colors and convert between HEX, RGB, HSL, CMYK with palette generator',
    category: 'utilities',
    icon: '🎨',
    processingType: 'client'
  },
  {
    id: 'timestamp-converter',
    slug: 'timestamp-converter',
    title: 'Timestamp Converter',
    description: 'Convert Unix timestamps to human-readable dates and vice versa',
    category: 'utilities',
    icon: '🕐',
    processingType: 'client'
  },
  {
    id: 'lorem-ipsum-generator',
    slug: 'lorem-ipsum-generator',
    title: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text in words, sentences, or paragraphs',
    category: 'utilities',
    icon: '📝',
    processingType: 'client'
  },
  {
    id: 'uuid-generator',
    slug: 'uuid-generator',
    title: 'UUID Generator',
    description: 'Generate UUID v1, v4, v5 with bulk generation and validation',
    category: 'utilities',
    icon: '🆔',
    processingType: 'client'
  },
  {
    id: 'text-case-converter',
    slug: 'text-case-converter',
    title: 'Text Case Converter',
    description: 'Convert text between UPPER, lower, Title, camelCase, snake_case',
    category: 'utilities',
    icon: 'Aa',
    processingType: 'client'
  },
  {
    id: 'word-counter',
    slug: 'word-counter',
    title: 'Word Counter',
    description: 'Count words, characters, sentences, paragraphs with reading time',
    category: 'utilities',
    icon: '📊',
    maxFileSize: 10 * 1024 * 1024,
    supportedFormats: ['.txt', '.docx', '.pdf'],
    processingType: 'client'
  },
  {
    id: 'diff-checker',
    slug: 'diff-checker',
    title: 'Text Diff Checker',
    description: 'Compare two texts and highlight differences with side-by-side view',
    category: 'utilities',
    icon: '🔍',
    processingType: 'client'
  },
  {
    id: 'markdown-editor',
    slug: 'markdown-editor',
    title: 'Markdown Editor',
    description: 'Edit and preview Markdown with live rendering and export options',
    category: 'utilities',
    icon: '📝',
    maxFileSize: 10 * 1024 * 1024,
    supportedFormats: ['.md', '.txt'],
    processingType: 'client'
  }
];

export const CATEGORIES = {
  pdf: {
    name: 'PDF Tools',
    description: 'Professional PDF processing and conversion tools',
    icon: '📄',
    color: 'from-red-500 to-pink-500'
  },
  image: {
    name: 'Image Tools',
    description: 'Advanced image processing, editing, and optimization',
    icon: '🖼️',
    color: 'from-blue-500 to-cyan-500'
  },
  qr: {
    name: 'QR & Barcode',
    description: 'QR code and barcode generation with advanced customization',
    icon: '📱',
    color: 'from-green-500 to-emerald-500'
  },
  code: {
    name: 'Code Tools',
    description: 'Developer tools for code formatting, validation, and conversion',
    icon: '💻',
    color: 'from-purple-500 to-violet-500'
  },
  seo: {
    name: 'SEO Tools',
    description: 'Search engine optimization and website analysis tools',
    icon: '📈',
    color: 'from-orange-500 to-red-500'
  },
  network: {
    name: 'Network Tools',
    description: 'Network analysis, monitoring, and diagnostic utilities',
    icon: '🌐',
    color: 'from-teal-500 to-blue-500'
  },
  utilities: {
    name: 'Utilities',
    description: 'Essential utility tools for productivity and daily tasks',
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

export function getToolsByProcessingType(type: 'client' | 'wasm' | 'worker'): Tool[] {
  return TOOLS.filter(tool => tool.processingType === type);
}

export function getPremiumTools(): Tool[] {
  return TOOLS.filter(tool => tool.premium);
}

export function getBulkSupportTools(): Tool[] {
  return TOOLS.filter(tool => tool.bulkSupport);
}