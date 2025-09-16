import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '', // すべてのパスを許可
    },
    sitemap: 'https://www.cloud-palette.com/sitemap.xml',
  };
}
