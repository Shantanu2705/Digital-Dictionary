import { MetadataRoute } from 'next';
import { POSTS } from '@/data/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://digitaldictionary.in';

  const routes = ['', '/about', '/portfolio', '/contact', '/blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const services = [
    'digital-marketing',
    'web-development',
    'software-development',
    'ecommerce-development',
    'app-development',
    'brand-identity-design',
    'website-design',
    'seo-service'
  ].map((service) => ({
    url: `${baseUrl}/${service}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const blogPosts = POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(post.date).toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...services, ...blogPosts];
}
