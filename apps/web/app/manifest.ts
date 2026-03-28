import { type MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HorecaMe — B2B HORECA Marketplace',
    short_name: 'HorecaMe',
    description: 'B2B marketplace for the HORECA sector in Montenegro and the Adriatic.',
    start_url: '/me',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#0F1A21',
    theme_color: '#2D4654',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['business', 'food'],
    lang: 'me',
    dir: 'ltr',
    prefer_related_applications: false,
  };
}
