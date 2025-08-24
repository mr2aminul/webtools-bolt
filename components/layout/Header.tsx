'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDomain } from '@/lib/hooks/useDomain';
import { CATEGORIES, TOOLS } from '@/lib/config/tools';
import { DOMAINS } from '@/lib/config/domains';

export function Header() {
  const { domainConfig, availableTools, isGlobal } = useDomain();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  if (!domainConfig) return null;

  const filteredTools = availableTools.filter(tool =>
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const otherDomains = Object.values(DOMAINS).filter(d => 
    d.host !== domainConfig.host && !d.isGlobal
  );

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div 
              className="p-2 rounded-lg text-white text-xl"
              style={{ 
                background: `linear-gradient(135deg, ${domainConfig.primaryColor}, ${domainConfig.secondaryColor})` 
              }}
            >
              {domainConfig.logo}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{domainConfig.name}</h1>
              <p className="text-xs text-gray-600 hidden sm:block">{domainConfig.description}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {/* Tools Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors">
                <span>Tools</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-3">
                    {domainConfig.categories.map(categoryId => {
                      const category = CATEGORIES[categoryId as keyof typeof CATEGORIES];
                      const categoryTools = availableTools.filter(tool => tool.category === categoryId);
                      
                      return (
                        <div key={categoryId} className="border-b border-gray-100 last:border-b-0 pb-3 last:pb-0">
                          <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                          </h3>
                          <div className="grid grid-cols-2 gap-1">
                            {categoryTools.slice(0, 6).map(tool => (
                              <Link
                                key={tool.id}
                                href={`/${tool.slug}`}
                                className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-2 py-1 rounded transition-colors"
                              >
                                {tool.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Other Tools (for non-global domains) */}
            {!isGlobal && (
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors">
                  <span>More Tools</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Other Pixora Tools</h3>
                    <div className="space-y-2">
                      {otherDomains.map(domain => (
                        <a
                          key={domain.host}
                          href={`https://${domain.host}`}
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div 
                            className="p-1 rounded text-white text-sm"
                            style={{ 
                              background: `linear-gradient(135deg, ${domain.primaryColor}, ${domain.secondaryColor})` 
                            }}
                          >
                            {domain.logo}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{domain.name}</div>
                            <div className="text-xs text-gray-600">{domain.description}</div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Link href="/pricing" className="text-gray-700 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors lg:hidden"
              >
                <Search className="h-5 w-5" />
              </button>
              
              <div className="hidden lg:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
                
                {searchQuery && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
                    <div className="p-2">
                      {filteredTools.length > 0 ? (
                        filteredTools.map(tool => (
                          <Link
                            key={tool.id}
                            href={`/${tool.slug}`}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            onClick={() => setSearchQuery('')}
                          >
                            <span className="text-lg">{tool.icon}</span>
                            <div>
                              <div className="font-medium text-gray-900">{tool.title}</div>
                              <div className="text-sm text-gray-600">{tool.description}</div>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="p-3 text-center text-gray-500">No tools found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button variant="outline" size="sm">
              Sign In
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors lg:hidden"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {showSearch && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {searchQuery && filteredTools.length > 0 && (
              <div className="mt-2 space-y-1">
                {filteredTools.slice(0, 5).map(tool => (
                  <Link
                    key={tool.id}
                    href={`/${tool.slug}`}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setSearchQuery('');
                      setShowSearch(false);
                    }}
                  >
                    <span className="text-lg">{tool.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">{tool.title}</div>
                      <div className="text-sm text-gray-600">{tool.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <nav className="space-y-4">
              {domainConfig.categories.map(categoryId => {
                const category = CATEGORIES[categoryId as keyof typeof CATEGORIES];
                return (
                  <div key={categoryId}>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </h3>
                    <div className="ml-6 space-y-1">
                      {availableTools
                        .filter(tool => tool.category === categoryId)
                        .slice(0, 4)
                        .map(tool => (
                          <Link
                            key={tool.id}
                            href={`/${tool.slug}`}
                            className="block text-gray-600 hover:text-gray-900 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {tool.title}
                          </Link>
                        ))}
                    </div>
                  </div>
                );
              })}
              
              <div className="pt-4 border-t border-gray-200">
                <Link
                  href="/pricing"
                  className="block text-gray-700 hover:text-gray-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}