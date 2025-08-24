"use client";

import { useState, useEffect } from 'react';
import { Search, ArrowRight, Zap, TrendingUp, Users, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AdBanner } from '@/components/ads/AdBanner';
import { useDomain } from '@/lib/hooks/useDomain';
import { CATEGORIES } from '@/lib/config/tools';
import Link from 'next/link';

export default function Home() {
  const { domainConfig, availableTools, isLoading, isGlobal } = useDomain();
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading || !domainConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const filteredTools = availableTools.filter(tool =>
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categorizedTools = domainConfig.categories.reduce((acc, categoryId) => {
    const category = CATEGORIES[categoryId as keyof typeof CATEGORIES];
    const categoryTools = availableTools.filter(tool => tool.category === categoryId);
    
    if (categoryTools.length > 0) {
      acc[categoryId] = {
        ...category,
        tools: categoryTools
      };
    }
    
    return acc;
  }, {} as any);

  return (
    <div 
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${domainConfig.primaryColor}10, ${domainConfig.secondaryColor}10)`
      }}
    >
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        {/* Ad Banner - Header */}
        <AdBanner slot="header-banner" format="horizontal" className="mb-8" />
        
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {isGlobal ? 'Complete Suite of' : domainConfig.name}
            <span 
              className="bg-clip-text text-transparent ml-2"
              style={{
                background: `linear-gradient(135deg, ${domainConfig.primaryColor}, ${domainConfig.secondaryColor})`
              }}
            >
              {isGlobal ? 'Professional Tools' : 'Tools'}
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {domainConfig.description}. Fast, secure, and completely free to use.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg bg-white/80 backdrop-blur-sm border-gray-200"
              style={{
                focusBorderColor: domainConfig.primaryColor,
                focusRingColor: domainConfig.primaryColor
              }}
            />
          </div>

          {/* Stats */}
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{availableTools.length}+ Tools Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>100% Free to Use</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Privacy Focused</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="container mx-auto px-4 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {searchTerm ? (
              /* Search Results */
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Search Results ({filteredTools.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTools.map(tool => (
                    <Link key={tool.id} href={`/${tool.slug}`}>
                      <Card className="group bg-white/80 backdrop-blur-sm border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                        <CardHeader className="pb-4">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="p-3 rounded-lg text-white group-hover:scale-110 transition-transform duration-300"
                              style={{
                                background: `linear-gradient(135deg, ${domainConfig.primaryColor}, ${domainConfig.secondaryColor})`
                              }}
                            >
                              <span className="text-lg">{tool.icon}</span>
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg text-gray-800">{tool.title}</CardTitle>
                              <CardDescription className="text-gray-600">
                                {tool.description}
                              </CardDescription>
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              /* Category Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(categorizedTools).map(([categoryId, category]) => (
                  <Card key={categoryId} className="group bg-white/80 backdrop-blur-sm border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div 
                          className={`p-3 bg-gradient-to-r ${category.color} rounded-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          <span className="text-white text-xl">{category.icon}</span>
                        </div>
                        <div>
                          <CardTitle className="text-xl text-gray-800">{category.name}</CardTitle>
                          <CardDescription className="text-gray-600">
                            {category.description}
                          </CardDescription>
                        </div>
                      </div>
                      
                      {/* Tool List */}
                      <div className="space-y-2">
                        {category.tools.slice(0, 6).map((tool: any) => (
                          <Link key={tool.id} href={`/${tool.slug}`}>
                            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group/tool">
                              <span className="text-sm text-gray-700 group-hover/tool:text-blue-600 transition-colors">
                                {tool.title}
                              </span>
                              <ArrowRight className="h-4 w-4 text-gray-400 group-hover/tool:text-blue-600 group-hover/tool:translate-x-1 transition-all duration-200" />
                            </div>
                          </Link>
                        ))}
                        
                        {category.tools.length > 6 && (
                          <Link href={`/category/${categoryId}`}>
                            <div className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-50 transition-colors text-blue-600 hover:text-blue-700">
                              <span className="text-sm font-medium">
                                View all {category.tools.length} tools
                              </span>
                            </div>
                          </Link>
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            {/* Ad Banner - Sidebar */}
            <AdBanner slot="sidebar-banner" format="rectangle" className="sticky top-20" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white/60 backdrop-blur-sm border-y border-gray-200 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Why Choose {domainConfig.name}?</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built with modern web technologies to provide you with the best online tool experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background: `linear-gradient(135deg, ${domainConfig.primaryColor}, ${domainConfig.secondaryColor})`
                }}
              >
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Lightning Fast</h4>
              <p className="text-gray-600">Client-side processing for maximum speed and privacy</p>
            </div>
            
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background: `linear-gradient(135deg, ${domainConfig.primaryColor}, ${domainConfig.secondaryColor})`
                }}
              >
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Privacy Focused</h4>
              <p className="text-gray-600">Your files never leave your browser - complete privacy</p>
            </div>
            
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background: `linear-gradient(135deg, ${domainConfig.primaryColor}, ${domainConfig.secondaryColor})`
                }}
              >
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Always Updated</h4>
              <p className="text-gray-600">Regular updates with new tools and improved functionality</p>
            </div>
          </div>
        </div>
      </section>

      {/* Inline Ad */}
      <section className="container mx-auto px-4 py-8">
        <AdBanner slot="inline-banner" format="horizontal" responsive={true} />
      </section>
    </div>
  );
}