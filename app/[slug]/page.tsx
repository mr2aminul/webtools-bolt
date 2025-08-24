import { notFound } from 'next/navigation';
import { getToolBySlug, TOOLS } from '@/lib/config/tools';
import { getDomainConfig } from '@/lib/config/domains';
import { headers } from 'next/headers';
import { ToolPageClient } from '@/components/tools/ToolPageClient';

// Generate static params for all tools
export async function generateStaticParams() {
  return TOOLS.map((tool) => ({
    slug: tool.slug,
  }));
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getToolBySlug(params.slug);
  
  if (!tool) {
    notFound();
  }

  return <ToolPageClient tool={tool} />;
}