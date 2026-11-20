import { MetadataRoute } from 'next';
import { POSTS } from '@/data/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://digitaldictionary.in';

  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/careers', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/services', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/portfolio', priority: 0.85, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/blog', priority: 0.8, changeFrequency: 'weekly' as const },
  ].map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const services = [
    'digital-marketing',
    'web-development',
    'software-development',
    'ecommerce-development',
    'app-development',
    'graphics-designing',
    'website-designing',
    'domain-hosting',
    'product-photography',
    'commercial-ads',
    'seo',
    'google-ads',
    'meta-ads',
    'social-media-marketing',
    'content-marketing',
    'corporate-websites',
    'ecommerce-stores',
    'web-portals',
    'landing-pages',
    'ui-ux-design',
    'wireframing',
    'prototyping',
    'website-revamp',
    'custom-software',
    'saas-development',
    'crm-systems',
    'erp-solutions',
    'ios-development',
    'android-development',
    'cross-platform-apps',
    'logo-design',
    'brand-identity',
    'video-production'
  ].map((service) => ({
    url: `${baseUrl}/${service}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const blogPosts = POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(post.date).toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...services, ...blogPosts];
}
