'use client';

import Link from 'next/link';
import { useDomain } from '@/lib/hooks/useDomain';
import { DOMAINS } from '@/lib/config/domains';
import { CATEGORIES } from '@/lib/config/tools';

export function Footer() {
  const { domainConfig, availableTools } = useDomain();

  if (!domainConfig) return null;

  const otherDomains = Object.values(DOMAINS).filter(d => 
    d.host !== domainConfig.host && !d.isGlobal
  );

  const popularTools = availableTools.filter(tool => tool.featured).slice(0, 6);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div 
                className="p-2 rounded-lg text-white text-xl"
                style={{ 
                  background: `linear-gradient(135deg, ${domainConfig.primaryColor}, ${domainConfig.secondaryColor})` 
                }}
              >
                {domainConfig.logo}
              </div>
              <span className="text-xl font-bold">{domainConfig.name}</span>
            </div>
            <p className="text-gray-400 mb-4">
              {domainConfig.description}
            </p>
            <div className="text-sm text-gray-500">
              © 2025 Pixora Tools. All rights reserved.
            </div>
          </div>

          {/* Popular Tools */}
          <div>
            <h3 className="font-semibold mb-4">Popular Tools</h3>
            <ul className="space-y-2">
              {popularTools.map(tool => (
                <li key={tool.id}>
                  <Link 
                    href={`/${tool.slug}`}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {domainConfig.categories.map(categoryId => {
                const category = CATEGORIES[categoryId as keyof typeof CATEGORIES];
                return (
                  <li key={categoryId}>
                    <Link 
                      href={`/category/${categoryId}`}
                      className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-2"
                    >
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Other Pixora Tools */}
          <div>
            <h3 className="font-semibold mb-4">Other Pixora Tools</h3>
            <ul className="space-y-2">
              {otherDomains.slice(0, 6).map(domain => (
                <li key={domain.host}>
                  <a 
                    href={`https://${domain.host}`}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{domain.logo}</span>
                    <span>{domain.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                Contact
              </Link>
            </div>
            <div className="text-sm text-gray-500">
              Built with Next.js • Powered by Pixora
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}