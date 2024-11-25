/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/t/p/original/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/oscars/movies',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
